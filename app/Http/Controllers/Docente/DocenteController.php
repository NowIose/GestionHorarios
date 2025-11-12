<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Docente;
use App\Models\GrupoMateria;
use App\Models\HorarioMateria;

class DocenteController extends Controller
{
    public function dashboard(Request $request)
    {
        $docente = Docente::where('user_id', $request->user()->id)->first();

        $totalMaterias = GrupoMateria::where('docente_id', $docente->id)->count();
        $totalHorarios = HorarioMateria::whereIn(
            'grupo_materia_id',
            GrupoMateria::where('docente_id', $docente->id)->pluck('id')
        )->count();

        return Inertia::render('Docente/Dashboard', [
            'resumen' => [
                'nombre' => $request->user()->name,
                'total_materias' => $totalMaterias,
                'total_horarios' => $totalHorarios,
            ]
        ]);
    }

    public function materias(Request $request)
    {
        $docente = Docente::where('user_id', $request->user()->id)->firstOrFail();

        $materias = GrupoMateria::with(['materia:id,sigla,nombre,semestre,creditos', 'grupo:id,codigo'])
            ->where('docente_id', $docente->id)
            ->get();

        return Inertia::render('Docente/MisMaterias', [
            'materias' => $materias,
            'nombre' => $request->user()->name
        ]);
    }

    public function horarios(Request $request)
    {
        $docente = Docente::where('user_id', $request->user()->id)->firstOrFail();

        $horarios = HorarioMateria::with([
            'horario:id,dia,hora_inicio,hora_fin',
            'aula:id,nro,tipo',
            'grupoMateria.materia:id,nombre,sigla',
            'grupoMateria.grupo:id,codigo'
        ])
            ->whereIn('grupo_materia_id', 
                GrupoMateria::where('docente_id', $docente->id)->pluck('id')
            )
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Docente/MisHorarios', [
            'horarios' => $horarios,
            'nombre' => $request->user()->name
        ]);
    }
}
