<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pet_donations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('photo')->nullable();
            $table->text('description')->nullable();
            $table->integer('age')->nullable();
            $table->enum('sex', ['male', 'female']);
            $table->text('health_history')->nullable();
            $table->boolean('vaccinated')->default(false);
            $table->enum('temperament', ['docile', 'aggressive']);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pet_donations');
    }
};
