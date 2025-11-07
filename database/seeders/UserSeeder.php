<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // encontrar los id de los roles por nombres 
        $adminRole = Role::where('nombre','Administrador')->value('id');
        $docenteRole =Role::where('nombre','Docente')->value('id');
       
        // ==========================================================
        // 👑 Usuario Administrador principal
        // ==========================================================
        User::create([
            'registro' => 1001,                   // código interno del usuario
            'name' => 'Administrador General',    // nombre visible
            'email' => 'admin@local.test',        // correo para login
            'password' => Hash::make('admin1234'),// contraseña
            'role_id' => $adminRole,                      // rol "Administrador"
        ]);

        // ==========================================================
        // 🎓 Usuarios Docentes base
        // ==========================================================
        $docentes = [
            [
                'registro' => 2001,
                'name' => 'Juan Pérez',
                'email' => 'jperez@local.test',
                'password' => Hash::make('docente123'),
                'role_id' => $docenteRole, // Rol Docente
            ],
            [
                'registro' => 2002,
                'name' => 'María Gómez',
                'email' => 'mgomez@local.test',
                'password' => Hash::make('docente123'),
                'role_id' => $docenteRole, // Rol Docente
            ],
            [
                'registro' => 2003,
                'name' => 'Carlos Rojas',
                'email' => 'crojas@local.test',
                'password' => Hash::make('docente123'),
                'role_id' => $docenteRole, // Rol Docente
            ],
        ];

        foreach ($docentes as $docente) {
            User::create($docente);
        }

        // ==========================================================
        // 🗂️ Usuario Secretaría (opcional)
        // ==========================================================
        User::create([
            'registro' => 3001,
            'name' => 'Laura Mendoza',
            'email' => 'lmendoza@local.test',
            'password' => Hash::make('docente123'),
            'role_id' => $docenteRole, // Rol Secretaría
        ]);
    }
}