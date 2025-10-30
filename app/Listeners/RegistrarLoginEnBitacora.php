<?php
namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use App\Models\Bitacora;
use Illuminate\Support\Facades\Request;
use Carbon\Carbon;

class RegistrarLoginEnBitacora
{
    public function handle(Login $event)
    {
        Bitacora::create([
            'ip' => Request::ip(),
            'fecha' => Carbon::now()->toDateString(),
            'hora' => Carbon::now()->toTimeString(),
            'descripcion' => 'Inicio de sesión exitoso.',
            'user_id' => $event->user->id,
        ]);
    }
}
