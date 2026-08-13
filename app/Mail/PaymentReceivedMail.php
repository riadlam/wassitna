<?php

namespace App\Mail;

use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentReceivedMail extends Mailable
{
    use BrandsTransactionalMail, Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public string $recipientName,
        public bool $forSeller,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->forSeller
                ? 'Buyer paid — deliver your Wassitna deal'
                : 'Payment confirmed — Wassitna is holding the funds',
        );
    }

    public function content(): Content
    {
        $base = rtrim((string) config('app.url', 'https://wassitna.com'), '/');
        $method = strtoupper((string) ($this->transaction->payment_method ?: 'escrow'));

        return new Content(
            html: 'emails.payment-received',
            text: 'emails.payment-received-text',
            with: $this->brandPayload([
                'name' => $this->recipientName,
                'title' => $this->transaction->title,
                'ulid' => $this->transaction->ulid,
                'amountLabel' => Money::da($this->transaction->buyer_total),
                'paymentMethod' => $method,
                'forSeller' => $this->forSeller,
                'actionUrl' => $base.'/transaction/'.$this->transaction->ulid,
            ]),
        );
    }
}
