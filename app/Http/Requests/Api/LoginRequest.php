<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
            'device' => ['sometimes', 'string', 'in:spa,flutter'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('login')) {
            $this->merge([
                'login' => trim((string) $this->input('login')),
            ]);
        }
    }
}
