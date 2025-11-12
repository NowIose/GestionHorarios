<?php

namespace App\Http\Controllers\Admin\Horarios;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HorarioController extends Controller
{
    public function index()
    {
        $horarios = Horario::orderBy('dia')
            ->orderBy('hora_inicio')
            ->get();

        return Inertia::render('Admin/Horarios/Horarios', [
            'horarios' => $horarios,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'dia' => 'required|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        // Evitar duplicados exactos
        $existe = Horario::where('dia', $data['dia'])
            ->where('hora_inicio', $data['hora_inicio'])
            ->where('hora_fin', $data['hora_fin'])
            ->exists();

        if ($existe) {
            return back()->with('error', '⚠️ Ya existe un horario con el mismo día y rango de horas.');
        }

        Horario::create($data);

        return back()->with('success', '✅ Horario creado correctamente.');
    }

    public function update(Request $request, $id)
    {
        // 🔹 Capturar horario manualmente para mayor compatibilidad
        $horario = Horario::findOrFail($id);

        $data = $request->validate([
            'dia' => 'required|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        // Evitar duplicado excepto él mismo
        $existe = Horario::where('dia', $data['dia'])
            ->where('hora_inicio', $data['hora_inicio'])
            ->where('hora_fin', $data['hora_fin'])
            ->where('id', '!=', $horario->id)
            ->exists();

        if ($existe) {
            return back()->with('error', '⚠️ Ya existe otro horario con el mismo día y rango de horas.');
        }

        $horario->update($data);

        return back()->with('success', '✏️ Horario actualizado correctamente.');
    }

    public function destroy($id)
    {
        $horario = Horario::findOrFail($id);
        $horario->delete();

        return back()->with('success', '🗑️ Horario eliminado correctamente.');
    }
}
