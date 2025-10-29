<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrupoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('grupos')->insert([
            ['codigo' => 'Z1', 'cupos' => 40, 'modalidad' => 'Virtual'],
            ['codigo' => 'Z2', 'cupos' => 45, 'modalidad' => 'Presencial'],
        ]);
    }
}