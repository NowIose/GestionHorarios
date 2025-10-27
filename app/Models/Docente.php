<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fecha_contrato',
        'especialidad',
        'sueldo',
        'estado',
    ];

    protected $casts = [
        'fecha_contrato' => 'date',
        'sueldo' => 'decimal:2',
        'estado' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function asistencias()
    {
        return $this->hasMany(Asistencia::class);
    }

    public function grupoMaterias()
    {
        return $this->hasMany(GrupoMateria::class, 'docente_id');
    }
}
