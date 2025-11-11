<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Asistencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'docente_id',
        'horario_materia_id',
        'fecha',
        'hora',
        'modalidad',
        'estado',
    ];

    protected $casts = [
        'fecha' => 'date',
        'hora' => 'datetime:H:i:s',
    ];

    /* 🔹 Relaciones */
    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }

    public function horarioMateria()
    {
        return $this->belongsTo(HorarioMateria::class, 'horario_materia_id');
    }

    /* 🔹 Scopes útiles */
    public function scopeHoy(Builder $query)
    {
        return $query->whereDate('fecha', Carbon::today());
    }

    public function scopeDelDocente(Builder $query, $docenteId)
    {
        return $query->where('docente_id', $docenteId);
    }

    public function scopeEntreFechas(Builder $query, $inicio, $fin)
    {
        return $query->whereBetween('fecha', [$inicio, $fin]);
    }

    /* 🔹 Helpers */
    public function esPresente(): bool
    {
        return $this->estado === 'presente';
    }

    public function esAusente(): bool
    {
        return $this->estado === 'ausente';
    }

    public function esVirtual(): bool
    {
        return $this->modalidad === 'virtual';
    }

    public function esPresencial(): bool
    {
        return $this->modalidad === 'presencial';
    }
}
