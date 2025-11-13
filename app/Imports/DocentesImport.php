<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Docente;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DocentesImport implements ToModel, WithHeadingRow
{
    public int $count = 0;
    public int $nuevos = 0;
    public int $existentes = 0;

    public function model(array $row)
    {
        $nombre = $row['nombre'] ?? $row['name'] ?? null;

        if (!isset($row['registro']) || !$nombre) {
            return null;
        }

        $rolDocente = Role::where('nombre', 'Docente')->first();
        if (!$rolDocente) {
            throw new \Exception("No existe el rol 'Docente'.");
        }

        // Crear o identificar usuario
        [$user, $userCreado] = User::firstOrCreate(
            ['registro' => $row['registro']],
            [
                'name'     => $nombre,
                'email'    => $row['email'] ?? "docente{$row['registro']}@ficct.com",
                'password' => Hash::make($row['password'] ?? 'password123'),
                'role_id'  => $rolDocente->id,
            ]
        )->wasRecentlyCreated
            ? [$user = User::where('registro', $row['registro'])->first(), true]
            : [$user = User::where('registro', $row['registro'])->first(), false];

        // Crear o identificar docente
        [$docente, $docenteCreado] = Docente::firstOrCreate(
            ['user_id' => $user->id],
            [
                'fecha_contrato' => $row['fecha_contrato'] ?? now(),
                'especialidad'   => $row['especialidad'] ?? null,
                'sueldo'         => $row['sueldo'] ?? 0,
                'estado'         => true,
            ]
        )->wasRecentlyCreated
            ? [$docente = Docente::where('user_id', $user->id)->first(), true]
            : [$docente = Docente::where('user_id', $user->id)->first(), false];

        // Contar nuevos/existentes
        if ($userCreado || $docenteCreado) {
            $this->nuevos++;
        } else {
            $this->existentes++;
        }

        $this->count++;

        return $docente;
    }
}