<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Vacancy\VacancyController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::prefix('vacancy')->group(function () {
    Route::get('/', [VacancyController::class, 'index']);
    Route::get('/locations', [VacancyController::class, 'locations']);
    Route::get('/{vacancy}', [VacancyController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [VacancyController::class, 'store']);
        Route::put('/{vacancy}', [VacancyController::class, 'update']);
        Route::delete('/{vacancy}', [VacancyController::class, 'destroy']);
    });
});
