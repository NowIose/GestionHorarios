<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // 1️⃣ Creamos los roles base
        $roles = [
            ['nombre' => 'Administrador', 'descripcion' => 'Acceso total al sistema', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'Docente', 'descripcion' => 'Acceso a control de asistencia y materias asignadas', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'Secretaría', 'descripcion' => 'Acceso a reportes y gestión de horarios', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'Usuario', 'descripcion' => 'Acceso básico al sistema', 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('roles')->insert($roles);

        $this->command->info('✅ Roles creados correctamente.');

        // 2️⃣ Asignamos permisos según el tipo de rol
        $permissions = DB::table('permissions')->get();
        if ($permissions->isEmpty()) {
            $this->command->warn('⚠️ No hay permisos disponibles. Ejecuta PermissionSeeder primero.');
            return;
        }

        $rolesDB = DB::table('roles')->get();

        foreach ($rolesDB as $role) {
            $rolePerms = collect();

            switch ($role->nombre) {
                case 'Administrador':
                    // 🔸 Acceso a todos los permisos
                    $rolePerms = $permissions->pluck('id');
                    break;

                case 'Docente':
                    // 🔸 Solo puede ver y editar sus materias y asistencias
                    $rolePerms = $permissions->filter(function ($p) {
                        return str_contains($p->nombre, 'ver_docentes')
                            || str_contains($p->nombre, 'editar_docentes')
                            || str_contains($p->nombre, 'ver_horarios')
                            || str_contains($p->nombre, 'ver_materias')
                            || str_contains($p->nombre, 'ver_grupos');
                    })->pluck('id');
                    break;

                case 'Secretaría':
                    // 🔸 Enfocado en horarios, docentes y reportes
                    $rolePerms = $permissions->filter(function ($p) {
                        return str_contains($p->nombre, 'ver_docentes')
                            || str_contains($p->nombre, 'ver_horarios')
                            || str_contains($p->nombre, 'crear_horarios')
                            || str_contains($p->nombre, 'editar_horarios')
                            || str_contains($p->nombre, 'ver_bitacora');
                    })->pluck('id');
                    break;

                case 'Usuario':
                    // 🔸 Acceso solo a visualización básica
                    $rolePerms = $permissions->filter(function ($p) {
                        return str_contains($p->nombre, 'ver_usuarios')
                            || str_contains($p->nombre, 'ver_docentes')
                            || str_contains($p->nombre, 'ver_materias');
                    })->pluck('id');
                    break;
            }

            // Guardamos las relaciones en la tabla pivot
            foreach ($rolePerms as $permId) {
                DB::table('permission_role')->insert([
                    'role_id' => $role->id,
                    'permission_id' => $permId,
                ]);
            }

            $this->command->info("🔗 Permisos asignados al rol {$role->nombre}: {$rolePerms->count()} permisos");
        }

        $this->command->info('✅ Asignación de permisos completada correctamente.');
    }
}

