{{ $brandName }} - payment {{ $forSeller ? 'received' : 'confirmed' }}

Hi{{ $greetingName }},

@if($forSeller)
The buyer completed payment for {{ $title }}. Funds are held by {{ $brandName }} until the buyer approves delivery.
@else
We received your payment for {{ $title }}. The seller can now deliver. Funds stay with {{ $brandName }} until you approve.
@endif

Amount: {{ $amountLabel }}
Method: {{ $paymentMethod }}
Reference: {{ $ulid }}

Open the deal:
{{ $actionUrl }}

{{ $brandUrl }}
