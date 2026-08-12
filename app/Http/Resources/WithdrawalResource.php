<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Withdrawal */
class WithdrawalResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->ulid,
            'ulid' => $this->ulid,
            'amount' => (string) $this->amount,
            'currency' => $this->currency,
            'method' => $this->method,
            'status' => $this->status,
            'transaction_id' => $this->whenLoaded('transaction', fn () => $this->transaction?->ulid),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
