<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'ulid',
        'created_by',
        'title',
        'currency',
        'inspection_period_days',
        'creator_role',
        'status',
        'fee_payer',
        'payment_method',
        'delivery_note',
        'delivery_sent_at',
        'delivery_received_at',
        'subtotal',
        'fee_amount',
        'fee_rate',
        'buyer_total',
        'seller_proceeds',
        'terms_accepted_at',
        'wallet_credited_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'inspection_period_days' => 'integer',
            'subtotal' => 'decimal:2',
            'fee_amount' => 'decimal:2',
            'fee_rate' => 'decimal:4',
            'buyer_total' => 'decimal:2',
            'seller_proceeds' => 'decimal:2',
            'terms_accepted_at' => 'datetime',
            'delivery_sent_at' => 'datetime',
            'delivery_received_at' => 'datetime',
            'wallet_credited_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Transaction $transaction): void {
            if (empty($transaction->ulid)) {
                $transaction->ulid = (string) Str::ulid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'ulid';
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class)->orderBy('position');
    }

    public function parties(): HasMany
    {
        return $this->hasMany(TransactionParty::class);
    }

    public function withdrawals(): HasMany
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function scopeForUser(Builder $query, int $userId, ?string $email = null): Builder
    {
        $email = $email ? strtolower($email) : null;

        return $query->where(function (Builder $inner) use ($userId, $email): void {
            $inner->where('created_by', $userId)
                ->orWhereHas('parties', function (Builder $parties) use ($userId, $email): void {
                    $parties->where('user_id', $userId);
                    if ($email) {
                        $parties->orWhereRaw('LOWER(email) = ?', [$email]);
                    }
                });
        });
    }

    public function partyForUser(User $user): ?TransactionParty
    {
        $email = strtolower((string) $user->email);

        return $this->parties->first(function (TransactionParty $party) use ($user, $email): bool {
            if ($party->user_id && (int) $party->user_id === (int) $user->id) {
                return true;
            }

            return strtolower((string) $party->email) === $email;
        });
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if ($status === null || $status === '' || $status === 'all') {
            return $query;
        }

        return $query->where('status', $status);
    }
}
