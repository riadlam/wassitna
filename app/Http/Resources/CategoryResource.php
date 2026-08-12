<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Category */
class CategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = strtolower((string) $request->query('locale', 'en'));
        if (! in_array($locale, ['en', 'fr', 'ar'], true)) {
            $locale = 'en';
        }

        return [
            'slug' => $this->slug,
            'name' => $this->label($locale),
            'names' => [
                'en' => $this->name_en,
                'fr' => $this->name_fr,
                'ar' => $this->name_ar,
            ],
            'position' => $this->position,
        ];
    }
}
