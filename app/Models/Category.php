<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'slug',
        'name_en',
        'name_fr',
        'name_ar',
        'position',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('position');
    }

    public function label(?string $locale = 'en'): string
    {
        return match ($locale) {
            'fr' => $this->name_fr,
            'ar' => $this->name_ar,
            default => $this->name_en,
        };
    }
}
