<?php

namespace App\Http\Controllers\Admin\Horarios;

use App\Http\Controllers\Controller;
use App\Models\Asistencia;
use App\Models\HorarioMateria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf; //PARA PDF 




class AsistenciaController extends Controller
{
    public function index(Request $request)
    {
        // 📅 Filtrar por fecha (o día actual por defecto)
        $fecha = $request->input('fecha', Carbon::today()->toDateString());

        // 🔹 Cargamos todas las asistencias de ese día
        $asistencias = Asistencia::with([
            'horarioMateria.horario',
            'horarioMateria.aula',
            'horarioMateria.grupoMateria.materia',
            'horarioMateria.grupoMateria.grupo',
            'horarioMateria.grupoMateria.docente.user'
        ])
            ->whereDate('fecha', $fecha)
            ->orderByDesc('fecha')
            ->get();

        // 🔹 Enviamos los datos al frontend
        return Inertia::render('Admin/Horarios/Asistencias', [
            'asistencias' => $asistencias,
            'fecha' => $fecha,
        ]);
    }

   public function reporte(Request $request)
    {
        $fecha = $request->input('fecha', Carbon::today()->toDateString());

        $asistencias = Asistencia::with([
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

        // Generar el PDF
        $pdf = Pdf::loadView('reports.asistencias', [
            'asistencias' => $asistencias,
            'fecha' => $fecha,
            'totales' => $totales,
        ])->setPaper('A4', 'portrait');

        $nombreArchivo = "Reporte_Asistencias_{$fecha}.pdf";
        return $pdf->download($nombreArchivo);
    }
}
