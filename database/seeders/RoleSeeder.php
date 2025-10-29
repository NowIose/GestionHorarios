<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Role;
use App\Models\Permission;
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'Administrador' => Permission::all()->pluck('id'),
            'Director de Carrera' => Permission::whereIn('nombre', [
                'ver_docentes', 'ver_grupos', 'crear_grupos', 'editar_grupos', 'ver_horarios',
                'crear_horarios', 'editar_horarios', 'asignar_horarios', 'ver_materias',
                'crear_materias', 'editar_materias'
            ])->pluck('id'),
            'Docente' => Permission::whereIn('nombre', [
                'ver_horarios', 'ver_materias', 'registrar_asistencias', 'ver_asistencias'
            ])->pluck('id'),
            'Decano' => Permission::whereIn('nombre', [
                'ver_docentes', 'ver_horarios', 'ver_asistencias', 'ver_bitacora'
            ])->pluck('id'),
            'Vicedecano' => Permission::whereIn('nombre', [
                'ver_docentes', 'ver_horarios', 'ver_asistencias'
            ])->pluck('id'),
            
            'Usuario' => collect([]),
        ];

        foreach ($roles as $nombre => $permisos) {
            $role = Role::firstOrCreate(['nombre' => $nombre]);
            $role->permissions()->sync($permisos);
        }
    }
}

