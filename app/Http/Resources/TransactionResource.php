<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Transaction */
class TransactionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->ulid,
            'ulid' => $this->ulid,
            'title' => $this->title,
            'currency' => $this->currency,
            'inspection_period_days' => $this->inspection_period_days,
            'creator_role' => $this->creator_role,
            'status' => $this->status,
            'fee_payer' => $this->fee_payer,
            'payment_method' => $this->payment_method,
            'delivery' => [
                'note' => $this->visibleDeliveryNote($request),
                'sent' => $this->delivery_sent_at !== null,
                'received' => $this->delivery_received_at !== null,
                'sent_at' => $this->delivery_sent_at?->toIso8601String(),
                'received_at' => $this->delivery_received_at?->toIso8601String(),
            ],
            'subtotal' => (string) $this->subtotal,
            'fee_amount' => (string) $this->fee_amount,
            'fee_rate' => (string) $this->fee_rate,
            'buyer_total' => (string) $this->buyer_total,
            'seller_proceeds' => (string) $this->seller_proceeds,
            'terms_accepted_at' => $this->terms_accepted_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'items' => TransactionItemResource::collection($this->whenLoaded('items')),
            'parties' => TransactionPartyResource::collection($this->whenLoaded('parties')),
            'viewer' => $this->viewerPayload($request),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function viewerPayload(Request $request): ?array
    {
        $user = $request->user();
        if (! $user || ! $this->relationLoaded('parties')) {
            return null;
        }

        $party = $this->partyForUser($user);
        $isCreator = (int) $this->created_by === (int) $user->id;
        $buyer = $this->parties->firstWhere('role', 'buyer');
        $seller = $this->parties->firstWhere('role', 'seller');
        $buyerAccepted = $buyer?->invite_status === 'accepted';
        $sellerAccepted = $seller?->invite_status === 'accepted';

        $waitingOn = null;
        if ($this->status === 'pending_acceptance') {
            if (! $buyerAccepted) {
                $waitingOn = 'buyer';
            } elseif (! $sellerAccepted) {
                $waitingOn = 'seller';
            }
        }

        return [
            'role' => $party?->role,
            'is_creator' => $isCreator,
            'invite_status' => $party?->invite_status,
            'buyer_accepted' => $buyerAccepted,
            'seller_accepted' => $sellerAccepted,
            'waiting_on' => $waitingOn,
            'can_accept' => $party !== null
                && $this->status === 'pending_acceptance'
                && $party->invite_status !== 'accepted'
                && in_array($party->role, ['buyer', 'seller'], true),
            'can_pay' => $party?->role === 'buyer' && $this->status === 'awaiting_payment',
            'can_deliver' => $party?->role === 'seller' && $this->status === 'awaiting_delivery',
            'can_confirm_delivery' => $party?->role === 'buyer' && $this->status === 'awaiting_delivery',
            'can_inspect' => $party?->role === 'buyer' && $this->status === 'awaiting_inspection',
        ];
    }

    private function visibleDeliveryNote(Request $request): ?string
    {
        if (! $this->delivery_note) {
            return null;
        }

        $party = $this->partyForUser($request->user());
        if ($party?->role === 'seller') {
            return $this->delivery_note;
        }

        if (in_array($this->status, ['awaiting_inspection', 'completed', 'disputed'], true)) {
            return $this->delivery_note;
        }

        return null;
    }
}
