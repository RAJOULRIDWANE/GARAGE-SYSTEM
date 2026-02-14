<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Part;

class Repair extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'mechanic_id',
        // 'service_id', <--- REMOVED (Now in pivot table)
        'description',
        'mechanic_notes',
        'cost',
        'status',
        'date_entry',
        'date_end',
        'invoice_number'
    ];

    // --- RELATIONSHIPS ---

    public function vehicle() {
        return $this->belongsTo(Vehicle::class);
    }

    public function mechanic() {
        return $this->belongsTo(User::class, 'mechanic_id');
    }

    // --- UPDATED: Has Many Services ---
    // ... inside Repair class
    public function services() {
        // Ensure this table name 'repair_service' matches your database
        return $this->belongsToMany(Service::class, 'repair_service')
                    ->withTimestamps();
    }

    public function parts()
    {
        return $this->belongsToMany(Part::class, 'part_repair', 'repair_id', 'part_id')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }
}