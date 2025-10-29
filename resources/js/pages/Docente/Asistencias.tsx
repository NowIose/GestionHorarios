import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Asistencias() {
  return (
    <AppLayout>
      <Head title="Control de Asistencias" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Control de Asistencias</h1>
        <p className="text-gray-600">
          Registra y consulta las asistencias de tus clases.
        </p>
      </div>
    </AppLayout>
  );
}
