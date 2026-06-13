<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('denunciations', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['abandonment', 'mistreatment', 'negligence', 'injured']);
            $table->string('location');
            $table->text('description');
            $table->string('evidence_photo')->nullable();
            $table->text('animal_characteristics')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('denunciations');
    }
};
