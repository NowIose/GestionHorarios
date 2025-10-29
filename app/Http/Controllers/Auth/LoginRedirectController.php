<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class LoginRedirectController
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->role) {
             return redirect()->route('dashboard');
        }

        $role = strtolower($user->role->nombre);

        switch ($role) {
            case 'administrador':
                return redirect()->route('admin.dashboard');

            case 'docente':
                return redirect()->route('docente.dashboard');

            case 'director de carrera':
                return redirect()->route('director.dashboard');

            case 'decano':
            case 'vicedecano':
                return redirect()->route('decanato.dashboard');

            case 'secretaría':
            case 'secretaria':
                return redirect()->route('secretaria.dashboard');

            case 'usuario':
                //  Dashboard del Starter Kit
                return redirect()->route('admin.dashboard');

            default:
                //  Fallback limpio para cualquier otro rol desconocido
                return redirect()->route('admin.dashboard');
        }
    }
}
