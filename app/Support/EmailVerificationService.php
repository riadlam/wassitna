<?php

namespace App\Support;

use App\Mail\VerifyEmailCodeMail;
use App\Models\EmailVerificationCode;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class EmailVerificationService
{
    public const CODE_TTL_MINUTES = 15;

    public const MAX_ATTEMPTS = 5;

    public const RESEND_COOLDOWN_SECONDS = 60;

    public function issue(User $user): void
    {
        EmailVerificationCode::query()->where('user_id', $user->id)->delete();

        $plain = (string) random_int(100000, 999999);

        EmailVerificationCode::query()->create([
            'user_id' => $user->id,
            'code_hash' => Hash::make($plain),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(self::CODE_TTL_MINUTES),
            'sent_at' => now(),
        ]);

        Mail::to($user->email)->send(new VerifyEmailCodeMail($user, $plain));
    }

    public function resend(User $user): void
    {
        if ($user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Your email is already verified.'],
            ]);
        }

        $latest = EmailVerificationCode::query()
            ->where('user_id', $user->id)
            ->latest('sent_at')
            ->first();

        if ($latest && $latest->sent_at->gt(now()->subSeconds(self::RESEND_COOLDOWN_SECONDS))) {
            $elapsed = (int) $latest->sent_at->diffInSeconds(now());
            $wait = max(1, self::RESEND_COOLDOWN_SECONDS - $elapsed);
            throw ValidationException::withMessages([
                'code' => ["Please wait {$wait} seconds before requesting another code."],
            ]);
        }

        $this->issue($user);
    }

    public function verify(User $user, string $code): void
    {
        if ($user->hasVerifiedEmail()) {
            return;
        }

        $record = EmailVerificationCode::query()
            ->where('user_id', $user->id)
            ->latest('sent_at')
            ->first();

        if (! $record || $record->isExpired()) {
            throw ValidationException::withMessages([
                'code' => ['This code has expired. Request a new one.'],
            ]);
        }

        if ($record->attempts >= self::MAX_ATTEMPTS) {
            throw ValidationException::withMessages([
                'code' => ['Too many attempts. Request a new code.'],
            ]);
        }

        $record->increment('attempts');

        if (! Hash::check(trim($code), $record->code_hash)) {
            throw ValidationException::withMessages([
                'code' => ['Invalid verification code.'],
            ]);
        }

        $user->forceFill(['email_verified_at' => now()])->save();
        EmailVerificationCode::query()->where('user_id', $user->id)->delete();
    }
}
