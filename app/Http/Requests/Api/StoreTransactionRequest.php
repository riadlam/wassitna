<?php

namespace App\Http\Requests\Api;

use App\Support\PhoneNormalizer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', Rule::in(['buyer', 'seller', 'broker'])],
            'currency' => ['required', 'string', Rule::in(['DZD', 'USD', 'EUR', 'GBP'])],
            'inspection_period_days' => ['required', 'integer', 'min:1', 'max:90'],
            'fee_payer' => ['required', 'string', Rule::in(['buyer', 'seller', 'split'])],
            'terms_accepted' => ['accepted'],
            'party_email' => ['required', 'string', 'email', 'max:255'],
            'party_phone' => ['nullable', 'string', 'max:30'],
            'buyer_email' => ['required_if:role,broker', 'nullable', 'string', 'email', 'max:255'],
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.category' => ['required', 'string', 'exists:categories,slug'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.description' => ['nullable', 'string', 'max:5000'],
            'items.*.price' => ['required', 'numeric', 'gt:0', 'max:200000'],
            'items.*.quantity' => ['sometimes', 'integer', 'min:1', 'max:9999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $currency = strtoupper((string) $this->input('currency', 'DZD'));

        $merge = [
            'currency' => $currency,
            'title' => trim((string) $this->input('title', '')),
            'party_email' => strtolower(trim((string) $this->input('party_email', ''))),
        ];

        if ($this->filled('buyer_email')) {
            $merge['buyer_email'] = strtolower(trim((string) $this->input('buyer_email')));
        }

        if ($this->filled('party_phone')) {
            $merge['party_phone'] = PhoneNormalizer::normalize((string) $this->input('party_phone'));
        }

        if ($this->has('inspection_period') && ! $this->has('inspection_period_days')) {
            $merge['inspection_period_days'] = (int) $this->input('inspection_period');
        }

        if ($this->has('agree_terms') && ! $this->has('terms_accepted')) {
            $merge['terms_accepted'] = $this->boolean('agree_terms');
        }

        $this->merge($merge);
    }
}
