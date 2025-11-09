<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('permissions')->insert([
            // =======================
            // 🧩 MÓDULO: USUARIOS
            // =======================
            ['nombre' => 'ver_usuarios', 'descripcion' => 'Ver lista de usuarios', 'modulo' => 'Usuarios', 'otorgable' => false, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_usuarios', 'descripcion' => 'Crear nuevos usuarios', 'modulo' => 'Usuarios', 'otorgable' => false, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_usuarios', 'descripcion' => 'Editar usuarios', 'modulo' => 'Usuarios', 'otorgable' => false, 'created_at' => now(), 'updated_at' => now()],

            // Docentes
            ['nombre' => 'ver_docentes', 'descripcion' => 'Ver docentes', 'modulo' => 'Docentes', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_docentes', 'descripcion' => 'Editar docentes', 'modulo' => 'Docentes', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],

            // =======================
            // 📘 MÓDULO: ACADÉMICO
            // =======================
            ['nombre' => 'ver_materias', 'descripcion' => 'Ver materias', 'modulo' => 'Materias', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_materias', 'descripcion' => 'Crear materias', 'modulo' => 'Materias', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'ver_grupos', 'descripcion' => 'Ver grupos', 'modulo' => 'Grupos', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_grupos', 'descripcion' => 'Crear grupos', 'modulo' => 'Grupos', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'asignar_grupo_materia', 'descripcion' => 'Asignar materia y docente a grupo', 'modulo' => 'GrupoMateria', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],

            // =======================
            // 🕒 MÓDULO: CONTROL
            // =======================
            ['nombre' => 'ver_horarios', 'descripcion' => 'Ver horarios', 'modulo' => 'Horarios', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_horarios', 'descripcion' => 'Crear horarios', 'modulo' => 'Horarios', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'ver_asistencias', 'descripcion' => 'Ver asistencias', 'modulo' => 'Asistencias', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'registrar_asistencias', 'descripcion' => 'Registrar asistencias', 'modulo' => 'Asistencias', 'otorgable' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
