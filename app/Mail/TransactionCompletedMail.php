<?php

namespace App\Mail;

use App\Models\Transaction;
use App\Support\Money;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionCompletedMail extends Mailable
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
            subject: 'Wassitna deal completed — '.$this->transaction->title,
        );
    }

    public function content(): Content
    {
        $base = rtrim((string) config('app.url', 'https://wassitna.com'), '/');

        return new Content(
            html: 'emails.transaction-completed',
            text: 'emails.transaction-completed-text',
            with: $this->brandPayload([
                'name' => $this->recipientName,
                'title' => $this->transaction->title,
                'ulid' => $this->transaction->ulid,
                'amountLabel' => Money::da($this->transaction->buyer_total),
                'sellerProceedsLabel' => Money::da($this->transaction->seller_proceeds),
                'forSeller' => $this->forSeller,
                'actionUrl' => $base.'/transaction/'.$this->transaction->ulid,
            ]),
        );
    }
}
