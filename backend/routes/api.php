<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactDetailsController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\VehicleController;

    Route::post('/register', [AuthController::class, 'register']);
   
    Route::post('/login', [AuthController::class, 'login']);
   
    Route::post('contact', [ContactDetailsController::class, 'store']);

    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);

    Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);







    Route::middleware('auth:sanctum')->group(function () {
    
    // The Route for the Supervisor Dashboard
    Route::post('/staff', [AuthController::class, 'createStaff']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicles', [VehicleController::class, 'store']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});