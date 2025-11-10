<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AulaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('aulas')->truncate();

        DB::table('aulas')->insert([
            ['nro' => 'A-101', 'tipo' => 'Teórica'],
            ['nro' => 'A-201', 'tipo' => 'Laboratorio'],
            ['nro' => 'V-001', 'tipo' => 'Virtual'],
        ]);
    }
}