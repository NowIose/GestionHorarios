<?php

namespace App\Http\Controllers\Admin\Horarios;

use App\Http\Controllers\Controller;
use App\Models\HorarioMateria;
use App\Models\Horario;
use App\Models\Aula;
use App\Models\GrupoMateria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HorarioMateriaController extends Controller
{
    public function index()
    {
        $asignaciones = HorarioMateria::with([
            'horario',
            'aula',
            'grupoMateria.materia:id,sigla,nombre',
            'grupoMateria.grupo:id,codigo',
            'grupoMateria.docente.user:id,name'
        ])
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Admin/Horarios/HorarioMateria', [
            'asignaciones' => $asignaciones,
            'horarios' => Horario::orderBy('dia')->orderBy('hora_inicio')->get(),
            'aulas' => Aula::orderBy('nro')->get(),
            'grupoMaterias' => GrupoMateria::with(['materia', 'grupo', 'docente.user'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'horario_id' => 'required|exists:horarios,id',
            'aula_id' => 'required|exists:aulas,id',
            'grupo_materia_id' => 'required|exists:grupo_materia,id',
            'estado' => 'required|in:activo,inactivo',
        ]);

        // 🚫 Validar conflicto de aula
        $aulaOcupada = HorarioMateria::where('horario_id', $data['horario_id'])
            ->where('aula_id', $data['aula_id'])
            ->exists();

        if ($aulaOcupada) {
            return back()->with('error', '❌ El aula ya está ocupada en ese horario.');
        }

        // 🚫 Validar conflicto de grupo
        $grupoMateria = GrupoMateria::find($data['grupo_materia_id']);
        if ($grupoMateria) {
            $grupoOcupado = HorarioMateria::where('horario_id', $data['horario_id'])
                ->whereIn('grupo_materia_id', GrupoMateria::where('grupo_id', $grupoMateria->grupo_id)->pluck('id'))
                ->exists();

            if ($grupoOcupado) {
                return back()->with('error', '⚠️ Ese grupo ya tiene otra materia en ese horario.');
            }
        }

        HorarioMateria::create($data);

        return redirect()->route('admin.horarios.materias')
            ->with('success', '✅ Horario asignado correctamente.');
    }

    public function update(Request $request, HorarioMateria $horarioMateria)
    {
        $data = $request->validate([
            'estado' => 'required|in:activo,inactivo',
        ]);

        $horarioMateria->update($data);

        return redirect()->route('admin.horarios.materias')
            ->with('success', '🔄 Estado actualizado correctamente.');
    }

    public function destroy(HorarioMateria $horarioMateria)
    {
        $horarioMateria->delete();

        return redirect()->route('admin.horarios.materias')
            ->with('success', '🗑️ Asignación eliminada correctamente.');
    }
}
