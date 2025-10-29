import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function AsignacionesDirector() {
  return (
    <AppLayout>
      <Head title="Asignación de Materias" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Asignación de Materias</h1>
        <p className="text-gray-600">
          Aquí puedes asignar materias a los docentes y grupos.
        </p>
      </div>
    </AppLayout>
  );
}
