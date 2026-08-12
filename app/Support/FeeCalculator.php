<?php

namespace App\Support;

use InvalidArgumentException;

final class FeeCalculator
{
    public const FREE_UNDER = 20000.0;

    public const TIER_MID = 100000.0;

    public const CAP = 200000.0;

    public const RATE_MID = 0.015;

    public const RATE_HIGH = 0.01;

    /**
     * @return array{
     *     amount: float,
     *     fee: float,
     *     capped_amount: float,
     *     over_cap: bool,
     *     rate: float,
     *     rate_label: string,
     *     tier: string
     * }
     */
    public static function calculate(float|int|string|null $amount): array
    {
        $raw = is_numeric($amount) ? (float) $amount : 0.0;

        if (! is_finite($raw) || $raw <= 0) {
            return [
                'amount' => 0.0,
                'fee' => 0.0,
                'capped_amount' => 0.0,
                'over_cap' => false,
                'rate' => 0.0,
                'rate_label' => 'Free',
                'tier' => 'empty',
            ];
        }

        $overCap = $raw > self::CAP;
        $cappedAmount = min($raw, self::CAP);

        if ($cappedAmount < self::FREE_UNDER) {
            return [
                'amount' => $raw,
                'fee' => 0.0,
                'capped_amount' => $cappedAmount,
                'over_cap' => $overCap,
                'rate' => 0.0,
                'rate_label' => 'Free',
                'tier' => 'free',
            ];
        }

        if ($cappedAmount <= self::TIER_MID) {
            $fee = round($cappedAmount * self::RATE_MID, 2);

            return [
                'amount' => $raw,
                'fee' => $fee,
                'capped_amount' => $cappedAmount,
                'over_cap' => $overCap,
                'rate' => self::RATE_MID,
                'rate_label' => '1.5%',
                'tier' => 'mid',
            ];
        }

        $fee = round($cappedAmount * self::RATE_HIGH, 2);

        return [
            'amount' => $raw,
            'fee' => $fee,
            'capped_amount' => $cappedAmount,
            'over_cap' => $overCap,
            'rate' => self::RATE_HIGH,
            'rate_label' => '1%',
            'tier' => 'high',
        ];
    }

    /**
     * @return array{fee: float, buyer_total: float, seller_proceeds: float}
     */
    public static function applyFeePayer(float $subtotal, float $fee, string $payer): array
    {
        return match ($payer) {
            'seller' => [
                'fee' => $fee,
                'buyer_total' => $subtotal,
                'seller_proceeds' => round($subtotal - $fee, 2),
            ],
            'split' => [
                'fee' => $fee,
                'buyer_total' => round($subtotal + ($fee / 2), 2),
                'seller_proceeds' => round($subtotal - ($fee / 2), 2),
            ],
            default => [
                'fee' => $fee,
                'buyer_total' => round($subtotal + $fee, 2),
                'seller_proceeds' => $subtotal,
            ],
        };
    }

    /**
     * @throws InvalidArgumentException
     */
    public static function assertWithinCap(float $amount): void
    {
        if ($amount > self::CAP) {
            throw new InvalidArgumentException('Transaction amount cannot exceed 200,000 DA.');
        }
    }
}
