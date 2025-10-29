import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function MisHorarios() {
  return (
    <AppLayout>
      <Head title="Mis Horarios" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Mis Horarios</h1>
        <p className="text-gray-600">
          Consulta tus horarios de clase como docente.
        </p>
      </div>
    </AppLayout>
  );
}
