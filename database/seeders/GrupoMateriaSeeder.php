<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrupoMateriaSeeder extends Seeder
{
    public function run(): void
    {
        // Validamos existencia de tablas necesarias
        if (
            !DB::getSchemaBuilder()->hasTable('grupo_materia') ||
            !DB::getSchemaBuilder()->hasTable('materias') ||
            !DB::getSchemaBuilder()->hasTable('grupos') ||
            !DB::getSchemaBuilder()->hasTable('docentes')
        ) {
            $this->command->warn('⚠️ Faltan tablas para ejecutar GrupoMateriaSeeder.');
            return;
        }

        $materias = DB::table('materias')->get();
        $grupos = DB::table('grupos')->get();
        $docentes = DB::table('docentes')->get();

        if ($materias->isEmpty() || $grupos->isEmpty() || $docentes->isEmpty()) {
            $this->command->warn('⚠️ No hay datos suficientes (materias, grupos o docentes).');
            return;
        }

        // Distribuir materias entre los docentes de manera balanceada
        $i = 0;
        foreach ($materias as $materia) {
            $docente = $docentes[$i % $docentes->count()]; // rotación entre docentes
            $grupo = $grupos[$i % $grupos->count()];       // rotación entre grupos

            DB::table('grupo_materia')->insert([
                'materia_id' => $materia->id,
                'grupo_id' => $grupo->id,
                'docente_id' => $docente->id,
                'gestion' => now()->year,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info("✅ {$materia->sigla} asignada a {$docente->user_id} (grupo {$grupo->codigo})");

            $i++;
        }
    }
}
