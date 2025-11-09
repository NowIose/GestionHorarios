import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const Grupos: React.FC = () => {
  return (
    <AdminLayout>
      <Head title="Gestión de Grupos" />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">👥 Gestión de Grupos</h1>
        <p className="text-gray-600">
          Administra los grupos académicos: código, cupos, modalidad y otros datos relevantes.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Grupos;
