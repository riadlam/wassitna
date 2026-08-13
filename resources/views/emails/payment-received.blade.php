@component('emails.layouts.branded', [
    'brandName' => $brandName,
    'brandUrl' => $brandUrl,
    'brandColor' => $brandColor,
    'brandDark' => $brandDark,
    'eyebrow' => $forSeller ? 'Payment received' : 'Payment confirmed',
    'emailTitle' => $brandName.' · Payment complete',
])
    <p style="margin:0 0 12px;font-size:18px;line-height:1.35;font-weight:700;color:{{ $brandDark }};">
        @if($forSeller)
            The buyer paid — deliver now
        @else
            Your payment is held in escrow
        @endif
    </p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#334155;">
        Hi{{ $greetingName }},
        @if($forSeller)
            the buyer completed payment for <strong>{{ $title }}</strong>. Funds are held by {{ $brandName }} until the buyer approves delivery.
        @else
            we received your payment for <strong>{{ $title }}</strong>. The seller can now deliver. Funds stay with {{ $brandName }} until you approve.
        @endif
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;background-color:#f0faf3;border:1px solid #c9ebd4;border-radius:10px;">
        <tr>
            <td style="padding:16px 18px;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4b6354;">Payment</p>
                <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:{{ $brandDark }};">{{ $amountLabel }}</p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#475569;">
                    Method: <strong>{{ $paymentMethod }}</strong><br>
                    Reference: <strong>{{ $ulid }}</strong>
                </p>
            </td>
        </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="border-radius:6px;background-color:{{ $brandColor }};">
                <a href="{{ $actionUrl }}" style="display:inline-block;padding:12px 20px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Open transaction
                </a>
            </td>
        </tr>
    </table>
@endcomponent
