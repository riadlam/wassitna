<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CalculateFeeRequest;
use App\Support\FeeCalculator;
use Illuminate\Http\JsonResponse;

class FeeController extends Controller
{
    public function calculate(CalculateFeeRequest $request): JsonResponse
    {
        $result = FeeCalculator::calculate($request->validated('amount'));

        return response()->json($result);
    }
}
