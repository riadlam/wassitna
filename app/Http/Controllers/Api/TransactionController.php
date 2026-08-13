<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\DeliverTransactionRequest;
use App\Http\Requests\Api\InspectTransactionRequest;
use App\Http\Requests\Api\PayTransactionRequest;
use App\Http\Requests\Api\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Models\User;
use App\Support\FeeCalculator;
use App\Support\PhoneNormalizer;
use App\Support\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Transaction::class);

        $query = Transaction::query()
            ->forUser($request->user()->id, $request->user()->email)
            ->status($request->query('status'))
            ->latest();

        if ($search = trim((string) $request->query('q', ''))) {
            $like = '%'.addcslashes($search, '%_\\').'%';
            $query->where('title', 'like', $like);
        }

        $transactions = $query->paginate(
            perPage: min(50, max(1, (int) $request->query('per_page', 15)))
        );

        return TransactionResource::collection($transactions)->response();
    }

    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $this->authorize('create', Transaction::class);

        $data = $request->validated();
        $user = $request->user();

        $subtotal = 0.0;
        foreach ($data['items'] as $item) {
            $qty = (int) ($item['quantity'] ?? 1);
            $subtotal += ((float) $item['price']) * $qty;
        }
        $subtotal = round($subtotal, 2);

        try {
            FeeCalculator::assertWithinCap($subtotal);
        } catch (\InvalidArgumentException $e) {
            throw ValidationException::withMessages([
                'items' => [$e->getMessage()],
            ]);
        }

        $feeCalc = FeeCalculator::calculate($subtotal);
        $totals = FeeCalculator::applyFeePayer(
            $feeCalc['capped_amount'],
            $feeCalc['fee'],
            $data['fee_payer']
        );

        $transaction = DB::transaction(function () use ($data, $user, $feeCalc, $totals, $subtotal) {
            $transaction = Transaction::create([
                'created_by' => $user->id,
                'title' => $data['title'],
                'currency' => $data['currency'],
                'inspection_period_days' => $data['inspection_period_days'],
                'creator_role' => $data['role'],
                'status' => 'pending_acceptance',
                'fee_payer' => $data['fee_payer'],
                'subtotal' => $subtotal,
                'fee_amount' => $totals['fee'],
                'fee_rate' => $feeCalc['rate'],
                'buyer_total' => $totals['buyer_total'],
                'seller_proceeds' => $totals['seller_proceeds'],
                'terms_accepted_at' => null,
            ]);

            foreach (array_values($data['items']) as $index => $item) {
                $transaction->items()->create([
                    'category' => $item['category'],
                    'name' => $item['name'],
                    'description' => $item['description'] ?? null,
                    'price' => round((float) $item['price'], 2),
                    'quantity' => (int) ($item['quantity'] ?? 1),
                    'position' => $index,
                ]);
            }

            $this->createParties($transaction, $user, $data);

            return $transaction->load(['items', 'parties']);
        });

        return (new TransactionResource($transaction))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Transaction $transaction): JsonResponse
    {
        $transaction->load(['items', 'parties']);
        $this->authorize('view', $transaction);
        $this->claimParty($transaction, $request->user());

        return (new TransactionResource($transaction->fresh(['items', 'parties'])))->response();
    }

    public function accept(Request $request, Transaction $transaction): JsonResponse
    {
        $transaction->load('parties');
        $this->authorize('accept', $transaction);

        $user = $request->user();
        $party = $transaction->partyForUser($user);

        if (! $party) {
            abort(403);
        }

        DB::transaction(function () use ($transaction, $party, $user): void {
            $party->update([
                'user_id' => $user->id,
                'invite_status' => 'accepted',
            ]);

            $fresh = $transaction->fresh(['parties']);
            if ($this->buyerAndSellerAccepted($fresh)) {
                $fresh->update([
                    'status' => 'awaiting_payment',
                    'terms_accepted_at' => now(),
                ]);
            }
        });

        return (new TransactionResource($transaction->fresh(['items', 'parties'])))->response();
    }

    public function pay(PayTransactionRequest $request, Transaction $transaction): JsonResponse
    {
        $transaction->load('parties');
        $this->authorize('pay', $transaction);

        $method = $request->validated('method');

        $transaction->update([
            'payment_method' => $method,
            'status' => 'awaiting_delivery',
        ]);

        $fresh = $transaction->fresh(['items', 'parties']);

        return (new TransactionResource($fresh))->additional([
            'payment' => [
                'method' => $method,
                'status' => 'received',
                'message' => 'Payment recorded. The seller can now deliver.',
            ],
        ])->response();
    }

    public function deliver(DeliverTransactionRequest $request, Transaction $transaction): JsonResponse
    {
        $transaction->load('parties');
        $this->authorize('deliver', $transaction);

        $party = $transaction->partyForUser($request->user());
        $data = $request->validated();
        $updates = [];

        if ($party?->role === 'seller') {
            if (array_key_exists('note', $data)) {
                $note = trim((string) ($data['note'] ?? ''));
                $updates['delivery_note'] = $note === '' ? null : $note;
            }

            if (! empty($data['sent']) && ! $transaction->delivery_sent_at) {
                $updates['delivery_sent_at'] = now();
            }
        }

        if ($party?->role === 'buyer' && ! empty($data['received']) && ! $transaction->delivery_received_at) {
            $updates['delivery_received_at'] = now();
            $updates['status'] = 'awaiting_inspection';
        }

        if ($updates === []) {
            abort(422, 'Nothing to update.');
        }

        $transaction->update($updates);

        return (new TransactionResource($transaction->fresh(['items', 'parties'])))->response();
    }

    public function inspect(InspectTransactionRequest $request, Transaction $transaction, WalletService $wallet): JsonResponse
    {
        $transaction->load('parties');
        $this->authorize('inspect', $transaction);

        $action = $request->validated('action');

        $fresh = DB::transaction(function () use ($transaction, $action, $wallet) {
            $locked = Transaction::query()->lockForUpdate()->with('parties')->findOrFail($transaction->id);

            if ($locked->status !== 'awaiting_inspection') {
                abort(422, 'Inspection is no longer available.');
            }

            $locked->status = $action === 'approve' ? 'completed' : 'disputed';
            $locked->save();

            if ($action === 'approve') {
                $wallet->creditSellerOnComplete($locked);
            }

            return $locked->fresh(['items', 'parties']);
        });

        return (new TransactionResource($fresh))->response();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function createParties(Transaction $transaction, User $user, array $data): void
    {
        $role = $data['role'];
        $partyEmail = $data['party_email'];
        $partyPhone = PhoneNormalizer::normalize($data['party_phone'] ?? null);

        $transaction->parties()->create([
            'role' => $role,
            'user_id' => $user->id,
            'email' => $user->email,
            'phone' => $user->phone,
            'invite_status' => 'pending',
        ]);

        if ($role === 'broker') {
            $buyerEmail = $data['buyer_email'];
            $transaction->parties()->create([
                'role' => 'buyer',
                'user_id' => $this->findUserIdByEmail($buyerEmail),
                'email' => $buyerEmail,
                'phone' => null,
                'invite_status' => 'pending',
            ]);

            $transaction->parties()->create([
                'role' => 'seller',
                'user_id' => $this->findUserIdByEmail($partyEmail),
                'email' => $partyEmail,
                'phone' => $partyPhone,
                'invite_status' => 'pending',
            ]);

            return;
        }

        $counterRole = $role === 'buyer' ? 'seller' : 'buyer';
        $transaction->parties()->create([
            'role' => $counterRole,
            'user_id' => $this->findUserIdByEmail($partyEmail),
            'email' => $partyEmail,
            'phone' => $partyPhone,
            'invite_status' => 'pending',
        ]);
    }

    private function findUserIdByEmail(string $email): ?int
    {
        return User::query()->where('email', strtolower($email))->value('id');
    }

    private function buyerAndSellerAccepted(Transaction $transaction): bool
    {
        $parties = $transaction->relationLoaded('parties')
            ? $transaction->parties
            : $transaction->parties()->get();

        $buyer = $parties->firstWhere('role', 'buyer');
        $seller = $parties->firstWhere('role', 'seller');

        return $buyer?->invite_status === 'accepted'
            && $seller?->invite_status === 'accepted';
    }

    private function claimParty(Transaction $transaction, User $user): void
    {
        $party = $transaction->partyForUser($user);
        if (! $party || $party->user_id) {
            return;
        }

        $party->update([
            'user_id' => $user->id,
        ]);
        $party->user_id = $user->id;
    }
}
