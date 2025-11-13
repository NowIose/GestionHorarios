<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('permissions')->insert([
            // -----------------------------------------------------
            // 👥 MÓDULO: USUARIOS
            // -----------------------------------------------------
            ['nombre' => 'usuarios', 'descripcion' => 'Acceso al módulo de usuarios', 'modulo' => 'Usuarios', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'docentes', 'descripcion' => 'Acceso al módulo de docentes', 'modulo' => 'Docentes', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'roles', 'descripcion' => 'Acceso al módulo de roles', 'modulo' => 'Roles', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'permisos', 'descripcion' => 'Acceso al módulo de permisos', 'modulo' => 'Permisos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'bitacora', 'descripcion' => 'Acceso al módulo de bitácora', 'modulo' => 'Bitácora', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'importar_docentes', 'descripcion' => 'Acceso a importar docentes', 'modulo' => 'Importación', 'created_at' => $now, 'updated_at' => $now],

            // -----------------------------------------------------
            // 📘 MÓDULO: ACADÉMICO
            // -----------------------------------------------------
            ['nombre' => 'materias', 'descripcion' => 'Acceso al módulo materias', 'modulo' => 'Académico', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'grupos', 'descripcion' => 'Acceso al módulo grupos', 'modulo' => 'Académico', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'grupo_materia', 'descripcion' => 'Acceso al módulo grupo-materia', 'modulo' => 'Académico', 'created_at' => $now, 'updated_at' => $now],

            // -----------------------------------------------------
            // 🕒 MÓDULO: HORARIOS
            // -----------------------------------------------------
            ['nombre' => 'aulas', 'descripcion' => 'Acceso al módulo aulas', 'modulo' => 'Horarios', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'horarios', 'descripcion' => 'Acceso al módulo horarios', 'modulo' => 'Horarios', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'asignaciones', 'descripcion' => 'Acceso al módulo asignaciones', 'modulo' => 'Horarios', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'asistencias_admin', 'descripcion' => 'Acceso al módulo asistencias (admin)', 'modulo' => 'Horarios', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}

