<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepairResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'cost' => $this->cost,
            'status' => $this->status,
            'date_end' => $this->date_end,
            'invoice_number' => $this->invoice_number,
            
            // Client & Vehicle Info
            'vehicle' => $this->vehicle ? [
                'make' => $this->vehicle->make,
                'model' => $this->vehicle->model,
                'plate' => $this->vehicle->plate_number,
                'owner' => $this->vehicle->client ? $this->vehicle->client->name : 'Unknown'
            ] : null,

            // Mechanic Info
            'mechanic' => $this->mechanic ? $this->mechanic->name : 'Unassigned',

            // --- NEW: Service Info ---
            'service_name' => $this->service ? $this->service->name : 'Custom Repair',
            'service_zone' => $this->service ? $this->service->zone : 'general',
        ];
    }
}