export function deliveryKind(slug) {
    const key = String(slug || '').toLowerCase();
    if (key === 'accounts' || key.includes('account')) return 'accounts';
    if (key === 'digital-products' || key.includes('digital')) return 'digital';
    if (key === 'services-freelance' || key.includes('service') || key.includes('freelance')) {
        return 'services';
    }
    if (key === 'electronics' || key === 'physical-goods' || key.includes('electronic') || key.includes('physical')) {
        return 'physical';
    }
    return 'other';
}

export function deliveryStepLabel(slug) {
    switch (deliveryKind(slug)) {
        case 'accounts':
            return 'Account handover';
        case 'digital':
            return 'Digital delivery';
        case 'services':
            return 'Work delivery';
        case 'physical':
            return 'Shipping';
        default:
            return 'Delivery';
    }
}

const specs = {
    accounts: {
        note: true,
        noteLabel: 'Credentials',
        noteHint: 'Optional',
        notePlaceholder:
            'TikTok / Instagram / Steam…\nUsername:\nEmail or phone:\nPassword:\n2FA / backup codes:\nAnything the buyer should change after login.',
        sellerKicker: 'Handover',
        sellerTitle: 'Send the account details',
        sellerText: 'Paste the login here, or send it on WhatsApp, Instagram, Facebook…',
        sellerCheck: 'I sent the credentials',
        sellerCheckHint: 'In the box above, or on chat.',
        sellerCta: 'Confirm',
        sellerDone: 'Waiting for the buyer to confirm they have the login.',
        buyerKicker: 'Handover',
        buyerTitle: 'Waiting for the seller',
        buyerText: 'The seller will send the login on chat, or paste it here. Confirm when you have it.',
        buyerCheck: 'I received the credentials',
        buyerCheckHint: 'On this page, or on WhatsApp, Instagram, Facebook…',
        buyerCta: 'Confirm',
        buyerDone: 'Change the password and 2FA during inspection.',
    },
    digital: {
        sellerKicker: 'Delivery',
        sellerTitle: 'Send the files or license',
        sellerText: 'Send the download, key, or link on chat or email.',
        sellerCheck: 'I sent the product',
        sellerCheckHint: 'Chat, email, or a shared link.',
        sellerCta: 'Confirm',
        sellerDone: 'Waiting for the buyer to confirm they can open it.',
        buyerKicker: 'Delivery',
        buyerTitle: 'Got the files?',
        buyerText: 'Check chat, email, or the link the seller sent.',
        buyerCheck: 'I received the files or license',
        buyerCheckHint: 'Chat, email, or a download link.',
        buyerCta: 'Confirm',
        buyerDone: 'Inspect it before the period ends.',
    },
    services: {
        sellerKicker: 'Delivery',
        sellerTitle: 'Send the finished work',
        sellerText: 'Share it on chat, Drive, or email.',
        sellerCheck: 'I sent the work',
        sellerCheckHint: 'Chat, Drive, or email.',
        sellerCta: 'Confirm',
        sellerDone: 'Waiting for the buyer to confirm they can review it.',
        buyerKicker: 'Delivery',
        buyerTitle: 'Can you review the work?',
        buyerText: 'Open what the seller sent on chat or Drive.',
        buyerCheck: 'I received the work',
        buyerCheckHint: 'Chat, Drive, or email.',
        buyerCta: 'Confirm',
        buyerDone: 'Review it during inspection.',
    },
    physical: {
        sellerKicker: 'Shipping',
        sellerTitle: 'Ship the item',
        sellerText: 'Give it to a courier, then send the tracking on chat.',
        sellerCheck: 'I shipped it and sent tracking',
        sellerCheckHint: 'Yalidine, ZR, Maystro, or post.',
        sellerCta: 'Confirm',
        sellerDone: 'Waiting for the buyer to confirm tracking or the parcel.',
        buyerKicker: 'Shipping',
        buyerTitle: 'Got tracking or the parcel?',
        buyerText: 'The seller should have sent tracking on chat.',
        buyerCheck: 'I received tracking or the parcel',
        buyerCheckHint: 'On chat, or from the courier.',
        buyerCta: 'Confirm',
        buyerDone: 'Inspect the item before the period ends.',
    },
    other: {
        sellerKicker: 'Delivery',
        sellerTitle: 'Send what was agreed',
        sellerText: 'Send it on chat, by email, or with a courier, then confirm.',
        sellerCheck: 'I sent it',
        sellerCheckHint: 'WhatsApp, Instagram, Facebook…',
        sellerCta: 'Confirm',
        sellerDone: 'Waiting for the buyer to confirm they have it.',
        buyerKicker: 'Delivery',
        buyerTitle: 'Got it?',
        buyerText: 'Check chat, email, or the courier — then confirm.',
        buyerCheck: 'I received it',
        buyerCheckHint: 'WhatsApp, Instagram, Facebook…',
        buyerCta: 'Confirm',
        buyerDone: 'Inspect it before funds are released.',
    },
};

export function deliverySpec(slug) {
    return specs[deliveryKind(slug)] || specs.other;
}

export function reportReasons(slug) {
    const kind = deliveryKind(slug);
    if (kind === 'accounts') {
        return [
            { value: 'login', label: 'Login does not work' },
            { value: 'not-as-described', label: 'Account is not as described' },
            { value: 'changed', label: 'Seller changed the password or 2FA' },
            { value: 'outside', label: 'Seller asked me to pay outside Wassitna' },
            { value: 'other', label: 'Something else' },
        ];
    }
    if (kind === 'physical') {
        return [
            { value: 'damaged', label: 'Item arrived damaged' },
            { value: 'wrong', label: 'Wrong item' },
            { value: 'not-as-described', label: 'Not as described' },
            { value: 'missing', label: 'Never arrived' },
            { value: 'other', label: 'Something else' },
        ];
    }
    return [
        { value: 'not-as-described', label: 'Not as described' },
        { value: 'access', label: 'I cannot open or use what was sent' },
        { value: 'no-reply', label: 'Seller is not responding' },
        { value: 'outside', label: 'Seller asked me to pay outside Wassitna' },
        { value: 'other', label: 'Something else' },
    ];
}

export function inspectionCopy(slug, role) {
    const kind = deliveryKind(slug);
    if (role === 'seller') {
        return {
            title: 'Buyer is inspecting',
            text: 'Stay reachable on chat. Funds release when they approve.',
            tips:
                kind === 'accounts'
                    ? ['Do not change the login until they approve.', 'Answer fast if they cannot get in.']
                    : ['Keep tracking and proof handy.', 'Reply if they ask about the item.'],
        };
    }

    if (kind === 'accounts') {
        return {
            title: 'Check the account',
            text: 'Log in, then change the password and 2FA. Approve if it matches. Report if it does not.',
            tips: ['Try the login first.', 'Change password and 2FA before you approve.'],
        };
    }

    if (kind === 'physical') {
        return {
            title: 'Check the item',
            text: 'Inspect condition and what was agreed. Approve if it is right. Report if it is not.',
            tips: ['Check for damage.', 'Match it to the listing.'],
        };
    }

    return {
        title: 'Check what you received',
        text: 'Make sure it matches the deal. Approve to close, or report a problem.',
        tips: ['Open or test it now.', 'Approve only if you are satisfied.'],
    };
}

export function deliveryStorageKey(transactionId) {
    return `wassitna.delivery.${transactionId}`;
}

export function loadDeliveryDraft(transactionId) {
    if (typeof window === 'undefined' || !transactionId) return null;
    try {
        const raw = window.localStorage.getItem(deliveryStorageKey(transactionId));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveDeliveryDraft(transactionId, payload) {
    if (typeof window === 'undefined' || !transactionId) return;
    window.localStorage.setItem(deliveryStorageKey(transactionId), JSON.stringify(payload));
}
