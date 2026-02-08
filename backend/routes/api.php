<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactDetailsController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\MechanicController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ReceptionistController;



    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/contact', [ContactDetailsController::class, 'store']);

    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);

    Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);







    Route::middleware('auth:sanctum')->group(function () {

    // The Route for the Supervisor Dashboard
    Route::post('/staff', [AuthController::class, 'createStaff']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicles', [VehicleController::class, 'store']);

    // MECHANIC ROUTES
    Route::get('/mechanic/jobs', [MechanicController::class, 'getMyRepairs']);
    Route::get('/mechanic/jobs/{id}', [MechanicController::class, 'getJobById']); // ← ADD THIS LINE
    Route::patch('/mechanic/jobs/{id}', [MechanicController::class, 'updateStatus']);


    Route::get('/client/vehicles', [ClientController::class, 'index']);


    Route::post('/change-password', [AuthController::class, 'changePassword']);


    Route::middleware(['auth:sanctum'])->prefix('receptionist')->group(function () {

        // Dashboard Data
        Route::get('/dashboard', [ReceptionistController::class, 'dashboard']);

        // Client & Vehicle Handling
        Route::get('/clients/search', [ReceptionistController::class, 'searchClients']);
        Route::get('/clients/{id}/vehicles', [ReceptionistController::class, 'getClientVehicles']);

        // Job Operations
        Route::post('/jobs', [ReceptionistController::class, 'storeJob']);
        Route::delete('/jobs/{id}', [ReceptionistController::class, 'deleteJob']);

        Route::get('/clients-summary', [ReceptionistController::class, 'getClientsWithRepairs']);
        Route::get('/client/{id}/repairs', [ReceptionistController::class, 'getClientRepairs']);

    });






    Route::get('/receptionist/dashboard', [ReceptionistController::class, 'dashboard']);

    // 2. Client Search (The "Autocomplete" feature)
    Route::get('/receptionist/clients/search', [ReceptionistController::class, 'searchClients']);

    // 3. Get Vehicles for a specific Client
    Route::get('/receptionist/clients/{id}/vehicles', [ReceptionistController::class, 'getClientVehicles']);

    // 4. Create New Job (Appointment)
    Route::post('/receptionist/jobs', [ReceptionistController::class, 'storeJob']);

    // 5. Delete Job
    Route::delete('/receptionist/jobs/{id}', [ReceptionistController::class, 'deleteJob']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});
