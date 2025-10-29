<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         Inertia::share([
            'auth' => function () {
                $user = Auth::user();
                if (! $user) return null;
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->nombre ?? null, // nombre del rol como string
                    'role_id' => $user->role_id ?? null,
                ];
            },
            'flash' => [
                'success' => fn () => session('success'),
                'error' => fn () => session('error'),
            ],
        ]);
    
    }
}
