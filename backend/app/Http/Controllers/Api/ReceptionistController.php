<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // ✅ 1. ADD THIS IMPORT
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Repair;

class ReceptionistController extends Controller
{
    public function dashboard()
    {
        // 1. Get Mechanics
        $mechanics = User::whereIn('role', ['Mechanic', 'mechanic', 'MECHANIC'])
                         ->get(['id', 'name']);

        // 2. Get Repairs
        $repairs = Repair::with(['vehicle.client', 'mechanic'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Return Response
        return response()->json([
            'user' => Auth::user(), // ✅ 2. FIXED: Uses Auth Facade (No underline)
            'mechanics' => $mechanics,
            'repairs' => $repairs
        ]);
    }

    public function searchClients(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query) return response()->json([]);

        $clients = User::whereIn('role', ['Client', 'client', 'CUSTOMER', 'customer'])
            ->where('name', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name']);

        return response()->json($clients);
    }

    public function getClientVehicles($clientId)
    {
        $vehicles = Vehicle::where('user_id', $clientId)->get();
        return response()->json($vehicles);
    }

    public function storeJob(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required',
            'mechanic_id' => 'required',
            'description' => 'required',
            'cost' => 'required',
            'date_end' => 'required|date'
        ]);

        $repair = Repair::create([
            'vehicle_id' => $validated['vehicle_id'],
            'mechanic_id' => $validated['mechanic_id'],
            'description' => $validated['description'],
            'cost' => $validated['cost'],
            'status' => 'Pending',
            'date_entry' => now(),
            'date_end' => $validated['date_end'],
            'invoice_number' => 'INV-' . strtoupper(uniqid()), 
        ]);

        return response()->json(['message' => 'Created', 'repair' => $repair]);
    }

    public function deleteJob($id)
    {
         $repair = Repair::find($id);
         if($repair) {
             $repair->delete();
             return response()->json(['message' => 'Deleted']);
         }
         return response()->json(['message' => 'Not found'], 404);
    }
}