<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreWithdrawalRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\WithdrawalResource;
use App\Models\Transaction;
use App\Models\Withdrawal;
use App\Support\DealMailService;
use App\Support\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function __construct(
        private readonly DealMailService $dealMail,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Withdrawal::class);

        $query = Withdrawal::query()
            ->where('user_id', $request->user()->id)
            ->with('transaction')
            ->latest();

        if ($search = trim((string) $request->query('q', ''))) {
            $like = '%'.addcslashes($search, '%_\\').'%';
            $query->where(function ($inner) use ($like): void {
                $inner->where('ulid', 'like', $like)
                    ->orWhere('method', 'like', $like)
                    ->orWhere('status', 'like', $like);
            });
        }

        $status = $request->query('status');
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $withdrawals = $query->paginate(
            perPage: min(50, max(1, (int) $request->query('per_page', 15)))
        );

        return WithdrawalResource::collection($withdrawals)->response();
    }

    public function store(StoreWithdrawalRequest $request, WalletService $wallet): JsonResponse
    {
        $this->authorize('create', Withdrawal::class);

        $data = $request->validated();
        $transaction = null;

        if (! empty($data['transaction_id'])) {
            $transaction = Transaction::query()
                ->with('parties')
                ->where('ulid', $data['transaction_id'])
                ->first();

            if (! $transaction) {
                abort(404, 'Transaction not found.');
            }
        }

        $withdrawal = $wallet->createWithdrawal(
            $request->user(),
            (float) $data['amount'],
            $transaction,
        );

        $this->dealMail->sendWithdrawalRequested(
            $request->user(),
            $withdrawal->load('transaction'),
        );

        return response()->json([
            'data' => new WithdrawalResource($withdrawal),
            'user' => new UserResource($request->user()->fresh()),
        ], 201);
    }
}
