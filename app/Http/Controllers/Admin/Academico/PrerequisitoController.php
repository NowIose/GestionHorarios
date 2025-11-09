<?php

namespace App\Http\Controllers\Admin\Academico;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use App\Models\Prerequisito;
use Illuminate\Http\Request;

class PrerequisitoController extends Controller
{
    public function index()
    {
        $prerequisitos = Prerequisito::with(['materia', 'materiaRequisito'])
            ->orderByDesc('id')
            ->paginate(10);

        return view('admin.academico.prerrequisitos.index', compact('prerequisitos'));
    }

    public function create()
    {
        $materias = Materia::orderBy('semestre')->get();
        return view('admin.academico.prerrequisitos.create', compact('materias'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'materia_id' => 'required|exists:materias,id|different:materia_requisito_id',
            'materia_requisito_id' => 'required|exists:materias,id',
        ]);

        Prerequisito::create($data);

        return redirect()->route('prerrequisitos.index')
            ->with('success', '✅ Prerrequisito agregado correctamente.');
    }

    public function destroy(Prerequisito $prerequisito)
    {
        $prerequisito->delete();

        return redirect()->route('prerrequisitos.index')
            ->with('success', '🗑️ Prerrequisito eliminado correctamente.');
    }
}
