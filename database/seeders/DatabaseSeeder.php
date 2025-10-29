<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       /* User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
            
        );*/
        $this->call([
        RoleSeeder::class,
        UserSeeder::class,
        DocenteSeeder::class, //
          // Datos académicos base
        MateriaSeeder::class,
        GrupoSeeder::class,
        AulaSeeder::class,
        HorarioSeeder::class,
        GrupoMateriaSeeder::class,
        HorarioMateriaSeeder::class,
    ]);
    }
}
