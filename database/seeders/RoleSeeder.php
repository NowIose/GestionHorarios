<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            // 👑 ADMINISTRADOR — Acceso total
            'Administrador' => Permission::all()->pluck('id'),

            // 🎓 DIRECTOR DE CARRERA — Solo gestión académica
            'Director de Carrera' => Permission::whereIn('nombre', [
                'ver_docentes', 'editar_docentes',
                'ver_materias', 'crear_materias',
                'ver_grupos', 'crear_grupos',
                'asignar_grupo_materia',
                'ver_horarios', 'crear_horarios',
                'ver_asistencias'
            ])->pluck('id'),

            // 🧑‍🏫 DOCENTE — Solo su propio entorno
            'Docente' => Permission::whereIn('nombre', [
                'ver_horarios',
                'ver_materias',
                'ver_asistencias',
                'registrar_asistencias',
            ])->pluck('id'),
        ];

        foreach ($roles as $nombre => $permisos) {
            $role = Role::firstOrCreate(['nombre' => $nombre]);
            $role->permissions()->sync($permisos);
        }
    }
}
