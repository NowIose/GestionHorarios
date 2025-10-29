<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrupoMateria extends Model
{
    use HasFactory;

    protected $table = 'grupo_materia';

    protected $fillable = [
        'grupo_id',
        'materia_id',
        'docente_id',
        'gestion',
    ];
     protected $casts = [
        'gestion' => 'integer', // 👈 para mantenerlo como número
    ];
    public function grupo()
    {
        return $this->belongsTo(Grupo::class);
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class);
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class);
    }

    public function horarioMaterias()
    {
        return $this->hasMany(HorarioMateria::class, 'grupo_materia_id');
    }
}
