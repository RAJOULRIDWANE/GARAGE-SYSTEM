<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactDetailsController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\MechanicController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ReceptionistController;
use App\Http\Controllers\Api\ServiceController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/contact', [ContactDetailsController::class, 'store']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);
Route::get('/services', [ServiceController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // --- User & Auth ---
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/staff', [AuthController::class, 'createStaff']);

    // --- General Data ---
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::get('/client/vehicles', [ClientController::class, 'index']);

    // --- MECHANIC ROUTES ---
    Route::prefix('mechanic')->group(function () {
        Route::get('/jobs', [MechanicController::class, 'getMyRepairs']);
        Route::get('/jobs/{id}', [MechanicController::class, 'show']);
        Route::patch('/jobs/{id}', [MechanicController::class, 'updateStatus']);
        Route::post('/parts-request', [MechanicController::class, 'requestParts']);
    });

    // --- RECEPTIONIST ROUTES ---
    // Note: All routes here will be /api/receptionist/...
    Route::prefix('receptionist')->group(function () {

        Route::get('/dashboard', [ReceptionistController::class, 'dashboard']);

        // Client Management
        Route::get('/clients/search', [ReceptionistController::class, 'searchClients']);
        Route::get('/clients/{id}/vehicles', [ReceptionistController::class, 'getClientVehicles']);
        Route::get('/clients-summary', [ReceptionistController::class, 'getClientsWithRepairs']);

        // ** THIS WAS THE BROKEN ROUTE **
        Route::get('/client/{id}/repairs', [ReceptionistController::class, 'getClientRepairs']);

        // Job Operations
        Route::post('/jobs', [ReceptionistController::class, 'storeJob']);
        Route::delete('/jobs/{id}', [ReceptionistController::class, 'deleteJob']);
        Route::get('/repair/{id}', [ReceptionistController::class, 'show']);

        // Status & Invoice
        Route::put('/repairs/{id}/status', [ReceptionistController::class, 'updateStatus']);
        Route::get('/repairs/{id}/invoice', [ReceptionistController::class, 'invoice']);
    });

});