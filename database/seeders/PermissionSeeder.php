<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('permissions')->insert([
            // Usuarios
            ['nombre' => 'ver_usuarios', 'descripcion' => 'Ver usuarios', 'modulo' => 'Usuarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_usuarios', 'descripcion' => 'Crear usuarios', 'modulo' => 'Usuarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_usuarios', 'descripcion' => 'Editar usuarios', 'modulo' => 'Usuarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_usuarios', 'descripcion' => 'Eliminar usuarios', 'modulo' => 'Usuarios', 'created_at' => now(), 'updated_at' => now()],

            // Docentes
            ['nombre' => 'ver_docentes', 'descripcion' => 'Ver docentes', 'modulo' => 'Docentes', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_docentes', 'descripcion' => 'Editar docentes', 'modulo' => 'Docentes', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'cambiar_estado_docentes', 'descripcion' => 'Cambiar estado docentes', 'modulo' => 'Docentes', 'created_at' => now(), 'updated_at' => now()],

            // Roles
            ['nombre' => 'ver_roles', 'descripcion' => 'Ver roles', 'modulo' => 'Roles', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_roles', 'descripcion' => 'Crear roles', 'modulo' => 'Roles', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_roles', 'descripcion' => 'Editar roles', 'modulo' => 'Roles', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_roles', 'descripcion' => 'Eliminar roles', 'modulo' => 'Roles', 'created_at' => now(), 'updated_at' => now()],

            // Permisos
            ['nombre' => 'ver_permisos', 'descripcion' => 'Ver permisos', 'modulo' => 'Permisos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_permisos', 'descripcion' => 'Crear permisos', 'modulo' => 'Permisos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_permisos', 'descripcion' => 'Editar permisos', 'modulo' => 'Permisos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_permisos', 'descripcion' => 'Eliminar permisos', 'modulo' => 'Permisos', 'created_at' => now(), 'updated_at' => now()],

            // Horarios
            ['nombre' => 'ver_horarios', 'descripcion' => 'Ver horarios', 'modulo' => 'Horarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_horarios', 'descripcion' => 'Crear horarios', 'modulo' => 'Horarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_horarios', 'descripcion' => 'Editar horarios', 'modulo' => 'Horarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_horarios', 'descripcion' => 'Eliminar horarios', 'modulo' => 'Horarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'asignar_horarios', 'descripcion' => 'Asignar horarios', 'modulo' => 'Horarios', 'created_at' => now(), 'updated_at' => now()],

            // Grupos
            ['nombre' => 'ver_grupos', 'descripcion' => 'Ver grupos', 'modulo' => 'Grupos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_grupos', 'descripcion' => 'Crear grupos', 'modulo' => 'Grupos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_grupos', 'descripcion' => 'Editar grupos', 'modulo' => 'Grupos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_grupos', 'descripcion' => 'Eliminar grupos', 'modulo' => 'Grupos', 'created_at' => now(), 'updated_at' => now()],

            // Materias
            ['nombre' => 'ver_materias', 'descripcion' => 'Ver materias', 'modulo' => 'Materias', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_materias', 'descripcion' => 'Crear materias', 'modulo' => 'Materias', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_materias', 'descripcion' => 'Editar materias', 'modulo' => 'Materias', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_materias', 'descripcion' => 'Eliminar materias', 'modulo' => 'Materias', 'created_at' => now(), 'updated_at' => now()],

            // Aulas
            ['nombre' => 'ver_aulas', 'descripcion' => 'Ver aulas', 'modulo' => 'Aulas', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_aulas', 'descripcion' => 'Crear aulas', 'modulo' => 'Aulas', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_aulas', 'descripcion' => 'Editar aulas', 'modulo' => 'Aulas', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_aulas', 'descripcion' => 'Eliminar aulas', 'modulo' => 'Aulas', 'created_at' => now(), 'updated_at' => now()],

            // Bitácora
            ['nombre' => 'ver_bitacora', 'descripcion' => 'Ver bitácora', 'modulo' => 'Bitácora', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

