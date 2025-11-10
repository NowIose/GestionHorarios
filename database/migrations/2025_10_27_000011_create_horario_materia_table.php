<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('horario_materia', function (Blueprint $table) {
            $table->id();

            // 🔹 Relaciones
            $table->foreignId('horario_id')->constrained('horarios')->cascadeOnDelete();
            $table->foreignId('aula_id')->constrained('aulas')->cascadeOnDelete();
            $table->foreignId('grupo_materia_id')->constrained('grupo_materia')->cascadeOnDelete();

            // 🔹 Estado activo/inactivo
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');

            $table->timestamps();

            //  Mejora rendimiento de búsqueda
            $table->index(['grupo_materia_id']);
            
            // 🚫 Evita duplicidad de aula y horario
            $table->unique(['horario_id', 'aula_id'], 'horario_aula_unique');
        });
    }

    public function down(): void {
        Schema::dropIfExists('horario_materia');
    }
};
