{{ $brandName }} - withdrawal requested

Hi{{ $greetingName }},

We received your payout request. It is pending review and will be sent to your {{ $methodLabel }} details on file.

Amount: {{ $amountLabel }}
Method: {{ $methodLabel }}
Status: Pending
Reference: {{ $ulid }}
@if($transactionTitle)
Related deal: {{ $transactionTitle }}
@endif

Track withdrawals:
{{ $actionUrl }}

{{ $brandUrl }}
