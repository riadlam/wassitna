<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionParty extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'transaction_id',
        'role',
        'user_id',
        'email',
        'phone',
        'invite_status',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
