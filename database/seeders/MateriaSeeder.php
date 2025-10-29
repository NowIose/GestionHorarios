<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MateriaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('materias')->insert([
            ['sigla' => 'INF100', 'nombre' => 'Introducción a la Informática', 'semestre' => 1, 'creditos' => 4],
            ['sigla' => 'MAT100', 'nombre' => 'Cálculo I', 'semestre' => 1, 'creditos' => 4],
            ['sigla' => 'FIS100', 'nombre' => 'Física I', 'semestre' => 1, 'creditos' => 5],
        ]);
    }
}
