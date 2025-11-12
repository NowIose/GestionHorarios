<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Asistencias - {{ $fecha }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            margin: 20px;
            color: #000;
        }
        h1, h3 { color: #064e3b; }
        .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
        }
        th {
            background: #d1fae5;
            color: #064e3b;
        }
        .summary {
            margin-top: 20px;
            border-top: 2px solid #10b981;
            padding-top: 10px;
        }
        .present { color: green; font-weight: bold; }
        .absent { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Reporte de Asistencias</h1>
        <h3>Fecha: {{ \Carbon\Carbon::parse($fecha)->format('d/m/Y') }}</h3>
    </div>

    <table>
        <thead>
            <tr>
                <th>Docente</th>
                <th>Materia</th>
                <th>Grupo</th>
                <th>Aula</th>
                <th>Horario</th>
                <th>Hora marcada</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($asistencias as $a)
                <tr>
                    <td>{{ $a->horarioMateria->grupoMateria->docente->user->name ?? 'N/A' }}</td>
                    <td>{{ $a->horarioMateria->grupoMateria->materia->sigla ?? '' }} - {{ $a->horarioMateria->grupoMateria->materia->nombre ?? '' }}</td>
                    <td>{{ $a->horarioMateria->grupoMateria->grupo->codigo ?? '' }}</td>
                    <td>{{ $a->horarioMateria->aula->nro ?? '' }}</td>
                    <td>{{ $a->horarioMateria->horario->dia ?? '' }} ({{ $a->horarioMateria->horario->hora_inicio ?? '' }} - {{ $a->horarioMateria->horario->hora_fin ?? '' }})</td>
                    <td>
                        @if($a->estado === 'presente')
                            {{ $a->hora ?? '—' }}
                        @else
                            —
                        @endif
                    </td>
                    <td class="{{ $a->estado === 'presente' ? 'present' : 'absent' }}">
                        {{ ucfirst($a->estado) }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align:center;">No hay asistencias registradas</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <p><strong>Total de registros:</strong> {{ $totales['total'] }}</p>
        <p><strong>Presentes:</strong> {{ $totales['presentes'] }}</p>
        <p><strong>Ausentes:</strong> {{ $totales['ausentes'] }}</p>
    </div>
</body>
</html>
