import { brand } from './brand';

export const faqCategories = [
    { id: 'basics', label: 'Basics' },
    { id: 'payments', label: 'Payments' },
    { id: 'fees', label: 'Fees' },
    { id: 'delivery', label: 'Delivery & inspection' },
    { id: 'withdrawals', label: 'Withdrawals' },
    { id: 'safety', label: 'Safety' },
];

export const faqItems = [
    {
        id: 'what-is-wassitna',
        category: 'basics',
        q: 'What is Wassitna?',
        a: `${brand.name} is an escrow service based in Algeria. The buyer pays us first. We hold the money until the seller delivers and the buyer approves. Then we pay the seller. Neither side has to trust a stranger with a direct transfer.`,
    },
    {
        id: 'where-operate',
        category: 'basics',
        q: 'Where does Wassitna operate?',
        a: 'We serve buyers and sellers in Algeria. Deals are in Algerian Dinar (DA), with a maximum of 200,000 DA per transaction.',
    },
    {
        id: 'how-it-works',
        category: 'basics',
        q: 'How does escrow work on Wassitna?',
        a: 'Both parties agree on the item, price, and inspection period. The buyer pays Wassitna. The seller delivers (goods, service, or credentials depending on the category). The buyer inspects and approves — or reports a problem. Only after approval do we release funds to the seller.',
    },
    {
        id: 'who-can-use',
        category: 'basics',
        q: 'Who can start a transaction?',
        a: 'Anyone with a Wassitna account can start a deal as buyer, seller, or broker. You invite the other party by email. They must log in and accept before the deal moves forward.',
    },
    {
        id: 'how-long',
        category: 'basics',
        q: 'How long does a transaction take?',
        a: 'It depends on payment, delivery, and the inspection period you chose — usually a few days to a couple of weeks. The inspection window starts after the buyer confirms receipt.',
    },
    {
        id: 'payment-methods',
        category: 'payments',
        q: 'How does the buyer pay?',
        a: 'Buyers pay through Wassitna so funds are held securely — not sent to the seller’s personal CCP or BaridiMob. Supported methods are expanding; bank transfer and card options will be added as we connect local payment partners.',
    },
    {
        id: 'seller-paid',
        category: 'payments',
        q: 'When does the seller get paid?',
        a: 'After the buyer approves during inspection, the deal closes and the seller’s share is credited to their Wassitna wallet. The seller then requests a withdrawal to CCP or BaridiMob.',
    },
    {
        id: 'fee-free',
        category: 'fees',
        q: 'Are there fees?',
        a: 'Deals under 20,000 DA are free. From 20,000 to 100,000 DA the fee is 1.5%. Above 100,000 DA up to the 200,000 DA cap it is 1%. You see the fee before you start.',
    },
    {
        id: 'fee-payer',
        category: 'fees',
        q: 'Who pays the escrow fee?',
        a: 'When you create the transaction you choose whether the buyer, seller, or both split the fee. The totals update automatically in the fee calculator.',
    },
    {
        id: 'delivery',
        category: 'delivery',
        q: 'What happens during delivery?',
        a: 'The seller marks delivery according to the category — for example shipping details, service completion, or account credentials shared on chat. The buyer confirms when they received what was agreed.',
    },
    {
        id: 'inspection',
        category: 'delivery',
        q: 'What is the inspection period?',
        a: 'You pick the number of days when starting the deal. During inspection the buyer checks the item or service. They can approve and close, or report an issue so our team can review.',
    },
    {
        id: 'dispute',
        category: 'delivery',
        q: 'What if something goes wrong?',
        a: 'Contact us on WhatsApp from the transaction page first — most issues get sorted in chat. If you still need to pause the deal, the buyer can report during inspection and we will review before any payout.',
    },
    {
        id: 'wallet',
        category: 'withdrawals',
        q: 'What is the seller wallet?',
        a: 'When a buyer approves, the seller’s proceeds are added to their Wassitna wallet. Sellers who have completed at least one deal as seller see their balance in the sidebar.',
    },
    {
        id: 'withdraw-how',
        category: 'withdrawals',
        q: 'How do withdrawals work?',
        a: 'Go to Withdraw in your account, add your CCP details (number, clé, account holder name) or your RIP BaridiMob, then request a payout. Withdrawals are reviewed and sent to the details you saved.',
    },
    {
        id: 'payout-details',
        category: 'withdrawals',
        q: 'Do I need payout details before withdrawing?',
        a: 'Yes. We store your CCP or BaridiMob details on your account so you do not re-enter them every time. We never ask for your PIN or password — only the payout destination.',
    },
    {
        id: 'not-escrow',
        category: 'safety',
        q: 'How do I know someone is really Wassitna?',
        a: `Real deals always happen on ${brand.domain}. We never ask you to pay a seller directly and call it escrow. We never ask for a "verification fee" on personal RIP. If someone does, it is a scam — contact us.`,
    },
    {
        id: 'personal-rip',
        category: 'safety',
        q: 'Someone asked me to pay their personal CCP or BaridiMob. Is that Wassitna?',
        a: 'No. On Wassitna the buyer pays us, not the seller’s personal account. Paying a random RIP outside the platform has no protection.',
    },
    {
        id: 'data',
        category: 'safety',
        q: 'What information do you store?',
        a: 'Account email, phone, transaction details, and payout information you provide for withdrawals. We use it only to run escrow and comply with applicable law in Algeria as we grow.',
    },
];

export function faqPreview(limit = 3) {
    return faqItems.slice(0, limit);
}

export function filterFaq(query, category = 'all') {
    const needle = query.trim().toLowerCase();
    return faqItems.filter((item) => {
        if (category !== 'all' && item.category !== category) return false;
        if (!needle) return true;
        return item.q.toLowerCase().includes(needle) || item.a.toLowerCase().includes(needle);
    });
}
