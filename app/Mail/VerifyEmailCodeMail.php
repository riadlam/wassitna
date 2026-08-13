<?php

namespace App\Mail;

use App\Models\User;
use App\Support\EmailVerificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $code,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Wassitna verification code',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.verify-email-code',
            text: 'emails.verify-email-code-text',
            with: [
                'name' => $this->user->name,
                'greetingName' => trim((string) $this->user->name) !== ''
                    ? ' '.trim((string) $this->user->name)
                    : '',
                'email' => $this->user->email,
                'code' => $this->code,
                'minutes' => EmailVerificationService::CODE_TTL_MINUTES,
                'brandName' => config('app.name', 'Wassitna'),
                'brandUrl' => config('app.url', 'https://wassitna.com'),
                'brandColor' => '#3cb95d',
                'brandDark' => '#01426a',
            ],
        );
    }
}
