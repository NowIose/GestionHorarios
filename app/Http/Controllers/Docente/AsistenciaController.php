<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use App\Models\Asistencia;
use App\Models\Docente;
use App\Models\HorarioMateria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AsistenciaController extends Controller
{
    public function index(Request $request)
    {
        $docente = Docente::where('user_id', $request->user()->id)->firstOrFail();

        $horarios = HorarioMateria::with(['grupoMateria.materia', 'grupoMateria.grupo', 'aula', 'horario'])
            ->whereHas('grupoMateria', function ($q) use ($docente) {
                $q->where('docente_id', $docente->id);
            })
            ->get();

        $asistencias = Asistencia::with(['horarioMateria.grupoMateria.materia', 'horarioMateria.grupoMateria.grupo'])
            ->where('docente_id', $docente->id)
            ->orderByDesc('fecha')
            ->take(10)
            ->get();

        return Inertia::render('Docente/Asistencias', [
            'horarios' => $horarios,
            'asistencias' => $asistencias,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'horario_materia_id' => 'required|exists:horario_materia,id',
            'modalidad' => 'required|string|max:50',
            'estado' => 'required|boolean',
        ]);

        $docente = Docente::where('user_id', $request->user()->id)->firstOrFail();
        $horarioMateria = HorarioMateria::with('horario')->findOrFail($validated['horario_materia_id']);
        $horario = $horarioMateria->horario;

        if (!$horario) {
            return back()->with('error', '❌ No se encontró un horario asignado para este grupo.');
        }

        $hoy = Carbon::now();
        $diaSemana = strtolower($hoy->locale('es')->dayName); // ej. "lunes", "martes"

        // ✅ Validar día
        if (strtolower($horario->dia) !== $diaSemana) {
            return back()->with('error', "⚠️ Hoy no tienes clase asignada para este horario ({$horario->dia}).");
        }

        // ✅ Validar hora actual
        $horaActual = $hoy->format('H:i:s');
        if ($horaActual < $horario->hora_inicio || $horaActual > $horario->hora_fin) {
            return back()->with('error', "⏰ No puedes marcar asistencia fuera del horario asignado ({$horario->hora_inicio} - {$horario->hora_fin}).");
        }

        // ✅ Validar duplicado del día
        $fecha = $hoy->toDateString();
        $yaRegistrada = Asistencia::where([
            'docente_id' => $docente->id,
            'horario_materia_id' => $horarioMateria->id,
            'fecha' => $fecha,
        ])->exists();

        if ($yaRegistrada) {
            return back()->with('error', '⚠️ Ya registraste asistencia para esta clase hoy.');
        }

        // ✅ Registrar asistencia
        Asistencia::create([
            'docente_id' => $docente->id,
            'horario_materia_id' => $horarioMateria->id,
            'fecha' => $fecha,
            'modalidad' => $validated['modalidad'],
            'estado' => $validated['estado'],
        ]);

        return back()->with('success', '✅ Asistencia registrada correctamente.');
    }
}
