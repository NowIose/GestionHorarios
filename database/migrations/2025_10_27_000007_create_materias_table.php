<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('materias', function (Blueprint $table) {
            $table->id();
            $table->string('sigla')->unique();
            $table->string('nombre');
            $table->integer('semestre');
            $table->integer('creditos')->nullable();
           // $table->string('attribute1')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('materias');
    }
};
