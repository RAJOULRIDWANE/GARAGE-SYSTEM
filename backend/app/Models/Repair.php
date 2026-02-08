<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repair extends Model
{
    use HasFactory;

    // 1. ADD 'service_id' TO THIS LIST
    protected $fillable = [
        'vehicle_id',
        'mechanic_id',
        'service_id', // <--- IMPORTANT: Allows saving the ID
        'service_id',     // <--- Added
        'description',
        'mechanic_notes',
        'cost',
        'status',
        'date_entry',
        'date_end',
        'invoice_number'
    ];

    public function vehicle() {
        return $this->belongsTo(Vehicle::class);
    }

    public function mechanic() {
        return $this->belongsTo(User::class, 'mechanic_id');
    }

    // 2. ADD THIS FUNCTION
    public function service() {
        return $this->belongsTo(Service::class);
    }
}