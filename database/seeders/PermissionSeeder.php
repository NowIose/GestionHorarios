<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // 🧩 Módulos base del sistema
        $modulos = [
            'usuarios'   => ['ver', 'crear', 'editar', 'eliminar'],
            'docentes'   => ['ver', 'editar', 'cambiar_estado'],
            'roles'      => ['ver', 'crear', 'editar', 'eliminar'],
            'permisos'   => ['ver', 'crear', 'editar', 'eliminar'],
            'bitacora'   => ['ver'],
            'horarios'   => ['ver', 'crear', 'editar', 'eliminar', 'asignar'],
            'grupos'     => ['ver', 'crear', 'editar', 'eliminar'],
            'materias'   => ['ver', 'crear', 'editar', 'eliminar'],
            'aulas'      => ['ver', 'crear', 'editar', 'eliminar'],
        ];

        $permissions = [];

        foreach ($modulos as $modulo => $acciones) {
            foreach ($acciones as $accion) {
                $permissions[] = [
                    'nombre' => "{$accion}_{$modulo}",   // ej: ver_usuarios, editar_docentes
                    'descripcion' => ucfirst("$accion $modulo"),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('permissions')->insert($permissions);

        $this->command->info("✅ Se generaron " . count($permissions) . " permisos correctamente.");
    }
}
