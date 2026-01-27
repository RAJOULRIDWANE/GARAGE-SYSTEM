<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get vehicles owned by this user
        // We include 'repairs' so we can show the history/status
        $vehicles = Vehicle::where('user_id', $user->id)
                        ->with(['repairs' => function($query) {
                            $query->orderBy('created_at', 'desc'); // Newest jobs first
                        }])
                        ->get();

        return response()->json($vehicles);
    }
}