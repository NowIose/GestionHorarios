<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use App\Models\Asistencia;
use App\Models\Docente;
use App\Models\HorarioMateria;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AsistenciaController extends Controller
{
    /**
     * 📋 Muestra el formulario de registro de asistencia
     * y la lista de asistencias recientes del docente autenticado.
     */
    public function index(Request $request)
    {
        // Buscar el docente vinculado al usuario autenticado
        $docente = Docente::where('user_id', $request->user()->id)->firstOrFail();

        // Obtener todos los horarios asociados al docente
        $horarios = HorarioMateria::with(['grupoMateria.materia', 'grupoMateria.grupo', 'aula', 'horario'])
            ->whereHas('grupoMateria', function ($q) use ($docente) {
                $q->where('docente_id', $docente->id);
            })
            ->get();

        // Obtener las últimas 50 asistencias registradas del docente
        $asistencias = Asistencia::with(['horarioMateria.grupoMateria.materia', 'horarioMateria.grupoMateria.grupo'])
            ->where('docente_id', $docente->id)
            ->orderByDesc('fecha')
            ->take(50)
            ->get();

        // Renderiza la vista Inertia con los datos necesarios
        return inertia('Docente/Asistencias', [
            'horarios' => $horarios,
            'asistencias' => $asistencias,
        ]);
    }

    /**
     * 🕒 Registrar una nueva asistencia desde el formulario del docente.
     * Incluye validaciones de día, hora y duplicados.
     */
    public function store(Request $request)
    {
        // Obtener el docente autenticado
        $docente = Docente::where('user_id', $request->user()->id)->firstOrFail();

        // Validar los datos del formulario
        $data = $request->validate([
            'horario_materia_id' => 'required|exists:horario_materia,id',
            'modalidad' => 'required|in:presencial,virtual',
            'estado' => 'required|in:presente,ausente,justificado',
        ]);

        // Buscar el horario seleccionado y sus datos
        $horarioMateria = HorarioMateria::with('horario')->findOrFail($data['horario_materia_id']);
        $horario = $horarioMateria->horario;

        // Obtener fecha y hora actual en la zona horaria local (Bolivia, por ejemplo)
        $hoy = Carbon::now(config('app.timezone', 'America/La_Paz'));

        /**
         * 🗓️ Traducción manual de día al español
         */
        $dias = [
            0 => 'Domingo',
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
        ];
        $diaSemana = $dias[$hoy->dayOfWeek];

        /**
         * ✅ Validar que el día actual coincida con el del horario
         */
        if (strtolower($horario->dia) !== strtolower($diaSemana)) {
            return back()->with('error', "⚠️ Hoy no corresponde este horario ({$horario->dia}).");
        }

        /**
         * ⏰ Validar hora dentro del rango permitido
         */
        $horaActual = $hoy->format('H:i');

        // Convertimos las horas almacenadas (tipo TIME o string "HH:MM:SS") a formato comparable
        $horaInicio = Carbon::createFromFormat('H:i:s', $horario->hora_inicio)->format('H:i');
        $horaFin = Carbon::createFromFormat('H:i:s', $horario->hora_fin)->format('H:i');

        // Si la hora actual no está dentro del bloque
        if ($horaActual < $horaInicio || $horaActual > $horaFin) {
            return back()->with('error', "⏰ No puedes marcar asistencia fuera del horario ({$horaInicio} - {$horaFin}).");
        }

        /**
         * 🚫 Verificar duplicado (ya registrada hoy)
         */
        $fechaHoy = $hoy->toDateString();
        $yaExiste = Asistencia::where('docente_id', $docente->id)
            ->where('horario_materia_id', $horarioMateria->id)
            ->whereDate('fecha', $fechaHoy)
            ->exists();

        if ($yaExiste) {
            return back()->with('error', '⚠️ Ya registraste asistencia para esta clase hoy.');
        }

        /**
         * 💾 Guardar la asistencia
         */
        Asistencia::create([
            'docente_id' => $docente->id,
            'horario_materia_id' => $horarioMateria->id,
            'fecha' => $fechaHoy,
            'hora' => $hoy->format('H:i:s'),
            'modalidad' => $data['modalidad'],
            'estado' => $data['estado'],
        ]);

        return back()->with('success', '✅ Asistencia registrada correctamente.');
    }
}
