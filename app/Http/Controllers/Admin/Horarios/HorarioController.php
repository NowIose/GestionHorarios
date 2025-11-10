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
       //  dd($request->all());
        $data = $request->validate([
            'dia' => 'required|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        Horario::create($data);

        return redirect()->route('admin.horarios.index')
            ->with('success', '✅ Horario creado correctamente.');
    }

    public function update(Request $request, Horario $horario)
    {
        $data = $request->validate([
            'dia' => 'required|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ]);

        $horario->update($data);

        return redirect()->route('admin.horarios.index')
            ->with('success', '✏️ Horario actualizado correctamente.');
    }

    public function destroy(Horario $horario)
    {
        $horario->delete();

        return redirect()->route('admin.horarios.index')
            ->with('success', '🗑️ Horario eliminado correctamente.');
    }
}

