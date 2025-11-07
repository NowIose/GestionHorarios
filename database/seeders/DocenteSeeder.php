<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DocenteSeeder extends Seeder
{
    public function run(): void
    {
        if (!DB::getSchemaBuilder()->hasTable('docentes')) {
            $this->command->warn('⚠️ La tabla "docentes" no existe. Se omite DocenteSeeder.');
            return;
        }

        $docenteRoleId = DB::table('roles')->where('nombre', 'Docente')->value('id');

        if (!$docenteRoleId) {
            $this->command->warn('⚠️ No se encontró el rol "Docente" en la tabla roles.');
            return;
        }

        $docentes = DB::table('users')
            ->where('role_id', $docenteRoleId)
            ->get();

        if ($docentes->isEmpty()) {
            $this->command->warn('⚠️ No hay usuarios con rol "Docente".');
            return;
        }

        $faker = fake(); // ✅ funciona en cualquier entorno

        foreach ($docentes as $u) {
            if (!DB::table('docentes')->where('user_id', $u->id)->exists()) {
                DB::table('docentes')->insert([
                    'user_id' => $u->id,
                    'fecha_contrato' => Carbon::now()->subDays(rand(10, 300)),
                    'especialidad' => $faker->randomElement([
                        'Matemáticas',
                        'Física',
                        'Informática',
                        'Estadística',
                        'Electrónica',
                    ]),
                    'sueldo' => $faker->randomFloat(2, 3500, 6000),
                    'estado' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->command->info("✅ Docente creado: {$u->name}");
            }
        }
    }
}
