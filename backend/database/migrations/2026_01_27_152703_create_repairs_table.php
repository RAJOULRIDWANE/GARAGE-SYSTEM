<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create the main repairs table (WITHOUT service_id)
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('mechanic_id')->constrained('users')->onDelete('cascade');
            
            // REMOVED: $table->foreignId('service_id')... 
            // We removed service_id because we moved it to the pivot table below
            
            $table->text('description')->nullable();
            $table->decimal('cost', 10, 2);
            $table->string('status')->default('Pending');
            $table->dateTime('date_entry');
            $table->dateTime('date_end');
            $table->string('invoice_number')->unique();
            $table->timestamps();
        });

        // 2. Create the Pivot Table (Inside the SAME migration)
        Schema::create('repair_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_id')->constrained('repairs')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->timestamps();
        });
    }
    
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop in reverse order
        Schema::dropIfExists('repair_service');
        Schema::dropIfExists('repairs');
    }
};