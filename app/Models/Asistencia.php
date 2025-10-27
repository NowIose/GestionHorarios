<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'docente_id',
        'horario_materia_id',
        'fecha',
        'modalidad',
        'estado',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }

    public function horarioMateria()
    {
        return $this->belongsTo(HorarioMateria::class, 'horario_materia_id');
    }
}
