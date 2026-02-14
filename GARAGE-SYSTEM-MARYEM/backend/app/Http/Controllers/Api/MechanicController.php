<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Repair;
use App\Http\Resources\RepairResource;

class MechanicController extends Controller
{
    /**
     * Get all repairs assigned to the logged-in mechanic
     */
    public function getMyRepairs(Request $request)
    {
        $user = $request->user();

        $repairs = Repair::where('mechanic_id', $user->id)
                        ->with(['vehicle.client', 'services']) 
                        ->orderBy('created_at', 'desc')
                        ->get();

        return RepairResource::collection($repairs);
    }

    /**
     * Get details for a specific job
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $repair = Repair::where('id', $id)
            ->where('mechanic_id', $user->id)
            ->with(['vehicle.client', 'services', 'parts'])
            ->firstOrFail();

        return new RepairResource($repair);
    }

    /**
     * Unified method for fetching a job by ID
     */
    public function getJobById(Request $request, $id)
    {
        $user = $request->user();

        $repair = Repair::where('id', $id)
                       ->where('mechanic_id', $user->id)
                       ->with(['vehicle.client', 'services', 'parts'])
                       ->first();

        if (!$repair) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        return new RepairResource($repair);
    }

    /**
     * Update the status of a repair
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,canceled,waiting_for_parts'
        ]);

        $repair = Repair::findOrFail($id);

        if ($repair->mechanic_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $repair->status = $request->input('status');
        $repair->save();

        return response()->json([
            'message' => 'Status updated successfully', 
            'status' => $repair->status
        ]);
    }
}