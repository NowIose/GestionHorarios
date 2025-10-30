<?php
namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use App\Models\Bitacora;
use Illuminate\Support\Facades\Request;
use Carbon\Carbon;

class RegistrarLogoutEnBitacora
{
    public function handle(Logout $event)
    {
        Bitacora::create([
            'ip' => Request::ip(),
            'fecha' => Carbon::now()->toDateString(),
            'hora' => Carbon::now()->toTimeString(),
            'descripcion' => 'Cierre de sesión.',
            'user_id' => $event->user->id ?? null,
        ]);
    }
}
