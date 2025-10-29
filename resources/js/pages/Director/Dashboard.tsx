import React from 'react';
import AppLayout from '@/layouts/app-layout';

export default function DashboardDirector() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-600">Panel del Director de Carrera</h1>
        <p className="text-gray-600 mt-2">
          Administra grupos, horarios y asigna docentes a las materias.
        </p>
      </div>
    </AppLayout>
  );
}
