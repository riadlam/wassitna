<?php

use App\Http\Controllers\TestEmailController;
use Illuminate\Support\Facades\Route;

Route::get('/testemail', [TestEmailController::class, 'show'])
    ->middleware('throttle:20,1');
Route::post('/testemail', [TestEmailController::class, 'send'])
    ->middleware('throttle:5,1');

Route::view('/', 'app');
Route::view('/{any}', 'app')->where('any', '.*');
