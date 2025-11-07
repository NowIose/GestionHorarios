<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DocenteSeeder extends Seeder
{
    public function run(): void
    {
        // Verificar que la tabla 'docentes' existe
        if (!DB::getSchemaBuilder()->hasTable('docentes')) {
            $this->command->warn('⚠️ La tabla "docentes" no existe. Se omite DocenteSeeder.');
            return;
        }
        $docenteRoleId = DB::table('roles')->where('nombre', 'Docente')->value('id');
        // Obtener usuarios con rol Docente (role_id = 2)
        $docentes = DB::table('users')
            ->where('role_id', $docenteRoleId)
            ->get();

        if ($docentes->isEmpty()) {
            $this->command->warn('⚠️ No hay usuarios con rol "Docente".');
            return;
        }

        foreach ($docentes as $u) {
            // Verificar que aún no exista registro en docentes
            $yaExiste = DB::table('docentes')->where('user_id', $u->id)->exists();

            if (!$yaExiste) {
                DB::table('docentes')->insert([
                    'user_id' => $u->id,
                    'fecha_contrato' => Carbon::now()->subDays(rand(10, 300)), // fecha simulada
                    'especialidad' => fake()->randomElement([
                        'Matemáticas',
                        'Física',
                        'Informática',
                        'Estadística',
                        'Electrónica',
                    ]),
                    'sueldo' => fake()->randomFloat(2, 3500, 6000),
                    'estado' => true, // activo/confirmado
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->command->info("✅ Docente creado: {$u->name}");
            }
        }
    }
}
