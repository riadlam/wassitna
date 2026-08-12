<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TransactionParty */
class TransactionPartyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'role' => $this->role,
            'email' => $this->email,
            'phone' => $this->phone,
            'invite_status' => $this->invite_status,
            'user_id' => $this->user_id,
        ];
    }
}
