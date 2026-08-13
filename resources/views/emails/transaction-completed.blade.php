@component('emails.layouts.branded', [
    'brandName' => $brandName,
    'brandUrl' => $brandUrl,
    'brandColor' => $brandColor,
    'brandDark' => $brandDark,
    'eyebrow' => 'Transaction complete',
    'emailTitle' => $brandName.' · Transaction complete',
])
    <p style="margin:0 0 12px;font-size:18px;line-height:1.35;font-weight:700;color:{{ $brandDark }};">
        Deal completed successfully
    </p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#334155;">
        Hi{{ $greetingName }}, the escrow deal <strong>{{ $title }}</strong> is complete.
        @if($forSeller)
            Your proceeds of <strong>{{ $sellerProceedsLabel }}</strong> were credited to your {{ $brandName }} wallet. You can withdraw to CCP or BaridiMob when ready.
        @else
            Thank you for using {{ $brandName }}. The seller has been paid from escrow.
        @endif
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;background-color:#f0faf3;border:1px solid #c9ebd4;border-radius:10px;">
        <tr>
            <td style="padding:16px 18px;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4b6354;">Summary</p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#475569;">
                    Deal total: <strong>{{ $amountLabel }}</strong><br>
                    @if($forSeller)
                        Seller proceeds: <strong>{{ $sellerProceedsLabel }}</strong><br>
                    @endif
                    Reference: <strong>{{ $ulid }}</strong>
                </p>
            </td>
        </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="border-radius:6px;background-color:{{ $brandColor }};">
                <a href="{{ $actionUrl }}" style="display:inline-block;padding:12px 20px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                    View transaction
                </a>
            </td>
        </tr>
    </table>
@endcomponent
