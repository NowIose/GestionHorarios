import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

// Tipo para los módulos
interface Modulo {
  nombre: string;
  ruta: string;
}

// Props opcionales (por si luego quieres pasar info del usuario)
interface Props {
  auth?: {
    user: {
      id: number;
      name: string;
      email: string;
      role_id: number;
    };
  };
}

export default function Dashboard({ auth }: Props) {
  // Lista de módulos del panel admin
  const modulos: Modulo[] = [
    { nombre: 'Gestión de Usuarios', ruta: '/admin/usuarios' },
    { nombre: 'Gestión de Docentes', ruta: '/admin/docentes' },
    { nombre: 'Gestión de Bitácora', ruta: '/admin/bitacora' },
    { nombre: 'Gestión de Roles', ruta: '/admin/roles' },
    { nombre: 'Gestión de Permisos', ruta: '/admin/permisos' },
  ];

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          {auth?.user && (
            <p className="text-gray-500 mt-2">
              Bienvenido, <span className="font-semibold">{auth.user.name}</span>
            </p>
          )}
        </div>

        {/* Aquí puedes poner widgets, estadísticas, o accesos rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo, i) => (
            <Link
              key={i}
              href={modulo.ruta}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 hover:border-gray-400 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800">{modulo.nombre}</h2>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

