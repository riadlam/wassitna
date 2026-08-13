<?php

namespace App\Mail;

use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionOpenedMail extends Mailable
{
    use BrandsTransactionalMail, Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public string $recipientEmail,
        public string $recipientName,
        public string $role,
        public bool $isInvite,
        public string $creatorName = '',
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->isInvite
                ? 'You are invited to a Wassitna escrow deal'
                : 'Your Wassitna transaction is open',
        );
    }

    public function content(): Content
    {
        $base = rtrim((string) config('app.url', 'https://wassitna.com'), '/');

        return new Content(
            html: 'emails.transaction-opened',
            text: 'emails.transaction-opened-text',
            with: $this->brandPayload([
                'name' => $this->recipientName,
                'title' => $this->transaction->title,
                'ulid' => $this->transaction->ulid,
                'amountLabel' => Money::da($this->transaction->buyer_total),
                'roleLabel' => ucfirst($this->role),
                'isInvite' => $this->isInvite,
                'creatorName' => $this->creatorName,
                'actionUrl' => $base.'/transaction/'.$this->transaction->ulid,
            ]),
        );
    }
}
