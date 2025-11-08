<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique(); 
            $table->string('descripcion');
            $table->string('modulo')->nullable();
            $table->boolean('otorgable')->default(true); 
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('permissions');
    }
};
