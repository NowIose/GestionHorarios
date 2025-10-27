<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    protected $fillable = [
        'sigla',
        'nombre',
        'semestre',
        'creditos',
        //'attribute1',
    ];

    public function grupoMaterias()
    {
        return $this->hasMany(GrupoMateria::class);
    }

    public function prerequisitos()
    {
        return $this->hasMany(Prerequisito::class, 'materia_id');
    }

    public function esRequisitoDe()
    {
        return $this->hasMany(Prerequisito::class, 'materia_requisito_id');
    }
}