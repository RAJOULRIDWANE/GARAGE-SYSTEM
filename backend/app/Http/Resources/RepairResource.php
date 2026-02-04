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
            'created_at' => $this->created_at, // needed for sorting/display
            'invoice_number' => $this->invoice_number,
            
            // OPTIMIZATION: Manually constructing the nested data 
            // This prevents sending the ENTIRE vehicle/client row (like updated_at, user_id, etc)
            'vehicle' => [
                'id' => $this->vehicle->id,
                'make' => $this->vehicle->make,
                'model' => $this->vehicle->model,
                'plate' => $this->vehicle->license_plate,
                'client' => [
                    'id' => $this->vehicle->client->id ?? null,
                    'name' => $this->vehicle->client->name ?? 'Unknown',
                    // No email, no password, no phone sent here!
                ]
            ],

            'mechanic' => $this->mechanic ? [
                'id' => $this->mechanic->id,
                'name' => $this->mechanic->name,
            ] : null,
        ];
    }
}