<?php

namespace App\Http\Controllers\Admin\Docente;

use App\Http\Controllers\Controller;
use App\Imports\DocentesImport;
use App\Models\Bitacora;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Auth;

class DocenteImportController extends Controller
{
    public function index()
    {
        return inertia('Admin/Docentes/Importar');
    }

    public function store(Request $request)
    {
        $request->validate([
            'archivo' => 'required|mimes:xlsx,xls'
        ]);

        $import = new DocentesImport();

        Excel::import($import, $request->file('archivo'));

        $total = $import->count;
        $nuevos = $import->nuevos;
        $existentes = $import->existentes;

        // 🟦 Registro correcto en bitácora según tu tabla
        Bitacora::create([
            'ip'          => $request->ip(),
            'fecha'       => now()->toDateString(),
            'hora'        => now()->format('H:i:s'),
            'descripcion' =>  "Importación de docentes: $nuevos nuevos, $existentes existentes (total $total).",
            'user_id'     => Auth::id(),
        ]);

        return back()->with('success', "✔ Se importaron $nuevos nuevos y $existentes ya existentes (total $total).");
    }
}
