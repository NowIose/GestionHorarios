import React from 'react';
import AppLayout from '@/layouts/app-layout';

export default function DashboardDecano() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-600">Panel del Decano</h1>
        <p className="text-gray-600 mt-2">
          Administra reportes,materias.
        </p>
      </div>
    </AppLayout>
  );
}
