<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert([
            [
                'nombre' => 'Administrador',
                'descripcion' => 'Acceso total al sistema',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Docente',
                'descripcion' => 'Acceso a control de asistencia y materias asignadas',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Secretaría',
                'descripcion' => 'Acceso a reportes y gestión de horarios',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
