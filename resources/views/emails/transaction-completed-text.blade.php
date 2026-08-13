{{ $brandName }} - transaction complete

Hi{{ $greetingName }},

The escrow deal {{ $title }} is complete.
@if($forSeller)
Your proceeds of {{ $sellerProceedsLabel }} were credited to your {{ $brandName }} wallet. You can withdraw to CCP or BaridiMob when ready.
@else
Thank you for using {{ $brandName }}. The seller has been paid from escrow.
@endif

Deal total: {{ $amountLabel }}
Reference: {{ $ulid }}

Open the deal:
{{ $actionUrl }}

{{ $brandUrl }}
