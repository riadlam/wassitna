<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\TransactionParty;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;

class InvoicePdfService
{
    public function download(Transaction $transaction): Response
    {
        $transaction->loadMissing(['items', 'parties.user']);

        $filename = 'wassitna-invoice-'.$transaction->ulid.'.pdf';

        return Pdf::loadView('invoices.transaction', $this->viewData($transaction))
            ->setPaper('a4')
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isRemoteEnabled', false)
            ->setOption('defaultFont', 'DejaVu Sans')
            ->download($filename);
    }

    /**
     * @return array<string, mixed>
     */
    private function viewData(Transaction $transaction): array
    {
        $buyer = $transaction->parties->firstWhere('role', 'buyer');
        $seller = $transaction->parties->firstWhere('role', 'seller');
        $categories = Category::query()->get()->keyBy('slug');

        $items = $transaction->items->map(function ($item) use ($categories) {
            $qty = max(1, (int) $item->quantity);
            $unit = (float) $item->price;
            $category = $categories->get($item->category);

            return [
                'name' => $item->name,
                'description' => $item->description,
                'category' => $category?->label('en') ?: (string) $item->category,
                'quantity' => $qty,
                'unit_label' => Money::da($unit),
                'total_label' => Money::da($unit * $qty),
            ];
        });

        $issuedAt = $transaction->wallet_credited_at
            ?: ($transaction->status === 'completed' ? $transaction->updated_at : $transaction->created_at);

        $logoPath = resource_path('images/invoice-logo.jpg');
        $logoMime = 'image/jpeg';
        if (! is_file($logoPath)) {
            $logoPath = public_path('vendor/escrow/images/escrow-pay/logo.png');
            $logoMime = 'image/png';
        }
        $logoSrc = is_file($logoPath)
            ? 'data:'.$logoMime.';base64,'.base64_encode((string) file_get_contents($logoPath))
            : null;

        return [
            'brandName' => config('app.name', 'Wassitna'),
            'brandUrl' => rtrim((string) config('app.url', 'https://wassitna.com'), '/'),
            'brandColor' => '#3cb95d',
            'brandDark' => '#01426a',
            'logoSrc' => $logoSrc,
            'invoiceNumber' => 'INV-'.strtoupper(substr((string) $transaction->ulid, 0, 10)),
            'reference' => $transaction->ulid,
            'title' => $transaction->title,
            'statusLabel' => $this->statusLabel($transaction->status),
            'currency' => strtoupper((string) ($transaction->currency ?: 'DZD')),
            'issuedLabel' => $this->formatDate($issuedAt),
            'createdLabel' => $this->formatDate($transaction->created_at),
            'paidLabel' => $this->formatDate($transaction->terms_accepted_at),
            'completedLabel' => $transaction->status === 'completed' ? $this->formatDate($issuedAt) : '—',
            'paymentMethod' => $this->paymentMethodLabel($transaction->payment_method),
            'inspectionDays' => (int) $transaction->inspection_period_days,
            'feePayer' => $transaction->fee_payer === 'seller' ? 'Seller' : 'Buyer',
            'buyer' => $this->partyPayload($buyer),
            'seller' => $this->partyPayload($seller),
            'items' => $items,
            'subtotalLabel' => Money::da($transaction->subtotal),
            'feeLabel' => Money::da($transaction->fee_amount),
            'feeRateLabel' => $this->feeRateLabel($transaction->fee_rate),
            'totalLabel' => Money::da($transaction->buyer_total),
            'sellerProceedsLabel' => Money::da($transaction->seller_proceeds),
        ];
    }

    /**
     * @return array{name: string, email: string, phone: string, role: string}
     */
    private function partyPayload(?TransactionParty $party): array
    {
        $email = (string) ($party?->email ?: '');
        $name = trim((string) ($party?->user?->name ?: ''));

        return [
            'name' => $name !== '' ? $name : ($email !== '' ? $email : '—'),
            'email' => $email !== '' ? $email : '—',
            'phone' => (string) ($party?->phone ?: '—'),
            'role' => $party?->role === 'seller' ? 'Seller' : 'Buyer',
        ];
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'completed' => 'Paid / Completed',
            'awaiting_payment' => 'Awaiting payment',
            'awaiting_delivery' => 'Awaiting delivery',
            'awaiting_inspection' => 'Inspection',
            'disputed' => 'Disputed',
            'cancelled' => 'Cancelled',
            default => 'Open',
        };
    }

    private function paymentMethodLabel(?string $method): string
    {
        return match ($method) {
            'cib_dahabia' => 'CIB / Dahabia',
            'wire' => 'Bank transfer',
            default => 'Escrow',
        };
    }

    private function feeRateLabel(mixed $rate): string
    {
        $value = (float) $rate;
        if ($value <= 0) {
            return 'Free';
        }

        return rtrim(rtrim(number_format($value * 100, 2, '.', ''), '0'), '.').'%';
    }

    private function formatDate(mixed $value): string
    {
        if (! $value) {
            return '—';
        }

        $date = $value instanceof Carbon ? $value : Carbon::parse($value);

        return $date->timezone('Africa/Algiers')->format('d M Y, H:i').' (Algeria)';
    }
}
