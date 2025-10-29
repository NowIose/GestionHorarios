import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function MisMaterias() {
  return (
    <AppLayout>
      <Head title="Mis Materias" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Mis Materias</h1>
        <p className="text-gray-600">
          Aquí el docente puede visualizar y gestionar sus materias asignadas.
        </p>
      </div>
    </AppLayout>
  );
}
