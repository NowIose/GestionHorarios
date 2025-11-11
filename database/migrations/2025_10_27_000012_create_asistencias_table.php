<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();

            // 🔹 Relaciones
            $table->foreignId('docente_id')->constrained('docentes')->cascadeOnDelete();
            $table->foreignId('horario_materia_id')->constrained('horario_materia')->cascadeOnDelete();

            // 🔹 Datos principales
            $table->date('fecha');
            $table->time('hora')->nullable(); // Hora exacta del registro
            $table->enum('modalidad', ['presencial', 'virtual'])->default('presencial');
            $table->enum('estado', ['presente', 'ausente', 'justificado'])->default('presente');

            $table->timestamps();

            // 🔹 Evita duplicados (mismo docente + horario + día)
            $table->unique(['docente_id', 'horario_materia_id', 'fecha'], 'asistencia_unica_por_dia');
        });
    }

    public function down(): void {
        Schema::dropIfExists('asistencias');
    }
};
