<?php

namespace App\Http\Controllers\Admin\Academico;

use App\Http\Controllers\Controller;
use App\Models\Grupo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrupoController extends Controller
{
    public function index()
    {
        $grupos = Grupo::orderBy('codigo')->get();

        return Inertia::render('Admin/Academico/Grupos', [
            'grupos' => $grupos,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'codigo' => 'required|string|max:50|unique:grupos,codigo',
            'cupos' => 'nullable|integer|min:0',
            'modalidad' => 'nullable|string|max:100',
        ]);

        Grupo::create($data);

        return redirect()->route('admin.grupos')
            ->with('success', '✅ Grupo creado correctamente.');
    }

    public function update(Request $request, Grupo $grupo)
    {
        $data = $request->validate([
            'codigo' => 'required|string|max:50|unique:grupos,codigo,' . $grupo->id,
            'cupos' => 'nullable|integer|min:0',
            'modalidad' => 'nullable|string|max:100',
        ]);

        $grupo->update($data);

        return redirect()->route('admin.grupos')
            ->with('success', '✏️ Grupo actualizado correctamente.');
    }

    public function destroy(Grupo $grupo)
    {
        $grupo->delete();

        return redirect()->route('admin.grupos')
            ->with('success', '🗑️ Grupo eliminado correctamente.');
    }
}
