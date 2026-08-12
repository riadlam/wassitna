export const FEE_FREE_UNDER = 20000;
export const FEE_TIER_MID = 100000;
export const FEE_CAP = 200000;
export const FEE_RATE_MID = 0.015;
export const FEE_RATE_HIGH = 0.01;

/**
 * Wassitna escrow fee in DZD (DA).
 * - under 20,000 DA: free
 * - 20,000–100,000 DA: 1.5%
 * - over 100,000 up to 200,000 DA: 1%
 * - amount capped at 200,000 DA
 */
export function calculateEscrowFee(amount) {
    const raw = Number(amount);
    if (!Number.isFinite(raw) || raw <= 0) {
        return {
            amount: 0,
            fee: 0,
            cappedAmount: 0,
            overCap: false,
            rate: 0,
            rateLabel: 'Free',
            tier: 'empty',
        };
    }

    const overCap = raw > FEE_CAP;
    const cappedAmount = Math.min(raw, FEE_CAP);

    if (cappedAmount < FEE_FREE_UNDER) {
        return {
            amount: raw,
            fee: 0,
            cappedAmount,
            overCap,
            rate: 0,
            rateLabel: 'Free',
            tier: 'free',
        };
    }

    if (cappedAmount <= FEE_TIER_MID) {
        const fee = cappedAmount * FEE_RATE_MID;
        return {
            amount: raw,
            fee,
            cappedAmount,
            overCap,
            rate: FEE_RATE_MID,
            rateLabel: '1.5%',
            tier: 'mid',
        };
    }

    const fee = cappedAmount * FEE_RATE_HIGH;
    return {
        amount: raw,
        fee,
        cappedAmount,
        overCap,
        rate: FEE_RATE_HIGH,
        rateLabel: '1%',
        tier: 'high',
    };
}

export function formatMoney(amount, currency = 'DZD') {
    const value = Number(amount);
    const safe = Number.isFinite(value) ? value : 0;
    const formatted = safe.toLocaleString('en-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    if (currency === 'DZD' || currency === 'DA') {
        return `${formatted} DA`;
    }

    const symbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$',
    };

    return `${symbols[currency] || ''}${formatted}${symbols[currency] ? '' : ` ${currency}`}`;
}

export function applyFeePayer(subtotal, fee, payer) {
    if (payer === 'seller') {
        return { fee, buyerPrice: subtotal, sellerProceeds: subtotal - fee };
    }
    if (payer === 'split') {
        return { fee, buyerPrice: subtotal + fee / 2, sellerProceeds: subtotal - fee / 2 };
    }
    return { fee, buyerPrice: subtotal + fee, sellerProceeds: subtotal };
}

export const feeScheduleCopy = [
    { range: 'Under 20,000 DA', rate: 'Free' },
    { range: '20,000 – 100,000 DA', rate: '1.5%' },
    { range: '100,000 – 200,000 DA', rate: '1%' },
    { range: 'Over 200,000 DA', rate: 'Capped at 200,000 DA' },
];
