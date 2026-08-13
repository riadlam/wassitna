<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Test email · Wassitna</title>
    <link rel="icon" type="image/png" href="/vendor/escrow/images/escrow-pay/logo.png">
    <style>
        :root { color-scheme: light; }
        body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, Helvetica, sans-serif;
            background: #f3f6f4;
            color: #1f2933;
        }
        .wrap {
            max-width: 520px;
            margin: 48px auto;
            padding: 0 16px;
        }
        .card {
            background: #fff;
            border: 1px solid #e2e8e4;
            border-radius: 12px;
            padding: 28px;
            box-shadow: 0 8px 24px rgba(1, 66, 106, 0.06);
        }
        h1 {
            margin: 0 0 8px;
            font-size: 24px;
            color: #01426a;
        }
        .lead {
            margin: 0 0 20px;
            color: #4f5759;
            line-height: 1.5;
        }
        .meta {
            margin: 0 0 20px;
            padding: 12px 14px;
            background: #f0faf3;
            border: 1px solid #c9ebd4;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.55;
            color: #01426a;
        }
        .meta strong { display: inline-block; min-width: 72px; }
        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 700;
            font-size: 14px;
        }
        input[type="email"] {
            width: 100%;
            box-sizing: border-box;
            height: 46px;
            padding: 0 14px;
            border: 1px solid #a4b0b1;
            border-radius: 6px;
            font-size: 16px;
            margin-bottom: 16px;
        }
        button {
            width: 100%;
            height: 46px;
            border: 0;
            border-radius: 6px;
            background: #3cb95d;
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
        }
        button:hover { filter: brightness(0.96); }
        .ok, .err {
            margin: 0 0 16px;
            padding: 12px 14px;
            border-radius: 8px;
            line-height: 1.45;
            font-size: 14px;
        }
        .ok { background: #f0faf3; border: 1px solid #c9ebd4; color: #01426a; }
        .err { background: #fff1f1; border: 1px solid #f0c2c2; color: #8a1f1f; }
        .warn {
            margin-top: 18px;
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.45;
        }
        code { font-size: 13px; }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="card">
            <h1>Temporary email test</h1>
            <p class="lead">Sends the same verification email template used after registration.</p>

            <div class="meta">
                <div><strong>Mailer</strong> {{ $mailer }}</div>
                <div><strong>Host</strong> {{ $host }}:{{ $port }} @if($scheme)({{ $scheme }})@endif</div>
                <div><strong>From</strong> {{ $fromName }} &lt;{{ $fromAddress }}&gt;</div>
            </div>

            @if($mailer === 'log')
                <div class="err">
                    <strong>MAIL_MAILER=log</strong> — messages only go to <code>storage/logs/laravel.log</code>, not Gmail.
                    Set <code>MAIL_MAILER=smtp</code> on the server and run <code>php artisan config:clear</code>.
                </div>
            @endif

            @if($result)
                <div class="ok">
                    {{ $result }}<br>
                    To: <strong>{{ $sentTo }}</strong><br>
                    Test code (for debugging): <strong>{{ $sentCode }}</strong>
                </div>
            @endif

            @if($error)
                <div class="err">
                    Send failed: {{ $error }}
                </div>
            @endif

            @if($errors->any())
                <div class="err">
                    {{ $errors->first() }}
                </div>
            @endif

            <form method="post" action="{{ url('/testemail') }}">
                @csrf
                <label for="email">Send test to</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value="{{ old('email', 'salamlaamari96@gmail.com') }}"
                    required
                    autocomplete="email"
                >
                <button type="submit">Send verification email</button>
            </form>

            <p class="warn">Temporary route — remove <code>/testemail</code> after mail delivery works.</p>
        </div>
    </div>
</body>
</html>
