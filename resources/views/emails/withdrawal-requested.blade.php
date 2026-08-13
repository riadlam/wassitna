@component('emails.layouts.branded', [
    'brandName' => $brandName,
    'brandUrl' => $brandUrl,
    'brandColor' => $brandColor,
    'brandDark' => $brandDark,
    'eyebrow' => 'Withdrawal request',
    'emailTitle' => $brandName.' · Withdrawal requested',
])
    <p style="margin:0 0 12px;font-size:18px;line-height:1.35;font-weight:700;color:{{ $brandDark }};">
        We received your withdrawal request
    </p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#334155;">
        Hi{{ $greetingName }}, your payout request is pending review. We will process it to your
        <strong>{{ $methodLabel }}</strong> details on file.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;background-color:#f0faf3;border:1px solid #c9ebd4;border-radius:10px;">
        <tr>
            <td style="padding:16px 18px;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4b6354;">Withdrawal</p>
                <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:{{ $brandDark }};">{{ $amountLabel }}</p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#475569;">
                    Method: <strong>{{ $methodLabel }}</strong><br>
                    Status: <strong>Pending</strong><br>
                    Reference: <strong>{{ $ulid }}</strong>
                    @if($transactionTitle)
                        <br>Related deal: <strong>{{ $transactionTitle }}</strong>
                    @endif
                </p>
            </td>
        </tr>
    </table>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:#64748b;">
        You can track withdrawals from your wallet page on {{ $brandName }}.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="border-radius:6px;background-color:{{ $brandColor }};">
                <a href="{{ $actionUrl }}" style="display:inline-block;padding:12px 20px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                    View withdrawals
                </a>
            </td>
        </tr>
    </table>
@endcomponent
