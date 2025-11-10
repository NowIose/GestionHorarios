<?php

namespace App\Http\Controllers\Admin\Horarios;

use App\Http\Controllers\Controller;
use App\Models\Aula;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AulaController extends Controller
{
    public function index()
    {
        $aulas = Aula::orderBy('nro')->get();

        return Inertia::render('Admin/Horarios/Aulas', [
            'aulas' => $aulas,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nro' => 'required|string|max:10|unique:aulas,nro',
            'tipo' => 'required|in:Teórica,Laboratorio,Virtual',
        ]);

        Aula::create($data);

        return redirect()->route('admin.horarios.aulas')
            ->with('success', '✅ Aula creada correctamente.');
    }

    public function update(Request $request, Aula $aula)
    {
        $data = $request->validate([
            'nro' => 'required|string|max:10|unique:aulas,nro,' . $aula->id,
            'tipo' => 'required|in:Teórica,Laboratorio,Virtual',
        ]);

        $aula->update($data);

        return redirect()->route('admin.horarios.aulas')
            ->with('success', '✏️ Aula actualizada correctamente.');
    }

    public function destroy(Aula $aula)
    {
        $aula->delete();

        return redirect()->route('admin.horarios.aulas')
            ->with('success', '🗑️ Aula eliminada correctamente.');
    }
}
