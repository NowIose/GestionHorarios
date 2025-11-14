<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permiso)
    {
        $user = Auth::user();

        // Si es ADMIN, siempre permitir
        if ($user->role->nombre === 'Administrador') {
            return $next($request);
        }

        // Si es DOCENTE, nunca acceder al admin
        if ($user->role->nombre === 'Docente') {
            return redirect()->route('docente.dashboard')
                ->with('toast', '❌ No tienes permiso para acceder al panel administrativo.');
        }

        // Si el rol tiene permisos específicos
        if (!$user->role->permissions->contains('nombre', $permiso)) {
            return redirect()->route('admin.dashboard')
                ->with('toast', '❌ No tienes permiso para acceder a este módulo.');
        }

        return $next($request);
    }
}
