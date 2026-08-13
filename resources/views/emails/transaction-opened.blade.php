@component('emails.layouts.branded', [
    'brandName' => $brandName,
    'brandUrl' => $brandUrl,
    'brandColor' => $brandColor,
    'brandDark' => $brandDark,
    'eyebrow' => $isInvite ? 'New escrow invitation' : 'Transaction opened',
    'emailTitle' => $brandName.' · Transaction opened',
])
    <p style="margin:0 0 12px;font-size:18px;line-height:1.35;font-weight:700;color:{{ $brandDark }};">
        @if($isInvite)
            You are invited to a deal
        @else
            Your transaction is open
        @endif
    </p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#334155;">
        Hi{{ $greetingName }},
        @if($isInvite)
            {{ $creatorName ?: 'A Wassitna user' }} started an escrow deal and invited you as the
            <strong>{{ $roleLabel }}</strong>.
        @else
            your escrow deal is ready. We invited the other party by email.
        @endif
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;background-color:#f0faf3;border:1px solid #c9ebd4;border-radius:10px;">
        <tr>
            <td style="padding:16px 18px;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4b6354;">Deal</p>
                <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:{{ $brandDark }};">{{ $title }}</p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#475569;">
                    Amount: <strong>{{ $amountLabel }}</strong><br>
                    Your role: <strong>{{ $roleLabel }}</strong><br>
                    Reference: <strong>{{ $ulid }}</strong>
                </p>
            </td>
        </tr>
    </table>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:#475569;">
        Open the deal on {{ $brandName }} to review terms and continue.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
        <tr>
            <td style="border-radius:6px;background-color:{{ $brandColor }};">
                <a href="{{ $actionUrl }}" style="display:inline-block;padding:12px 20px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                    View transaction
                </a>
            </td>
        </tr>
    </table>
@endcomponent
