<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('docente_id')->constrained('docentes')->cascadeOnDelete();
            $table->foreignId('horario_materia_id')->constrained('horario_materia')->cascadeOnDelete();
            $table->date('fecha');
            $table->string('modalidad')->nullable();
            $table->enum('estado', ['presente', 'ausente', 'justificado'])->default('presente');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('asistencias');
    }
};
