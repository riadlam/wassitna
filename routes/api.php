<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\WithdrawalController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:5,1');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/email/verify', [AuthController::class, 'verifyEmail'])
            ->middleware('throttle:10,1');
        Route::post('/email/resend', [AuthController::class, 'resendVerification'])
            ->middleware('throttle:5,1');
        Route::patch('/payout', [AuthController::class, 'updatePayout'])
            ->middleware('verified.email');
    });
});

Route::post('/fees/calculate', [FeeController::class, 'calculate'])
    ->middleware('throttle:30,1');

Route::get('/categories', [CategoryController::class, 'index'])
    ->middleware('throttle:60,1');

Route::middleware(['auth:sanctum', 'verified.email', 'throttle:60,1'])->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/{transaction:ulid}', [TransactionController::class, 'show']);
    Route::post('/transactions/{transaction:ulid}/accept', [TransactionController::class, 'accept']);
    Route::post('/transactions/{transaction:ulid}/pay', [TransactionController::class, 'pay']);
    Route::post('/transactions/{transaction:ulid}/deliver', [TransactionController::class, 'deliver']);
    Route::post('/transactions/{transaction:ulid}/inspect', [TransactionController::class, 'inspect']);
    Route::get('/withdrawals', [WithdrawalController::class, 'index']);
    Route::post('/withdrawals', [WithdrawalController::class, 'store']);
});
