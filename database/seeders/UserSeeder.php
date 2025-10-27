<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'registro' => 1001,                   // código interno del usuario
            'name' => 'Administrador General',    // nombre visible
            'email' => 'admin@local.test',        // correo para login
            'password' => Hash::make('admin1234'),// contraseña
            'role_id' => 1,                       // rol "Administrador"
        ]);
    }
}
