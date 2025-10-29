import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function HorariosDirector() {
  return (
    <AppLayout>
      <Head title="Gestión de Horarios" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Gestión de Horarios</h1>
        <p className="text-gray-600">
          El Director de Carrera administra los horarios y sus asignaciones.
        </p>
      </div>
    </AppLayout>
  );
}
