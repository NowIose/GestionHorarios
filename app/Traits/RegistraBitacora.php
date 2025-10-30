<?php
namespace App\Traits;

use App\Models\Bitacora;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

trait RegistraBitacora
{
    /**
     * Registra una entrada en la bitácora.
     */
    public function registrarBitacora(string $descripcion)
    {
        Bitacora::create([
            'ip' => Request::ip(),
            'fecha' => Carbon::now()->toDateString(),
            'hora' => Carbon::now()->toTimeString(),
            'descripcion' => $descripcion,
            'user_id' => Auth::id(),
        ]);
    }
}
