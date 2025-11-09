<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


//ZONA USEs PARA RUTAS DE USUARIO 
use App\Models\User; //PARA LAS RUTAS DE USUARIO
use App\Models\Role; //PARA USAR EL NOMBRE DEL ROL EN LUGAR DE ID EN ROUTA USARIOS,DOCENTES,PARA LAS USES DE ROLES,
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
//ZONA USEs PARA RUTAS DEL DOCENTE
use App\Models\Docente;
//ZONA USEs PARA RUTAS DE LOS PERMISOS
use App\Models\Permission;
//ZONA USEs PARA RUTAS DE LOS ROLES

//ZONA USEs PARA RUTAS DE LA ASISTENCIA DE DOCENTES
use App\Http\Controllers\Docente\AsistenciaController;

//NUEVO CONTROLLER PARA REDIRECCION DE USUARIOSS
use App\Http\Controllers\Auth\LoginRedirectController;
//ZONA USEs PARA RUTAS DE LA BITACORA
use App\Http\Controllers\Admin\BitacoraController;
//ZONA USES PARA EL MODULO 2 DE DOCENTES
   use App\Models\Materia;
    use App\Models\Grupo;
    use App\Models\Prerequisito;
    use App\Models\GrupoMateria;
use App\Http\Controllers\Admin\Academico\MateriaController;
use App\Http\Controllers\Admin\Academico\GrupoController;
use App\Http\Controllers\Admin\Academico\GrupoMateriaController;

//PAGINA PRINCIPAL NO TOCAR 
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*//ZONA NORMAL USUARIOS AUTENTICADOS (DASHBOARD ORIGINAL)
Route::get('/dashboard', fn() => inertia('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
*/
   //  Redirección post-login según el rol

     Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
    });
 /*   Route::get('/redirect', LoginRedirectController::class)
        ->middleware(['auth', 'verified'])
        ->name('login.redirect');

    Route::get('/redirect', LoginRedirectController::class)
    ->middleware(['auth', 'verified'])
    ->name('login.redirect');*/

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
    //ZONA NORMAL USUARIOS AUTENTICADOS NO TOCAR
   

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

    //GESTION DOCENTES
    //Route::get('/docentes', fn() => inertia('Admin/GestionDocentes'))->name('admin.docentes');

    Route::get('/docentes', function () {
        $docentes = Docente::with(['user', 'grupoMaterias.materia', 'grupoMaterias.grupo'])
            ->orderBy('id')
            ->get();

        return inertia('Admin/GestionDocentes', [
            'docentes' => $docentes,
        ]);
    })->name('admin.docentes');


    //  PUT para actualizar datos del docente
    Route::put('/docentes/{id}', function (Request $request, $id) {
        $validated = $request->validate([
            'especialidad' => 'nullable|string|max:255',
            'sueldo' => 'nullable|numeric|min:0',
            'fecha_contrato' => 'nullable|date',
            'estado' => 'boolean',
        ]);

        $docente = Docente::findOrFail($id);
        $docente->update($validated);

        return redirect()->route('admin.docentes')
            ->with('success', 'Datos del docente actualizados correctamente.');
    });

    
    
    //GESTION PERMISOS 
    //Route::get('/permisos', fn() => inertia('Admin/GestionPermisos'))->name('admin.permisos');

    Route::get('/permisos', function () {
        $permisos = Permission::select('id', 'nombre', 'descripcion')->orderBy('id')->get();

        return inertia('Admin/GestionPermisos', [
            'permisos' => $permisos,
        ]);
    })->name('admin.permisos');

    // Crear permiso
    Route::post('/permisos', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'nombre' => 'required|string|unique:permissions,nombre|max:255',
            'descripcion' => 'nullable|string|max:255',
        ]);

        Permission::create($validated);

        return redirect()->route('admin.permisos')->with('success', 'Permiso creado correctamente.');
    });

    // Actualizar permiso
    Route::put('/permisos/{id}', function (\Illuminate\Http\Request $request, $id) {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:permissions,nombre,' . $id,
            'descripcion' => 'nullable|string|max:255',
        ]);

        $permiso = Permission::findOrFail($id);
        $permiso->update($validated);

        return redirect()->route('admin.permisos')->with('success', 'Permiso actualizado correctamente.');
    });

    // Eliminar permiso
    Route::delete('/permisos/{id}', function ($id) {
        Permission::findOrFail($id)->delete();

        return redirect()->route('admin.permisos')->with('success', 'Permiso eliminado correctamente.');
    });



    //GESTION ROLES
    //Route::get('/roles', fn() => inertia('Admin/GestionRoles'))->name('admin.roles');
    

    //  Mostrar roles con sus permisos
    Route::get('/roles', function () {
        // Traemos los roles con todos sus permisos (incluyendo módulo)
        $roles = Role::with('permissions:id,nombre,descripcion,modulo')->get();

        // Traemos todos los permisos, incluyendo el campo 'modulo'
        $permissions = Permission::select('id', 'nombre', 'descripcion', 'modulo')
            ->orderBy('modulo')
            ->orderBy('id')
            ->get();

        return inertia('Admin/GestionRoles', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    })->name('admin.roles');


    //  Crear rol
    Route::post('/roles', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:roles,nombre',
            'descripcion' => 'nullable|string|max:255',
            'permissions' => 'array',
        ]);

        // Crear el rol
        $role = Role::create([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
        ]);

        // Asignar permisos (si los hay)
        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('admin.roles')
            ->with('success', 'Rol creado correctamente.');
    });


    // Editar rol
    Route::put('/roles/{id}', function (\Illuminate\Http\Request $request, $id) {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:roles,nombre,' . $id,
            'descripcion' => 'nullable|string|max:255',
            'permissions' => 'array',
        ]);

        $role = Role::findOrFail($id);
        $role->update([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
        ]);

        // Actualizamos los permisos del rol
        $role->permissions()->sync($validated['permissions'] ?? []);

        return redirect()->route('admin.roles')
            ->with('success', 'Rol actualizado correctamente.');
    });


    //  Eliminar rol
    Route::delete('/roles/{id}', function ($id) {
        $role = Role::findOrFail($id);

        // Eliminamos también las relaciones de permisos
        $role->permissions()->detach();
        $role->delete();

        return redirect()->route('admin.roles')
            ->with('success', 'Rol eliminado correctamente.');
    });



    //otra rutas para despues
   // Route::get('/bitacora', fn() => inertia('Admin/GestionBitacora'))->name('admin.bitacora');
    Route::get('/bitacora', [BitacoraController::class, 'index'])->name('admin.bitacora');

     /*
    |--------------------------------------------------------------------------
    | GESTIÓN ACADÉMICA (Materias, Grupos, Prerequisitos, GrupoMateria)
    |--------------------------------------------------------------------------
    */

    // 🔹 Materias (con prerequisitos)
    Route::get('/materias', function () {
        $materias = \App\Models\Materia::with([
            'prerequisitos.materiaRequisito:id,sigla,nombre,semestre,creditos',
        ])
            ->orderBy('semestre')
            ->get();
             // 👇 Esto es temporal solo para verificar qué devuelve
    //dd($materias->toArray());
        return inertia('Admin/Academico/Materias', [
            'materias' => $materias,
        ]);
    })->name('admin.materias');

    Route::post('/materias', [MateriaController::class, 'store']);
    Route::put('/materias/{materia}', [MateriaController::class, 'update']);
    Route::delete('/materias/{materia}', [MateriaController::class, 'destroy']);

    // 🔹 Grupos
    Route::get('/grupos', [GrupoController::class, 'index'])->name('admin.grupos');
    Route::post('/grupos', [GrupoController::class, 'store']);
    Route::put('/grupos/{grupo}', [GrupoController::class, 'update']);
    Route::delete('/grupos/{grupo}', [GrupoController::class, 'destroy']);

    // 🔹 Grupo-Materia (asignar docentes y materias a grupos)
    Route::get('/grupo-materia', [GrupoMateriaController::class, 'index'])->name('admin.grupoMateria');
    Route::post('/grupo-materia', [GrupoMateriaController::class, 'store']);
    Route::delete('/grupo-materia/{grupoMateria}', [GrupoMateriaController::class, 'destroy']);

});



/*
    |--------------------------------------------------------------------------
    | ZONA DOCENTE
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth'])->prefix('docente')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Docente/Dashboard'))->name('docente.dashboard');
        Route::get('/materias', fn() => Inertia::render('Docente/MisMaterias'))->name('docente.materias');
        Route::get('/horarios', fn() => Inertia::render('Docente/MisHorarios'))->name('docente.horarios');
        Route::get('/asistencias', fn() => Inertia::render('Docente/Asistencias'))->name('docente.asistencias');
        
    });

    Route::middleware(['auth'])->prefix('docente')->group(function () {
        Route::get('/asistencias', [AsistenciaController::class, 'index'])->name('docente.asistencias');
        Route::post('/asistencias', [AsistenciaController::class, 'store'])->name('docente.asistencias.store');
    });

    /*
    |--------------------------------------------------------------------------
    | ZONA DIRECTOR DE CARRERA
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth'])->prefix('director')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Director/Dashboard'))->name('director.dashboard');
        Route::get('/grupos', fn() => Inertia::render('Director/Grupos'))->name('director.grupos');
        Route::get('/horarios', fn() => Inertia::render('Director/Horarios'))->name('director.horarios');
        Route::get('/asignaciones', fn() => Inertia::render('Director/Asignaciones'))->name('director.asignaciones');
    });

    /*
    |--------------------------------------------------------------------------
    | ZONA DECANO
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth'])->prefix('decano')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Decano/Dashboard'))->name('decano.dashboard');
        Route::get('/facultades', fn() => Inertia::render('Decano/Facultades'))->name('decano.facultades');
        Route::get('/reportes', fn() => Inertia::render('Decano/Reportes'))->name('decano.reportes');
    });

    /*
    |--------------------------------------------------------------------------
    | ZONA VICEDECANO
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth'])->prefix('vicedecano')->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Vicedecano/Dashboard'))->name('vicedecano.dashboard');
        Route::get('/academico', fn() => Inertia::render('Vicedecano/Academico'))->name('vicedecano.academico');
        Route::get('/docentes', fn() => Inertia::render('Vicedecano/Docentes'))->name('vicedecano.docentes');
    });

    

Route::get('/test', fn() => Inertia::render('Docente/Dashboard'));
require __DIR__.'/settings.php';
