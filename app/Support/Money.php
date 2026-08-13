<?php

namespace App\Support;

final class Money
{
    public static function da(float|int|string|null $amount): string
    {
        return number_format((float) $amount, 2, '.', ' ').' DA';
    }
}
