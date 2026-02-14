<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'zone',
        'category',
        'price',
        'stock', // Optional: Good to have if you track inventory later
        'reference' // Optional: If you use part numbers
    ];

    /**
     * The repairs that use this part.
     */
    public function repairs()
    {
        return $this->belongsToMany(Repair::class, 'repair_part')
                    ->withPivot('quantity', 'price') // Crucial for history
                    ->withTimestamps();
    }
}