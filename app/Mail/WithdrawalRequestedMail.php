<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Withdrawal;
use App\Support\Money;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WithdrawalRequestedMail extends Mailable
{
    use BrandsTransactionalMail, Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public Withdrawal $withdrawal,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Wassitna withdrawal request received',
        );
    }

    public function content(): Content
    {
        $base = rtrim((string) config('app.url', 'https://wassitna.com'), '/');
        $method = $this->withdrawal->method === 'ccp' ? 'CCP' : 'BaridiMob';

        return new Content(
            html: 'emails.withdrawal-requested',
            text: 'emails.withdrawal-requested-text',
            with: $this->brandPayload([
                'name' => $this->user->name,
                'amountLabel' => Money::da($this->withdrawal->amount),
                'methodLabel' => $method,
                'ulid' => $this->withdrawal->ulid,
                'transactionTitle' => $this->withdrawal->transaction?->title,
                'actionUrl' => $base.'/withdrawals',
            ]),
        );
    }
}
