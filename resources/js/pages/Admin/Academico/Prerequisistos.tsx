import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const Prerequisitos: React.FC = () => {
  return (
    <AdminLayout>
      <Head title="Gestión de Prerrequisitos" />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">📚 Gestión de Prerrequisitos</h1>
        <p className="text-gray-600">
          Define qué materias son prerrequisitos de otras para controlar la secuencia académica.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Prerequisitos;
