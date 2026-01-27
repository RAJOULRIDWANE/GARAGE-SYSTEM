<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'make',
        'model',
        'license_plate',
        'year'
    ];

    // A vehicle belongs to a client
    public function client()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // A vehicle can have many repair history logs
    public function repairs()
    {
        return $this->hasMany(Repair::class);
    }
}
