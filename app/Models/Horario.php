<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    //  Campos que pueden ser llenados con create() o update()
    protected $fillable = [
        'dia',
        'hora_inicio',
        'hora_fin',
    ];

    //  Cómo se interpretan internamente (opcional, útil para Date casting)
    protected $casts = [
        'hora_inicio' => 'datetime:H:i',
        'hora_fin' => 'datetime:H:i',
    ];

    // Relación: un horario puede tener varios registros de HorarioMateria
    public function horarioMaterias()
    {
        return $this->hasMany(HorarioMateria::class);
    }
}
