<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\UpdatePayoutRequest;
use App\Http\Requests\Api\VerifyEmailCodeRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\EmailVerificationService;
use App\Support\PhoneNormalizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    public function __construct(
        private readonly EmailVerificationService $emailVerification,
    ) {}

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

        try {
            $this->emailVerification->issue($user);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Account created, but we could not send the verification email. Try resending in a moment.',
                'token' => $user->createToken($data['device'] ?? 'spa')->plainTextToken,
                'token_type' => 'Bearer',
                'requires_email_verification' => true,
                'user' => new UserResource($user),
            ], 201);
        }

        $device = $data['device'] ?? 'spa';
        $token = $user->createToken($device)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'requires_email_verification' => true,
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
            'requires_email_verification' => ! $user->hasVerifiedEmail(),
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
            'requires_email_verification' => ! $request->user()->hasVerifiedEmail(),
        ]);
    }

    public function verifyEmail(VerifyEmailCodeRequest $request): JsonResponse
    {
        $user = $request->user();
        $this->emailVerification->verify($user, $request->validated('code'));

        return response()->json([
            'message' => 'Email verified.',
            'requires_email_verification' => false,
            'user' => new UserResource($user->fresh()),
        ]);
    }

    public function resendVerification(Request $request): JsonResponse
    {
        $this->emailVerification->resend($request->user());

        return response()->json([
            'message' => 'A new verification code was sent to your email.',
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
