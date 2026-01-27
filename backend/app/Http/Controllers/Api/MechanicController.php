<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Repair;

class MechanicController extends Controller
{
    public function getMyRepairs(Request $request)
    {
        $user = $request->user();

        $repairs = Repair::where('mechanic_id', $user->id)
                        ->with('vehicle.client') // Load vehicle and owner info
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($repairs);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,progress,completed,canceled'
        ]);

        $repair = Repair::findOrFail($id);

        // Optional: specific check to ensure this mechanic owns this job
        if ($repair->mechanic_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $repair->status = $request->input('status');
        $repair->save();

        return response()->json(['message' => 'Status updated', 'repair' => $repair]);
    }
}