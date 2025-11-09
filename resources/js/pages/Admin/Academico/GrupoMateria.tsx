import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const GrupoMateria: React.FC = () => {
  return (
    <AdminLayout>
      <Head title="Asignación de Materias a Grupos" />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">🧩 Asignación de Materias a Grupos</h1>
        <p className="text-gray-600">
          Asigna docentes y materias a grupos específicos según la gestión académica.
        </p>
      </div>
    </AdminLayout>
  );
};

export default GrupoMateria;
