<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'payout_method' => $this->payout_method,
            'ccp_number' => $this->ccp_number,
            'cle' => $this->cle,
            'account_holder_name' => $this->account_holder_name,
            'rip_baridimob' => $this->rip_baridimob,
            'wallet' => number_format((float) $this->wallet, 2, '.', ''),
            'has_seller_wallet' => $this->hasSellerWallet(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
