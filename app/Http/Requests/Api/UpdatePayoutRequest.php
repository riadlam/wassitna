<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $digits = static function (mixed $value): ?string {
            $clean = preg_replace('/\D+/', '', (string) $value) ?: '';

            return $clean === '' ? null : $clean;
        };

        $name = trim((string) $this->input('account_holder_name', ''));

        $this->merge([
            'payout_method' => strtolower(trim((string) $this->input('payout_method', ''))),
            'ccp_number' => $digits($this->input('ccp_number')),
            'cle' => $digits($this->input('cle')),
            'rip_baridimob' => $digits($this->input('rip_baridimob')),
            'account_holder_name' => $name === '' ? null : $name,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $ccp = $this->input('payout_method') === 'ccp';

        return [
            'payout_method' => ['required', 'string', Rule::in(['ccp', 'baridimob'])],
            'ccp_number' => [$ccp ? 'required' : 'nullable', 'string', 'digits_between:8,16'],
            'cle' => [$ccp ? 'required' : 'nullable', 'string', 'digits:2'],
            'account_holder_name' => [$ccp ? 'required' : 'nullable', 'string', 'max:120'],
            'rip_baridimob' => [$ccp ? 'nullable' : 'required', 'string', 'digits:20'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'payout_method.required' => 'Choose CCP or BaridiMob.',
            'ccp_number.required' => 'Enter your CCP number.',
            'ccp_number.digits_between' => 'CCP number should be 8 to 16 digits.',
            'cle.required' => 'Enter the clé.',
            'cle.digits' => 'Clé should be 2 digits.',
            'account_holder_name.required' => 'Enter the account holder name.',
            'rip_baridimob.required' => 'Enter your RIP BaridiMob.',
            'rip_baridimob.digits' => 'RIP BaridiMob should be 20 digits.',
        ];
    }
}
