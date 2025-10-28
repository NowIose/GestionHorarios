<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::middleware(['auth'])->prefix('admin')->group(function () {

    // Dashboard principal del admin
    Route::get('/dashboard', fn() => inertia('Admin/Dashboard'))->name('admin.dashboard');

    // Módulos de gestión
    Route::get('/usuarios', fn() => inertia('Admin/GestionUsuarios'))->name('admin.usuarios');
    Route::get('/docentes', fn() => inertia('Admin/GestionDocentes'))->name('admin.docentes');
    Route::get('/bitacora', fn() => inertia('Admin/GestionBitacora'))->name('admin.bitacora');
    Route::get('/roles', fn() => inertia('Admin/GestionRoles'))->name('admin.roles');
    Route::get('/permisos', fn() => inertia('Admin/GestionPermisos'))->name('admin.permisos');
});

require __DIR__.'/settings.php';
