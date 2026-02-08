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
            $table->string('status')->default('Pending');
            $table->text('description');
            $table->text('mechanic_notes')->nullable();
            $table->decimal('cost', 10, 2)->default(0.00);


            $table->foreignId('service_id')->nullable()->constrained('services')->onDelete('set null');
            
            // DATES: Changed both to dateTime to store time info
            $table->dateTime('date_entry')->nullable();
            $table->dateTime('date_end')->nullable(); // <--- FIXED: Changed from date() to dateTime()
            
            $table->string('invoice_number')->nullable();
            
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