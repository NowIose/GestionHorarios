<?php

namespace App\Http\Controllers\Admin\Academico;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use App\Models\Prerequisito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MateriaController extends Controller
{
    public function index()
    {
        $materias = Materia::with([
            'prerequisitos.materiaRequisito:id,sigla,nombre,semestre,creditos',
        ])
            ->orderBy('semestre')
            ->get();

        return inertia('Admin/Academico/Materias', [
            'materias' => $materias,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sigla' => 'required|string|max:20|unique:materias,sigla',
            'nombre' => 'required|string|max:255',
            'semestre' => 'required|integer|min:1|max:10',
            'creditos' => 'required|integer|min:1|max:6',
            'prerequisito_ids' => 'array',
            'prerequisito_ids.*' => 'exists:materias,id',
        ]);

        DB::transaction(function () use ($data) {
            $materia = Materia::create($data);

            if (!empty($data['prerequisito_ids'])) {
                foreach ($data['prerequisito_ids'] as $pid) {
                    Prerequisito::create([
                        'materia_id' => $materia->id,
                        'materia_requisito_id' => $pid,
                    ]);
                }
            }
        });

        return back()->with('success', ' Materia creada correctamente.');
    }

    public function update(Request $request, Materia $materia)
    {
        $data = $request->validate([
            'sigla' => 'required|string|max:20|unique:materias,sigla,' . $materia->id,
            'nombre' => 'required|string|max:255',
            'semestre' => 'required|integer|min:1|max:10',
            'creditos' => 'required|integer|min:1|max:6',
            'prerequisito_ids' => 'array',
            'prerequisito_ids.*' => 'exists:materias,id',
        ]);

        DB::transaction(function () use ($materia, $data) {
            $materia->update($data);

            // Eliminar prerequisitos antiguos
            $materia->prerequisitos()->delete();

            // Crear nuevos prerequisitos
            if (!empty($data['prerequisito_ids'])) {
                foreach ($data['prerequisito_ids'] as $pid) {
                    Prerequisito::create([
                        'materia_id' => $materia->id,
                        'materia_requisito_id' => $pid,
                    ]);
                }
            }
        });

        return back()->with('success', '✏️ Materia actualizada correctamente.');
    }

    public function destroy(Materia $materia)
    {
        DB::transaction(function () use ($materia) {
            $materia->prerequisitos()->delete();
            $materia->delete();
        });

        return back()->with('success', '🗑️ Materia eliminada correctamente.');
    }
}