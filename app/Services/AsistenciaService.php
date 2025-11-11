<?php

namespace App\Services;

use App\Models\HorarioMateria;
use App\Models\Asistencia;
use Carbon\Carbon;

class AsistenciaService
{
    /**
     * Marca automáticamente como "ausente" a los docentes que no registraron
     * asistencia hoy para sus horarios del día.
     *
     * Retorna la cantidad de faltas registradas.
     */
    public static function registrarFaltasDelDia(): int
    {
        // Usamos la zona horaria que definiste para el sistema
        $hoy = Carbon::now('America/La_Paz');
        $fechaHoy = $hoy->toDateString();

        // Traducción manual del día a español (coincide con los valores de la tabla 'horarios')
        $dias = [
            0 => 'Domingo',
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
        ];
        $diaActual = $dias[$hoy->dayOfWeek];

        // Traemos todas las asignaciones (HorarioMateria) cuyo horario corresponde al día actual
        $horariosDelDia = HorarioMateria::with(['horario', 'grupoMateria'])
            ->whereHas('horario', function ($q) use ($diaActual) {
                $q->where('dia', $diaActual);
            })
            ->get();

        $contador = 0;

        foreach ($horariosDelDia as $hm) {
            // Intentamos obtener el docente responsable por el grupo_materia
            $docenteId = $hm->grupoMateria->docente_id ?? null;
            if (!$docenteId) {
                continue; // sin docente, no procesar
            }

            // Verificamos si ya existe una asistencia para ese docente + horario hoy
            $yaMarco = Asistencia::where('docente_id', $docenteId)
                ->where('horario_materia_id', $hm->id)
                ->whereDate('fecha', $fechaHoy)
                ->exists();

            if ($yaMarco) {
                continue; // ya marcó, no registrar falta
            }

            // 🔹 Verificamos si el horario ya terminó
            $horaFin = isset($hm->horario->hora_fin)
                ? Carbon::parse($hm->horario->hora_fin, 'America/La_Paz')
                : null;

            if ($horaFin && $hoy->lt($horaFin)) {
                // Aún no terminó el horario, no marcar falta todavía
                continue;
            }

            // 🔹 Si ya pasó la hora final, registrar falta automática
            Asistencia::create([
                'docente_id' => $docenteId,
                'horario_materia_id' => $hm->id,
                'fecha' => $fechaHoy,
                'hora' => null,
                'modalidad' => 'presencial',
                'estado' => 'ausente',
            ]);

            $contador++;
        }

        return $contador;
    }
}
