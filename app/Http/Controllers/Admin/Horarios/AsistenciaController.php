<?php

namespace App\Http\Controllers\Admin\Horarios;

use App\Http\Controllers\Controller;
use App\Models\Asistencia;
use App\Services\AsistenciaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class AsistenciaController extends Controller
{
    public function index(Request $request)
    {   
        // ✅ 1. Registrar automáticamente las faltas del día
        $faltas = AsistenciaService::registrarFaltasDelDia();

        // 📅 Filtrar por fecha (día actual por defecto)
        $fecha = $request->input('fecha', Carbon::today()->toDateString());

        // ✅ 2. Obtener asistencias del día (ya con faltas)
        $asistencias = Asistencia::select('id', 'fecha', 'hora', 'estado', 'horario_materia_id', 'docente_id')
            ->with([
                'horarioMateria.horario',
                'horarioMateria.aula',
                'horarioMateria.grupoMateria.materia',
                'horarioMateria.grupoMateria.grupo',
                'horarioMateria.grupoMateria.docente.user'
            ])
            ->whereDate('fecha', $fecha)
            ->orderByDesc('fecha')
            ->get();

        // 🔹 Enviar al frontend
        return Inertia::render('Admin/Horarios/Asistencias', [
            'asistencias' => $asistencias,
            'fecha' => $fecha,
        ]);
    }

    public function reporte(Request $request)
    {
        $fecha = $request->input('fecha', Carbon::today()->toDateString());

        $asistencias = Asistencia::select('id', 'fecha', 'hora', 'estado', 'horario_materia_id', 'docente_id')
            ->with([
                'horarioMateria.horario',
                'horarioMateria.aula',
                'horarioMateria.grupoMateria.materia',
                'horarioMateria.grupoMateria.grupo',
                'horarioMateria.grupoMateria.docente.user'
            ])
            ->whereDate('fecha', $fecha)
            ->get();

        // Calcular totales
        $totales = [
            'presentes' => $asistencias->where('estado', 'presente')->count(),
            'ausentes' => $asistencias->where('estado', 'ausente')->count(),
            'total' => $asistencias->count(),
        ];

        // Generar PDF
        $pdf = Pdf::loadView('reports.asistencias', [
            'asistencias' => $asistencias,
            'fecha' => $fecha,
            'totales' => $totales,
        ])->setPaper('A4', 'portrait');

        $nombreArchivo = "Reporte_Asistencias_{$fecha}.pdf";
        return $pdf->download($nombreArchivo);
    }
}
