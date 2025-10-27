<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prerequisito extends Model
{
    use HasFactory;

    protected $fillable = [
        'materia_id',
        'materia_requisito_id',
    ];

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'materia_id');
    }

    public function materiaRequisito()
    {
        return $this->belongsTo(Materia::class, 'materia_requisito_id');
    }
}
