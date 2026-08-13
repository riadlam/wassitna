<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, Transaction $transaction): bool
    {
        return $this->isMember($user, $transaction);
    }

    public function create(User $user): bool
    {
        return $user->isActive();
    }

    public function update(User $user, Transaction $transaction): bool
    {
        return $this->isMember($user, $transaction);
    }

    public function accept(User $user, Transaction $transaction): bool
    {
        if ($transaction->status !== 'pending_acceptance') {
            return false;
        }

        $party = $transaction->relationLoaded('parties')
            ? $transaction->partyForUser($user)
            : $transaction->load('parties')->partyForUser($user);

        if (! $party || $party->invite_status === 'accepted') {
            return false;
        }

        return $party?->role === 'buyer';
    }

    public function pay(User $user, Transaction $transaction): bool
    {
        if ($transaction->status !== 'awaiting_payment') {
            return false;
        }

        $party = $transaction->relationLoaded('parties')
            ? $transaction->partyForUser($user)
            : $transaction->load('parties')->partyForUser($user);

        return $party?->role === 'buyer';
    }

    public function deliver(User $user, Transaction $transaction): bool
    {
        if ($transaction->status !== 'awaiting_delivery') {
            return false;
        }

        $party = $transaction->relationLoaded('parties')
            ? $transaction->partyForUser($user)
            : $transaction->load('parties')->partyForUser($user);

        return in_array($party?->role, ['buyer', 'seller'], true);
    }

    public function inspect(User $user, Transaction $transaction): bool
    {
        if ($transaction->status !== 'awaiting_inspection') {
            return false;
        }

        $party = $transaction->relationLoaded('parties')
            ? $transaction->partyForUser($user)
            : $transaction->load('parties')->partyForUser($user);

        return $party?->role === 'buyer';
    }

    private function isMember(User $user, Transaction $transaction): bool
    {
        if (! $user->isActive()) {
            return false;
        }

        if ((int) $transaction->created_by === (int) $user->id) {
            return true;
        }

        if ($transaction->relationLoaded('parties')) {
            return $transaction->partyForUser($user) !== null;
        }

        $email = strtolower((string) $user->email);

        return $transaction->parties()
            ->where(function ($query) use ($user, $email): void {
                $query->where('user_id', $user->id)
                    ->orWhereRaw('LOWER(email) = ?', [$email]);
            })
            ->exists();
    }
}
