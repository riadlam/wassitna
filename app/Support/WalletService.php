<?php

namespace App\Support;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WalletService
{
    public function creditSellerOnComplete(Transaction $transaction): void
    {
        if ($transaction->status !== 'completed' || $transaction->wallet_credited_at) {
            return;
        }

        $seller = $this->lockedSellerUser($transaction);
        if (! $seller) {
            return;
        }

        $seller->wallet = round(((float) $seller->wallet) + ((float) $transaction->seller_proceeds), 2);
        $seller->save();

        $transaction->wallet_credited_at = now();
        $transaction->save();

        $party = $transaction->parties->firstWhere('role', 'seller');
        if ($party && ! $party->user_id) {
            $party->update(['user_id' => $seller->id]);
        }
    }

    public function createWithdrawal(User $user, float $amount, ?Transaction $transaction = null): Withdrawal
    {
        return DB::transaction(function () use ($user, $amount, $transaction) {
            $locked = User::query()->lockForUpdate()->findOrFail($user->id);
            $amount = round($amount, 2);
            $wallet = round((float) $locked->wallet, 2);

            if ($amount < 1) {
                throw ValidationException::withMessages([
                    'amount' => ['Enter at least 1 DA.'],
                ]);
            }

            if ($amount > $wallet) {
                throw ValidationException::withMessages([
                    'amount' => ['Amount is higher than your wallet balance.'],
                ]);
            }

            if (! $locked->payout_method) {
                throw ValidationException::withMessages([
                    'payout_method' => ['Save your CCP or BaridiMob details first.'],
                ]);
            }

            if ($transaction) {
                $lockedTx = Transaction::query()->lockForUpdate()->with('parties')->findOrFail($transaction->id);

                if ($lockedTx->status !== 'completed') {
                    throw ValidationException::withMessages([
                        'transaction_id' => ['This transaction is not closed yet.'],
                    ]);
                }

                $seller = $lockedTx->partyForUser($locked);
                if ($seller?->role !== 'seller') {
                    throw ValidationException::withMessages([
                        'transaction_id' => ['Only the seller can withdraw this deal.'],
                    ]);
                }

                if (Withdrawal::query()->where('transaction_id', $lockedTx->id)->exists()) {
                    throw ValidationException::withMessages([
                        'transaction_id' => ['This deal was already withdrawn.'],
                    ]);
                }

                $max = round((float) $lockedTx->seller_proceeds, 2);
                if ($amount > $max) {
                    throw ValidationException::withMessages([
                        'amount' => ['Amount cannot exceed this deal’s seller proceeds.'],
                    ]);
                }
            }

            $locked->wallet = round($wallet - $amount, 2);
            $locked->save();

            try {
                return Withdrawal::query()->create([
                    'user_id' => $locked->id,
                    'transaction_id' => $transaction?->id,
                    'amount' => $amount,
                    'currency' => $transaction?->currency ?: 'DZD',
                    'method' => $locked->payout_method,
                    'ccp_number' => $locked->payout_method === 'ccp' ? $locked->ccp_number : null,
                    'cle' => $locked->payout_method === 'ccp' ? $locked->cle : null,
                    'account_holder_name' => $locked->payout_method === 'ccp' ? $locked->account_holder_name : null,
                    'rip_baridimob' => $locked->payout_method === 'baridimob' ? $locked->rip_baridimob : null,
                    'status' => 'pending',
                ]);
            } catch (QueryException $e) {
                throw ValidationException::withMessages([
                    'transaction_id' => ['This deal was already withdrawn.'],
                ]);
            }
        });
    }

    public function lockedSellerUser(Transaction $transaction): ?User
    {
        if (! $transaction->relationLoaded('parties')) {
            $transaction->load('parties');
        }

        $party = $transaction->parties->firstWhere('role', 'seller');
        if (! $party) {
            return null;
        }

        if ($party->user_id) {
            return User::query()->lockForUpdate()->find($party->user_id);
        }

        return User::query()
            ->lockForUpdate()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $party->email)])
            ->first();
    }
}
