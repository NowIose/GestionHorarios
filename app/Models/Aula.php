<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    use HasFactory;

    protected $fillable = [
        'nro',
        'tipo',
    ];

    public function horarioMaterias()
    {
        return $this->hasMany(HorarioMateria::class);
    }
}
