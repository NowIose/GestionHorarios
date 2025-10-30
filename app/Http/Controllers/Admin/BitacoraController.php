<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bitacora;
use Inertia\Inertia;

class BitacoraController extends Controller
{
    public function index()
    {
        $bitacoras = Bitacora::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->get(['id', 'ip', 'fecha', 'hora', 'descripcion', 'user_id']);

        return Inertia::render('Admin/GestionBitacora', [
            'bitacoras' => $bitacoras,
        ]);
    }
}
