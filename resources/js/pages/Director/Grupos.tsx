import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function GruposDirector() {
  return (
    <AppLayout>
      <Head title="Gestión de Grupos" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Gestión de Grupos</h1>
        <p className="text-gray-600">
          El Director de Carrera puede crear y administrar los grupos de estudiantes.
        </p>
      </div>
    </AppLayout>
  );
}
