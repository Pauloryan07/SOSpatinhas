<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Drop the old content column if it exists and add the correct columns
            if (Schema::hasColumn('posts', 'content')) {
                $table->dropColumn('content');
            }
            if (Schema::hasColumn('posts', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            
            $table->text('text')->after('id');
            $table->string('image_path')->nullable()->after('text');
            $table->date('publish_date')->after('image_path');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['text', 'image_path', 'publish_date']);
            $table->text('content')->after('id');
            $table->softDeletes();
        });
    }
};
