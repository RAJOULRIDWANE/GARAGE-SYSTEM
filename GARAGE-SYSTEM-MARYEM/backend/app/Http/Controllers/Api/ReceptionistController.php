<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Repair;
use App\Http\Resources\RepairResource;

class ReceptionistController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        // 1. Get Mechanics (Optimized columns)
        $mechanics = User::whereIn('role', ['Mechanic', 'mechanic', 'MECHANIC'])
            ->get(['id', 'name']);

        // 2. Optimized KPIs (Counting on DB side)
        $today = now()->format('Y-m-d');
        $todaysAppointments = Repair::whereDate('date_end', $today)->count();
        $confirmedToday = Repair::whereDate('date_end', $today)
            ->where('status', 'Completed')
            ->count();

        // 3. Paginated Repairs (Fetch only latest 15)
        $repairs = Repair::with(['vehicle.client', 'mechanic', 'services'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // 4. Clients Summary (Consolidated)
        $clientsSummary = User::whereHas('repairs')
            ->withCount('repairs')
            ->with(['vehicles'])
            ->get();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'role' => $user->role
            ],
            'mechanics' => $mechanics,
            'repairs' => RepairResource::collection($repairs->items()),
            'pagination' => [
                'total' => $repairs->total(),
                'current_page' => $repairs->currentPage(),
                'last_page' => $repairs->lastPage(),
            ],
            'kpis' => [
                'todaysAppointments' => $todaysAppointments,
                'confirmedToday' => $confirmedToday
            ],
            'clientsSummary' => $clientsSummary
        ]);
    }

    public function searchClients(Request $request)
    {
        $query = $request->input('query');
        if (!$query)
            return response()->json([]);

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

    // --- UPDATED: storeJob handles multiple services ---
    public function storeJob(Request $request)
    {
        // 1. Validate
        $validated = $request->validate([
            'vehicle_id' => 'required',
            'mechanic_id' => 'required',
            'service_ids' => 'required|array', // Must be an array
            'service_ids.*' => 'exists:services,id', // Each ID must exist
            'description' => 'nullable',
            'cost' => 'required',
            'date_end' => 'required|date'
        ]);

        // 2. Create Repair (Without service_id)
        $repair = Repair::create([
            'vehicle_id' => $validated['vehicle_id'],
            'mechanic_id' => $validated['mechanic_id'],
            'description' => $validated['description'] ?? 'Standard Service',
            'cost' => $validated['cost'],
            'status' => 'Pending',
            'date_entry' => now(),
            'date_end' => $validated['date_end'],
            'invoice_number' => 'INV-' . strtoupper(uniqid()),
        ]);

        // 3. Attach Services to Pivot Table
        $repair->services()->attach($validated['service_ids']);

        // 4. Load Relationships
        $repair->load(['vehicle.client', 'mechanic', 'services']);

        return response()->json([
            'message' => 'Created Successfully',
            'repair' => new RepairResource($repair)
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,In Progress,Completed,Canceled,Delivered'
        ]);

        $repair = Repair::findOrFail($id);

        if ($request->status === 'Delivered' && $repair->status !== 'Completed') {
            return response()->json([
                'message' => 'Only completed repairs can be marked as delivered.'
            ], 422);
        }

        $repair->status = $request->status;
        $repair->save();

        return response()->json([
            'message' => 'Status Updated',
            'repair' => new RepairResource($repair)
        ]);
    }

    public function deleteJob($id)
    {
        $repair = Repair::find($id);
        if ($repair) {
            // Detach services before deleting (if not using cascade on DB)
            $repair->services()->detach();
            $repair->delete();
            return response()->json(['message' => 'Deleted']);
        }
        return response()->json(['message' => 'Not found'], 404);
    }

    public function getClientsWithRepairs()
    {
        $clients = User::whereHas('repairs')
            ->withCount('repairs')
            ->with(['vehicles'])
            ->get();

        return response()->json($clients);
    }

    public function getClientRepairs($clientId)
    {
        $client = User::findOrFail($clientId);

        // UPDATED: with('services')
        $repairs = Repair::whereHas('vehicle', function ($q) use ($clientId) {
            $q->where('user_id', $clientId);
        })
            ->with(['vehicle.client', 'mechanic', 'services'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'client' => $client,
            'repairs' => $repairs
        ]);
    }

    public function show($id)
    {
        // UPDATED: with('services')
        $repair = Repair::with(['vehicle.client', 'mechanic', 'services'])->findOrFail($id);
        return new RepairResource($repair);
    }

    public function getInvoiceDetails($id)
    {
        // UPDATED: with('services')
        $repair = Repair::with([
            'vehicle.client',
            'mechanic',
            'services',
            'parts'
        ])->findOrFail($id);

        return response()->json($repair);
    }

    public function invoice($id)
    {
        // UPDATED: with('services')
        $repair = Repair::with([
            'vehicle.client',
            'mechanic',
            'services',
            'parts'
        ])->findOrFail($id);

        return response()->json($repair);
    }
}