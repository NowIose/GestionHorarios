<?php

namespace App\Http\Controllers\Admin\Academico;

use App\Http\Controllers\Controller;
use App\Models\GrupoMateria;
use App\Models\Grupo;
use App\Models\Materia;
use App\Models\Docente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrupoMateriaController extends Controller
{
    public function index()
    {
        $asignaciones = GrupoMateria::with(['grupo', 'materia', 'docente.user'])
            ->orderByDesc('id')
            ->get();

        $grupos = Grupo::select('id', 'codigo')->orderBy('codigo')->get();
        $materias = Materia::select('id', 'sigla', 'nombre')->orderBy('sigla')->get();
        $docentes = Docente::with('user:id,name')->get();

        return Inertia::render('Admin/Academico/GrupoMateria', [
            'asignaciones' => $asignaciones,
            'grupos' => $grupos,
            'materias' => $materias,
            'docentes' => $docentes,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'grupo_id' => 'required|exists:grupos,id',
            'materia_id' => 'required|exists:materias,id',
            'docente_id' => 'nullable|exists:docentes,id',
            'gestion' => 'required|integer|min:2020|max:' . (now()->year + 1),
        ]);

        GrupoMateria::create($data);

        return redirect()->route('admin.grupoMateria')
            ->with('success', '✅ Asignación registrada correctamente.');
    }

    public function destroy(GrupoMateria $grupoMateria)
    {
        $grupoMateria->delete();

        return redirect()->route('admin.grupoMateria')
            ->with('success', '🗑️ Asignación eliminada correctamente.');
    }
}
