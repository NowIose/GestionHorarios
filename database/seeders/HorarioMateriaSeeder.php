<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HorarioMateriaSeeder extends Seeder
{
    public function run(): void
    {
        // Verificación de tablas necesarias
        if (
            !DB::getSchemaBuilder()->hasTable('horario_materia') ||
            !DB::getSchemaBuilder()->hasTable('horarios') ||
            !DB::getSchemaBuilder()->hasTable('aulas') ||
            !DB::getSchemaBuilder()->hasTable('grupo_materia')
        ) {
            $this->command->warn('⚠️ Faltan tablas necesarias para ejecutar HorarioMateriaSeeder.');
            return;
        }

        $horarios = DB::table('horarios')->get();
        $aulas = DB::table('aulas')->get();
        $gruposMaterias = DB::table('grupo_materia')->get();

        if ($horarios->isEmpty() || $aulas->isEmpty() || $gruposMaterias->isEmpty()) {
            $this->command->warn('⚠️ No hay datos suficientes para asignar horarios.');
            return;
        }

        // Listas para evitar duplicados
        $ocupacionAulas = [];     // Clave: "horario_id-aula_id"
        $ocupacionDocentes = [];  // Clave: "horario_id-docente_id"

        $i = 0;
        foreach ($gruposMaterias as $gm) {
            $horarioAsignado = null;
            $aulaAsignada = null;

            // Buscamos un horario + aula que esté libre para este docente
            foreach ($horarios as $horario) {
                foreach ($aulas as $aula) {
                    $claveAula = "{$horario->id}-{$aula->id}";
                    $claveDocente = "{$horario->id}-{$gm->docente_id}";

                    // Verificamos que ni el aula ni el docente estén ocupados
                    if (
                        !in_array($claveAula, $ocupacionAulas) &&
                        !in_array($claveDocente, $ocupacionDocentes)
                    ) {
                        $horarioAsignado = $horario->id;
                        $aulaAsignada = $aula->id;

                        // Marcamos como ocupados
                        $ocupacionAulas[] = $claveAula;
                        $ocupacionDocentes[] = $claveDocente;
                        break 2; // Salimos de ambos bucles
                    }
                }
            }

            if ($horarioAsignado && $aulaAsignada) {
                DB::table('horario_materia')->insert([
                    'horario_id' => $horarioAsignado,
                    'aula_id' => $aulaAsignada,
                    'grupo_materia_id' => $gm->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->command->info(
                    "✅ GrupoMateria #{$gm->id} asignado → Horario {$horarioAsignado}, Aula {$aulaAsignada}"
                );
            } else {
                $this->command->warn("⚠️ No se pudo asignar horario/aula al grupo_materia ID {$gm->id}");
            }

            $i++;
        }
    }
}
