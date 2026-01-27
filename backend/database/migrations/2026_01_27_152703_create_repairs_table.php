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
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();
            
            // Link to Vehicle
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            
            // Link to Mechanic (Nullable because a job might not be assigned yet)
            $table->foreignId('mechanic_id')->nullable()->constrained('users')->onDelete('set null');

            // Job Details
            $table->string('status')->default('pending'); // pending, progress, completed, canceled
            $table->text('description'); // Client complaint: "Engine making noise"
            $table->text('mechanic_notes')->nullable(); // Mechanic report: "Fixed spark plug"
            $table->decimal('cost', 10, 2)->default(0.00); // Price
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repairs');
    }
};
