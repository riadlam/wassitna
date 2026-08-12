<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\UpdatePayoutRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\PhoneNormalizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();
        $phone = PhoneNormalizer::normalize($data['phone']) ?? $data['phone'];

        $user = User::create([
            'name' => strstr($data['email'], '@', true) ?: 'Wassitna user',
            'email' => $data['email'],
            'phone' => $phone,
            'phone_normalized' => $phone,
            'password' => $data['password'],
        ]);

        $device = $data['device'] ?? 'spa';
        $token = $user->createToken($device)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();
        $login = $data['login'];

        $user = str_contains($login, '@')
            ? User::query()->where('email', strtolower($login))->first()
            : User::query()->where('phone_normalized', PhoneNormalizer::normalize($login))->first();

        if (! $user || ! $user->isActive() || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Invalid credentials'],
            ]);
        }

        $device = $data['device'] ?? 'spa';
        $token = $user->createToken($device)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'user' => null,
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function updatePayout(UpdatePayoutRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $user->fill([
            'payout_method' => $data['payout_method'],
            'ccp_number' => $data['payout_method'] === 'ccp' ? $data['ccp_number'] : $user->ccp_number,
            'cle' => $data['payout_method'] === 'ccp' ? $data['cle'] : $user->cle,
            'account_holder_name' => $data['payout_method'] === 'ccp'
                ? $data['account_holder_name']
                : $user->account_holder_name,
            'rip_baridimob' => $data['payout_method'] === 'baridimob'
                ? $data['rip_baridimob']
                : $user->rip_baridimob,
        ])->save();

        return response()->json([
            'user' => new UserResource($user->fresh()),
        ]);
    }
}
