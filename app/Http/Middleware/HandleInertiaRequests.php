<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    /*public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }*/
     public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // El usuario (sin exponer campos sensibles)
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'registro' => $request->user()->registro ?? null,
                    'role' => $request->user()->role ? [
                        'id' => $request->user()->role->id,
                        'nombre' => $request->user()->role->nombre,
                    ] : null,
                ] : null,
            ],

            // Permisos: lista simple de strings (ej: ['ver_usuarios', 'crear_usuarios', ...])
            'permissions' => function () use ($request) {
                if (! $request->user() || ! $request->user()->role) {
                    return [];
                }

                // Ajusta según tu relación Role->permissions
                return $request->user()
                    ->role
                    ->permissions
                    ->pluck('nombre')
                    ->toArray();
            },

            // Flash messages (opcional, útil para toasts)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'toast' => session('toast'),
        ]);
    }
}
