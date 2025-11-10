<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HorarioSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('horarios')->truncate();

        DB::table('horarios')->insert([
            ['dia' => 'Lunes', 'hora_inicio' => '07:00', 'hora_fin' => '08:30'],
            ['dia' => 'Lunes', 'hora_inicio' => '08:30', 'hora_fin' => '10:00'],
            ['dia' => 'Lunes', 'hora_inicio' => '10:00', 'hora_fin' => '11:30'],
            ['dia' => 'Martes', 'hora_inicio' => '07:00', 'hora_fin' => '08:30'],
            ['dia' => 'Martes', 'hora_inicio' => '08:30', 'hora_fin' => '10:00'],
            ['dia' => 'Martes', 'hora_inicio' => '10:00', 'hora_fin' => '11:30'],
            ['dia' => 'Miércoles', 'hora_inicio' => '07:00', 'hora_fin' => '08:30'],
            ['dia' => 'Miércoles', 'hora_inicio' => '08:30', 'hora_fin' => '10:00'],
        ]);
    }
}