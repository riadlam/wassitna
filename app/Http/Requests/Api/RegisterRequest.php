<?php

namespace App\Http\Requests\Api;

use App\Support\PhoneNormalizer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => [
                'required',
                'string',
                'max:30',
                'regex:/^\+[1-9]\d{7,14}$/',
                'unique:users,phone_normalized',
            ],
            'password' => ['required', 'string', Password::defaults()],
            'device' => ['sometimes', 'string', 'in:spa,flutter'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('phone')) {
            $this->merge([
                'phone' => PhoneNormalizer::normalize((string) $this->input('phone')),
            ]);
        }

        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim((string) $this->input('email'))),
            ]);
        }
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'An account with this email already exists.',
            'phone.unique' => 'An account with this phone number already exists.',
            'phone.regex' => 'Enter a valid phone number including country code.',
            'password.min' => 'Password must be at least 8 characters.',
        ];
    }
}
