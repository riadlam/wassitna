<?php

namespace App\Support;

final class PhoneNormalizer
{
    public static function normalize(?string $phone): ?string
    {
        if ($phone === null) {
            return null;
        }

        $trimmed = trim($phone);
        if ($trimmed === '') {
            return null;
        }

        return preg_replace('/\s+/', '', $trimmed) ?? $trimmed;
    }

    public static function digits(?string $phone): string
    {
        return preg_replace('/\D+/', '', (string) $phone) ?? '';
    }

    public static function isFilled(?string $phone): bool
    {
        return strlen(self::digits($phone)) >= 8;
    }

    public static function matches(?string $left, ?string $right): bool
    {
        $a = self::digits($left);
        $b = self::digits($right);

        if ($a === '' || $b === '' || strlen($a) < 8 || strlen($b) < 8) {
            return false;
        }

        return $a === $b
            || str_ends_with($a, $b)
            || str_ends_with($b, $a);
    }
}
