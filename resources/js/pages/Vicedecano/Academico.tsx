import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function AcademicoVicedecano() {
  return (
    <AppLayout>
      <Head title="Gestión Académica" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Gestión Académica</h1>
        <p className="text-gray-600">
          Supervisa las actividades académicas de la facultad.
        </p>
      </div>
    </AppLayout>
  );
}
