<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HorarioMateria extends Model
{
    use HasFactory;

    protected $table = 'horario_materia';

    protected $fillable = [
        'horario_id',
        'aula_id',
        'grupo_materia_id',
        'estado',
    ];

    protected $attributes = [
        'estado' => 'activo',
    ];
      public function setEstadoAttribute($value)
    {
        $this->attributes['estado'] = strtolower($value ?? 'activo');
    }

    // Relaciones
    public function horario()
    {
        return $this->belongsTo(Horario::class);
    }

    public function aula()
    {
        return $this->belongsTo(Aula::class);
    }

    public function grupoMateria()
    {
        return $this->belongsTo(GrupoMateria::class, 'grupo_materia_id');
    }

    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'horario_materia_id');
    }
}