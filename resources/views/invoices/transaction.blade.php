<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>{{ $brandName }} invoice {{ $invoiceNumber }}</title>
    <style>
        @page {
            margin: 14mm 12mm 16mm 12mm;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 0;
            color: #1f2933;
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            line-height: 1.45;
            background: #ffffff;
        }
        .page {
            width: 100%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .muted { color: #64748b; }
        .ink { color: #0f172a; }
        .green { color: {{ $brandColor }}; }
        .header {
            width: 100%;
            margin-bottom: 18px;
            border-bottom: 3px solid {{ $brandColor }};
            padding-bottom: 14px;
        }
        .logo {
            height: 42px;
            width: auto;
            display: block;
        }
        .brand-name {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: {{ $brandDark }};
            letter-spacing: -0.02em;
        }
        .brand-tag {
            margin: 3px 0 0;
            font-size: 10px;
            color: #64748b;
        }
        .invoice-kicker {
            margin: 0 0 4px;
            font-size: 10px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: {{ $brandColor }};
            font-weight: 700;
        }
        .invoice-title {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
            color: {{ $brandDark }};
            text-align: right;
        }
        .meta {
            margin: 4px 0 0;
            text-align: right;
            font-size: 10.5px;
            color: #475569;
        }
        .badge {
            display: inline-block;
            margin-top: 6px;
            padding: 3px 8px;
            border-radius: 999px;
            background: #e8f8ee;
            color: #166534;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }
        .parties td {
            width: 50%;
            vertical-align: top;
            padding: 0;
        }
        .card {
            border: 1px solid #e2e8e4;
            border-radius: 8px;
            padding: 12px 14px;
            background: #f8fbf9;
        }
        .card-seller {
            margin-left: 10px;
        }
        .card-buyer {
            margin-right: 10px;
        }
        .card-label {
            margin: 0 0 6px;
            font-size: 9px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: {{ $brandColor }};
            font-weight: 700;
        }
        .card-name {
            margin: 0;
            font-size: 13px;
            font-weight: 700;
            color: {{ $brandDark }};
        }
        .card p {
            margin: 3px 0 0;
            color: #475569;
            font-size: 10.5px;
            word-wrap: break-word;
        }
        .deal {
            margin: 14px 0 12px;
            border: 1px solid #dce8df;
            border-radius: 8px;
            overflow: hidden;
        }
        .deal-head {
            background: {{ $brandDark }};
            color: #ffffff;
            padding: 8px 12px;
            font-size: 10px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-weight: 700;
        }
        .deal-body {
            padding: 10px 12px 4px;
        }
        .deal-grid td {
            width: 50%;
            vertical-align: top;
            padding: 0 8px 8px 0;
        }
        .kv-label {
            display: block;
            font-size: 9px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #94a3b8;
        }
        .kv-value {
            display: block;
            margin-top: 2px;
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
            word-wrap: break-word;
        }
        .items {
            margin-top: 6px;
        }
        .items th {
            text-align: left;
            font-size: 9px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #64748b;
            border-bottom: 1px solid #d7e3db;
            padding: 8px 6px;
            background: #f3faf6;
        }
        .items th.num,
        .items td.num {
            text-align: right;
            white-space: nowrap;
        }
        .items td {
            padding: 9px 6px;
            border-bottom: 1px solid #eef2f0;
            vertical-align: top;
        }
        .item-name {
            font-weight: 700;
            color: #0f172a;
        }
        .item-desc {
            margin-top: 2px;
            font-size: 9.5px;
            color: #64748b;
        }
        .totals-wrap {
            width: 280px;
            margin-left: auto;
            margin-top: 10px;
        }
        .totals td {
            padding: 5px 0;
            font-size: 11px;
        }
        .totals .label { color: #64748b; }
        .totals .value { text-align: right; font-weight: 700; }
        .totals .grand td {
            padding-top: 10px;
            border-top: 2px solid {{ $brandColor }};
            font-size: 13px;
            color: {{ $brandDark }};
        }
        .note {
            margin-top: 18px;
            padding: 10px 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 9.5px;
            color: #64748b;
        }
        .footer {
            margin-top: 16px;
            padding-top: 10px;
            border-top: 1px solid #e2e8e4;
            font-size: 9px;
            color: #94a3b8;
        }
        .footer a { color: {{ $brandColor }}; text-decoration: none; }
        .right { text-align: right; }
        .vtop { vertical-align: top; }
    </style>
</head>
<body>
    <div class="page">
        <table class="header">
            <tr>
                <td class="vtop" style="width: 58%;">
                    @if($logoSrc)
                        <img src="{{ $logoSrc }}" alt="{{ $brandName }}" class="logo">
                        <p class="brand-name" style="margin-top:6px;">{{ $brandName }}</p>
                    @else
                        <p class="brand-name">{{ $brandName }}</p>
                    @endif
                    <p class="brand-tag">Escrow for online deals in Algeria · {{ $brandUrl }}</p>
                </td>
                <td class="vtop right" style="width: 42%;">
                    <p class="invoice-kicker">Official receipt</p>
                    <p class="invoice-title">Invoice</p>
                    <p class="meta">
                        <strong>{{ $invoiceNumber }}</strong><br>
                        Issued {{ $issuedLabel }}<br>
                        <span class="badge">{{ $statusLabel }}</span>
                    </p>
                </td>
            </tr>
        </table>

        <table class="parties">
            <tr>
                <td>
                    <div class="card card-buyer">
                        <p class="card-label">Bill to · Buyer</p>
                        <p class="card-name">{{ $buyer['name'] }}</p>
                        <p>{{ $buyer['email'] }}</p>
                        <p>{{ $buyer['phone'] }}</p>
                    </div>
                </td>
                <td>
                    <div class="card card-seller">
                        <p class="card-label">Paid to · Seller</p>
                        <p class="card-name">{{ $seller['name'] }}</p>
                        <p>{{ $seller['email'] }}</p>
                        <p>{{ $seller['phone'] }}</p>
                    </div>
                </td>
            </tr>
        </table>

        <div class="deal">
            <div class="deal-head">Transaction details</div>
            <div class="deal-body">
                <table class="deal-grid">
                    <tr>
                        <td>
                            <span class="kv-label">Title</span>
                            <span class="kv-value">{{ $title }}</span>
                        </td>
                        <td>
                            <span class="kv-label">Reference</span>
                            <span class="kv-value">{{ $reference }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="kv-label">Opened</span>
                            <span class="kv-value">{{ $createdLabel }}</span>
                        </td>
                        <td>
                            <span class="kv-label">Completed</span>
                            <span class="kv-value">{{ $completedLabel }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="kv-label">Payment method</span>
                            <span class="kv-value">{{ $paymentMethod }}</span>
                        </td>
                        <td>
                            <span class="kv-label">Inspection period</span>
                            <span class="kv-value">{{ $inspectionDays }} {{ $inspectionDays === 1 ? 'day' : 'days' }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="kv-label">Currency</span>
                            <span class="kv-value">Algerian Dinar ({{ $currency }})</span>
                        </td>
                        <td>
                            <span class="kv-label">Escrow fee paid by</span>
                            <span class="kv-value">{{ $feePayer }}</span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <table class="items">
            <thead>
                <tr>
                    <th style="width: 48%;">Item</th>
                    <th style="width: 18%;">Category</th>
                    <th class="num" style="width: 8%;">Qty</th>
                    <th class="num" style="width: 13%;">Unit</th>
                    <th class="num" style="width: 13%;">Amount</th>
                </tr>
            </thead>
            <tbody>
                @forelse($items as $item)
                    <tr>
                        <td>
                            <div class="item-name">{{ $item['name'] }}</div>
                            @if($item['description'])
                                <div class="item-desc">{{ $item['description'] }}</div>
                            @endif
                        </td>
                        <td>{{ $item['category'] }}</td>
                        <td class="num">{{ $item['quantity'] }}</td>
                        <td class="num">{{ $item['unit_label'] }}</td>
                        <td class="num">{{ $item['total_label'] }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">No items</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="totals-wrap">
            <table class="totals">
                <tr>
                    <td class="label">Subtotal</td>
                    <td class="value">{{ $subtotalLabel }}</td>
                </tr>
                <tr>
                    <td class="label">Wassitna fee ({{ $feeRateLabel }})</td>
                    <td class="value">{{ $feeLabel }}</td>
                </tr>
                <tr>
                    <td class="label">Seller proceeds</td>
                    <td class="value">{{ $sellerProceedsLabel }}</td>
                </tr>
                <tr class="grand">
                    <td>Buyer total</td>
                    <td class="value">{{ $totalLabel }}</td>
                </tr>
            </table>
        </div>

        <div class="note">
            {{ $brandName }} held this payment in escrow until the buyer approved the deal.
            This invoice is a record of the completed transaction. It is not a tax invoice.
            Funds were collected and released in Algerian Dinar (DA).
        </div>

        <div class="footer">
            {{ $brandName }} · {{ $brandUrl }} · Algeria
            @if($paidLabel !== '—')
                · Agreement {{ $paidLabel }}
            @endif
        </div>
    </div>
</body>
</html>
