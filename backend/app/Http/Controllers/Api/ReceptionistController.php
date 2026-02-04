<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Repair;
use App\Http\Resources\RepairResource; // <--- THIS IS THE FIX

class ReceptionistController extends Controller
{
    public function dashboard()
    {
        // 1. Get Mechanics (Specific columns only)
        $mechanics = User::whereIn('role', ['Mechanic', 'mechanic', 'MECHANIC'])
                        ->get(['id', 'name']);

        // 2. Get Repairs with Eager Loading
        // We use 'with' to prevent N+1 queries (Double Request issue)
        $repairs = Repair::with(['vehicle.client', 'mechanic'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Return Response using the Resource Filter
        return response()->json([
            'user' => [
                'name' => Auth::user()->name, // Only send name and role
                'role' => Auth::user()->role
            ], 
            'mechanics' => $mechanics,
            // This transforms the data using the filter we created
            'repairs' => RepairResource::collection($repairs) 
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
        // 1. Validate
        $validated = $request->validate([
            'vehicle_id' => 'required',
            'mechanic_id' => 'required',
            'description' => 'required',
            'cost' => 'required',
            'date_end' => 'required|date'
        ]);

        // 2. Create
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
        
        // 3. Load Relationships (IMPORTANT)
        // The RepairResource needs 'vehicle' and 'mechanic' to work.
        // Since we just created this repair, they aren't loaded yet.
        $repair->load(['vehicle.client', 'mechanic']);

        // 4. Return Resource
        return response()->json([
            'message' => 'Created', 
            'repair' => new RepairResource($repair) // <--- Use Resource here too
        ]);
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
    // --- NEW: Main Dashboard (Grouped by Client) ---
    public function getClientsWithRepairs()
    {
        // Fetch users who have at least one repair
        $clients = User::whereHas('repairs')
            ->withCount('repairs') // Adds a 'repairs_count' column
            ->with(['vehicles'])   // Optional: if you want to show vehicle count too
            ->get();

        return response()->json($clients);
    }

    // --- NEW: Drill-Down (Specific Client Repairs) ---
    public function getClientRepairs($clientId)
    {
        $client = User::findOrFail($clientId);

        // Fetch repairs ONLY for this client
        $repairs = Repair::whereHas('vehicle', function($q) use ($clientId) {
                $q->where('user_id', $clientId);
            })
            ->with(['vehicle', 'mechanic']) // Eager load for speed
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'client' => $client,
            'repairs' => RepairResource::collection($repairs) // Reuse your Resource!
        ]);
    }
}