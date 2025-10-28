<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


//ZONA USEs PARA RUTAS DE USUARIO 
use App\Models\User; //PARA LAS RUTAS DE USUARIO
use App\Models\Role; //PARA USAR EL NOMBRE DEL ROL EN LUGAR DE ID EN ROUTA USARIOS
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            ->with('role:id,nombre') // Incluimos la relación con el rol
            ->orderBy('registro')
            ->get();

        $roles = Role::select('id', 'nombre')->get(); // Enviamos los roles al frontend

        return inertia('Admin/GestionUsuarios', [
            'users' => $users,
            'roles' => $roles,
        ]);
    })->name('admin.usuarios');



     //  CREAR NUEVO USUARIO (POST desde el modal)
    Route::post('/usuarios', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        // Generar registro incremental automático
        $registro = (User::max('registro') ?? 1000) + 1;

        User::create([
            'registro' => $registro,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
        ]);

        return redirect()
            ->route('admin.usuarios')
            ->with('success', 'Usuario creado correctamente.');
    });
    //  Actualizar usuario existente
    Route::put('/usuarios/{id}', function (Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $user = User::findOrFail($id);
        $user->update($validated);

        return redirect()
            ->route('admin.usuarios')
            ->with('success', 'Usuario actualizado correctamente.');
    });
    //  Borrar usuario existente
    Route::delete('/usuarios/{id}', function ($id) {
    $user = \App\Models\User::findOrFail($id);
    $user->delete();

    return redirect()
        ->route('admin.usuarios')
        ->with('success', 'Usuario eliminado correctamente.');
    });


    // hasta aqui usuarios

    //otra rutas para despues
    Route::get('/docentes', fn() => inertia('Admin/GestionDocentes'))->name('admin.docentes');
    Route::get('/bitacora', fn() => inertia('Admin/GestionBitacora'))->name('admin.bitacora');
    Route::get('/roles', fn() => inertia('Admin/GestionRoles'))->name('admin.roles');
    Route::get('/permisos', fn() => inertia('Admin/GestionPermisos'))->name('admin.permisos');
});

require __DIR__.'/settings.php';
