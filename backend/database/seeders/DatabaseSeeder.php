<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
   public function run(): void{
    // Create the First Supervisor
    \App\Models\User::factory()->create([
        'name' => 'RAJOUL RIDWANE',
        'email' => 'rajoul@garage.com',
        'password' => bcrypt('RAJOUL'), // Default password
        'role' => 'supervisor',
    ]);
    
}
}
