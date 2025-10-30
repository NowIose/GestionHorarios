import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Clock, FileText } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Bitacora {
  id: number;
  ip: string;
  fecha: string;
  hora: string;
  descripcion: string;
  user: User;
}

export default function GestionBitacora() {
  const { props } = usePage<{ bitacoras: Bitacora[] }>();
  const bitacoras = props.bitacoras || [];

  return (
    <AdminLayout>
      <Head title="Bitácora del Sistema" />

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-orange-500" size={26} />
            Bitácora del Sistema
          </h1>
          <p className="text-gray-500 mt-1">
            Registro de accesos, acciones y eventos del sistema.
          </p>
        </div>
      </div>

      {/* Tabla de registros */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-800">
          <thead className="bg-orange-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Usuario</th>
              <th className="px-4 py-3 text-left font-semibold">Descripción</th>
              <th className="px-4 py-3 text-left font-semibold">Fecha</th>
              <th className="px-4 py-3 text-left font-semibold">Hora</th>
              <th className="px-4 py-3 text-left font-semibold">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bitacoras.length > 0 ? (
              bitacoras.map((b, i) => (
                <tr
                  key={b.id}
                  className="hover:bg-orange-50 transition duration-150 text-gray-700"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {b.user?.name || '—'}
                  </td>
                  <td className="px-4 py-3">{b.descripcion}</td>
                  <td className="px-4 py-3">{b.fecha}</td>
                  <td className="px-4 py-3">{b.hora}</td>
                  <td className="px-4 py-3">{b.ip}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  <FileText className="inline-block mr-2 text-gray-400" />
                  No hay registros en la bitácora.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
