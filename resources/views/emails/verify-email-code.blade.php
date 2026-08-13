<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>{{ $brandName }} verification code</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f6f4;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8e4;">
                    <tr>
                        <td style="background-color:{{ $brandColor }};padding:22px 28px;">
                            <p style="margin:0;font-size:22px;line-height:1.2;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                                {{ $brandName }}
                            </p>
                            <p style="margin:6px 0 0;font-size:13px;line-height:1.4;color:#e8fff0;">
                                Email verification
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px;">
                            <p style="margin:0 0 12px;font-size:18px;line-height:1.35;font-weight:700;color:{{ $brandDark }};">
                                Confirm your email
                            </p>
                            <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#334155;">
                                Hi{{ $name ? ' '.$name : '' }}, use this code to finish creating your {{ $brandName }} account for
                                <strong style="color:{{ $brandDark }};">{{ $email }}</strong>.
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
                                <tr>
                                    <td align="center" style="background-color:#f0faf3;border:1px solid #c9ebd4;border-radius:10px;padding:18px 12px;">
                                        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4b6354;">
                                            Your verification code
                                        </p>
                                        <p style="margin:0;font-size:32px;line-height:1.2;font-weight:700;letter-spacing:0.28em;color:{{ $brandDark }};font-family:'Courier New',Courier,monospace;">
                                            {{ $code }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0 0 10px;font-size:14px;line-height:1.55;color:#475569;">
                                This code expires in <strong>{{ $minutes }} minutes</strong>. Enter it on the verification page to complete registration.
                            </p>
                            <p style="margin:0;font-size:14px;line-height:1.55;color:#64748b;">
                                If you did not create a {{ $brandName }} account, you can ignore this email.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 28px 22px;border-top:1px solid #eef2f0;background-color:#fafcfb;">
                            <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">
                                Sent by <a href="{{ $brandUrl }}" style="color:{{ $brandColor }};text-decoration:none;">{{ $brandName }}</a>
                                · Escrow for online deals in Algeria
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
