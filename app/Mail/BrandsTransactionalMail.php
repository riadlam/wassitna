<?php

namespace App\Mail;

trait BrandsTransactionalMail
{
    /**
     * @param  array<string, mixed>  $extra
     * @return array<string, mixed>
     */
    protected function brandPayload(array $extra = []): array
    {
        $name = trim((string) ($extra['name'] ?? ''));

        return array_merge([
            'brandName' => config('app.name', 'Wassitna'),
            'brandUrl' => rtrim((string) config('app.url', 'https://wassitna.com'), '/'),
            'brandColor' => '#3cb95d',
            'brandDark' => '#01426a',
            'greetingName' => $name !== '' ? ' '.$name : '',
            'name' => $name,
        ], $extra);
    }
}
