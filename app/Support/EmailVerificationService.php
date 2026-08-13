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

    public function remainingCooldown(User $user): int
    {
        $latest = EmailVerificationCode::query()
            ->where('user_id', $user->id)
            ->latest('sent_at')
            ->first();

        if (! $latest?->sent_at) {
            return 0;
        }

        $availableAt = $latest->sent_at->copy()->addSeconds(self::RESEND_COOLDOWN_SECONDS);

        if ($availableAt->lte(now())) {
            return 0;
        }

        $remaining = $availableAt->getTimestamp() - now()->getTimestamp();

        return $remaining > 0 ? $remaining : 0;
    }

    public function assertCanResend(User $user): void
    {
        $wait = $this->remainingCooldown($user);

        if ($wait > 0) {
            throw ValidationException::withMessages([
                'code' => ["Please wait {$wait} seconds before requesting another code."],
            ]);
        }
    }

    public function resend(User $user): int
    {
        if ($user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Your email is already verified.'],
            ]);
        }

        $this->assertCanResend($user);
        $this->issue($user);

        return self::RESEND_COOLDOWN_SECONDS;
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
