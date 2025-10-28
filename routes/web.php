<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


//ZONA USEs PARA RUTAS DE USUARIO 
use App\Models\User; //PARA LAS RUTAS DE USUARIO
use App\Models\Role; //PARA USAR EL NOMBRE DEL ROL EN LUGAR DE ID EN ROUTA USARIOS


//PAGINA PRINCIPAL NO TOCAR 
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

//ZONA NORMAL USUARIOS AUTENTICADOS NO TOCAR
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
 

//ZONA ADMIN
Route::middleware(['auth'])->prefix('admin')->group(function () {

    // Dashboard principal del admin
    Route::get('/dashboard', fn() => inertia('Admin/Dashboard'))->name('admin.dashboard');

    // Módulos de gestión
    //CAMBIARMOS PARA QUE ENVIE LOS DATOS POR INERTIA

    //Route::get('/usuarios', fn() => inertia('Admin/GestionUsuarios'))->name('admin.usuarios');
    
    //GESTION USUARIOS 
    Route::get('/usuarios', function () {
        $users = User::select('id', 'registro', 'name', 'email', 'role_id')
        ->with('role:id,nombre') // 👈 Incluimos la relación
        ->get();

        $roles = Role::select('id', 'nombre')->get(); // 👈 Enviamos los roles también

        return inertia('Admin/GestionUsuarios', [
            'users' => $users,
            'roles' => $roles,
    ]);
    })->name('admin.usuarios');

    Route::get('/docentes', fn() => inertia('Admin/GestionDocentes'))->name('admin.docentes');
    Route::get('/bitacora', fn() => inertia('Admin/GestionBitacora'))->name('admin.bitacora');
    Route::get('/roles', fn() => inertia('Admin/GestionRoles'))->name('admin.roles');
    Route::get('/permisos', fn() => inertia('Admin/GestionPermisos'))->name('admin.permisos');
});

require __DIR__.'/settings.php';
