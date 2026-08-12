<!DOCTYPE html>
<html lang="en" class="is-primaryFont-loaded is-secondaryFont-loaded">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'Wassitna') }} | Never buy or sell online without using Wassitna.com</title>
        <meta name="description" content="With Wassitna.com you can buy and sell anything safely without the risk of chargebacks. Truly secure payments.">
        <link rel="icon" type="image/png" sizes="32x32" href="/vendor/escrow/images/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/vendor/escrow/images/favicons/favicon-16x16.png">
        <link rel="apple-touch-icon" href="/vendor/escrow/images/favicons/favicon-192x192.png">
        <link rel="stylesheet" href="/vendor/escrow/css/styles.4af3807de8de0b1579d9.css">
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
