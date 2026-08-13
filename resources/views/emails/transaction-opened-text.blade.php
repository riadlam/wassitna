{{ $brandName }} - {{ $isInvite ? 'escrow invitation' : 'transaction opened' }}

Hi{{ $greetingName }},

@if($isInvite)
{{ $creatorName ?: 'A Wassitna user' }} started an escrow deal and invited you as the {{ $roleLabel }}.
@else
Your escrow deal is open. We invited the other party by email.
@endif

Deal: {{ $title }}
Amount: {{ $amountLabel }}
Your role: {{ $roleLabel }}
Reference: {{ $ulid }}

Open the deal:
{{ $actionUrl }}

{{ $brandUrl }}
