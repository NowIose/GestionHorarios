<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // --- ADMIN ---
        $admin = Role::firstOrCreate(['nombre' => 'Administrador']);
        $admin->permissions()->sync(Permission::all()->pluck('id'));

        // --- DOCENTE ---
        // NO usa permisos del panel admin
        Role::firstOrCreate(['nombre' => 'Docente']);

        Role::firstOrCreate(['nombre'=> 'Usuario']);
    }
}
