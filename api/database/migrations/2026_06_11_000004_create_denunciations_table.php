<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('denunciations', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['abandonment', 'mistreatment', 'negligence', 'injured', 'exploitation', 'other']);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('address')->nullable();
            $table->text('description');
            $table->enum('animal_species', ['dog', 'cat', 'bird', 'other', 'unknown'])->default('unknown');
            $table->enum('animal_condition', ['unknown', 'injured', 'dead', 'alive'])->default('unknown');
            $table->string('evidence_photo')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('denunciations'); }
};