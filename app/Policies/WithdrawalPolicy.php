<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Withdrawal;

class WithdrawalPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive() && $user->hasSellerWallet();
    }

    public function view(User $user, Withdrawal $withdrawal): bool
    {
        return $user->isActive() && (int) $withdrawal->user_id === (int) $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->hasSellerWallet();
    }
}
