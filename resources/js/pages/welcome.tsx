import React from 'react';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            {/* Encabezado */}
            <header className="absolute top-6 right-6 flex gap-4">
                <Link
                    href="/login"
                    className="text-gray-300 hover:text-orange-400 transition"
                >
                    Iniciar sesión
                </Link>
                <Link
                    href="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md transition"
                >
                    Registrarse
                </Link>
            </header>

            {/* Contenido principal */}
            <main className="flex flex-col md:flex-row items-center justify-center gap-12 p-6 text-center md:text-left">
                {/* Texto principal */}
                <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
                        Sistema de Control de Docentes
                    </h1>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Bienvenido al sistema de gestión docente de la Facultad de Ingeniería
                        en Ciencias de la Computación y Telecomunicaciones — UAGRM.
                    </p>
                    <Link
                        href="/login"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
                    >
                        Entrar al sistema
                    </Link>
                </div>

                {/* Imagen institucional */}
                <div className="w-72 md:w-96 flex justify-center">
                    <img
                        src="/images/ficct_logo.png" // 📌 Cambia el nombre según tu archivo real
                        alt="Facultad de Ingeniería - UAGRM"
                        className="rounded-xl shadow-lg border border-orange-700"
                    />
                </div>
            </main>

            {/* Pie de página */}
            <footer className="mt-12 text-gray-400 text-sm">
                <p>
                    © {new Date().getFullYear()} Facultad de Ingeniería - FICCT |{' '}
                    <a
                        href="https://github.com/NowIose/GestionHorarios.git"
                        target="_blank"
                        className="text-orange-400 hover:text-orange-500"
                    >
                        Repositorio del proyecto
                    </a>
                </p>
            </footer>
        </div>
    );
}
