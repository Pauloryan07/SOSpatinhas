<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('post_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->string('path');
            $table->unsignedSmallInteger('order')->default(0);
            $table->timestamps();
            $table->unique(['post_id', 'order']);
        });
    }
    public function down(): void { Schema::dropIfExists('post_photos'); }
};