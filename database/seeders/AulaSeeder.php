<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AulaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('aulas')->insert([
            ['nro' => '10', 'tipo' => 'Laboratorio'],
            ['nro' => '11', 'tipo' => 'Común'],
        ]);
    }
}