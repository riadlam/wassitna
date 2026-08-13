<?php

namespace App\Support;

use App\Mail\PaymentReceivedMail;
use App\Mail\TransactionCompletedMail;
use App\Mail\TransactionOpenedMail;
use App\Mail\WithdrawalRequestedMail;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\Mail;
use Throwable;

class DealMailService
{
    public function sendTransactionOpened(Transaction $transaction): void
    {
        $transaction->loadMissing(['parties', 'creator']);
        $creator = $transaction->creator;
        $creatorName = $creator?->name ?: (strstr((string) $creator?->email, '@', true) ?: 'Wassitna user');

        foreach ($transaction->parties as $party) {
            $email = strtolower(trim((string) $party->email));
            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }

            $isCreatorParty = $creator && strtolower((string) $creator->email) === $email;
            $name = $party->user?->name;
            if (! $name) {
                $name = $isCreatorParty ? (string) ($creator->name ?? '') : (strstr($email, '@', true) ?: '');
            }

            $this->send(new TransactionOpenedMail(
                transaction: $transaction,
                recipientEmail: $email,
                recipientName: $name,
                role: (string) $party->role,
                isInvite: ! $isCreatorParty,
                creatorName: $creatorName,
            ), $email);
        }
    }

    public function sendPaymentReceived(Transaction $transaction): void
    {
        $transaction->loadMissing('parties');

        foreach (['buyer' => false, 'seller' => true] as $role => $forSeller) {
            $party = $transaction->parties->firstWhere('role', $role);
            $email = strtolower(trim((string) $party?->email));
            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }

            $name = $party->user?->name ?: (strstr($email, '@', true) ?: '');
            $this->send(new PaymentReceivedMail($transaction, $name, $forSeller), $email);
        }
    }

    public function sendTransactionCompleted(Transaction $transaction): void
    {
        $transaction->loadMissing('parties');

        foreach (['buyer' => false, 'seller' => true] as $role => $forSeller) {
            $party = $transaction->parties->firstWhere('role', $role);
            $email = strtolower(trim((string) $party?->email));
            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }

            $name = $party->user?->name ?: (strstr($email, '@', true) ?: '');
            $this->send(new TransactionCompletedMail($transaction, $name, $forSeller), $email);
        }
    }

    public function sendWithdrawalRequested(User $user, Withdrawal $withdrawal): void
    {
        $withdrawal->loadMissing('transaction');
        $email = strtolower(trim((string) $user->email));
        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        $this->send(new WithdrawalRequestedMail($user, $withdrawal), $email);
    }

    private function send(object $mailable, string $email): void
    {
        try {
            Mail::to($email)->send($mailable);
        } catch (Throwable $e) {
            report($e);
        }
    }
}
