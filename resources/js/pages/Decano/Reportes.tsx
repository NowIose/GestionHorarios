import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ReportesDecano() {
  return (
    <AppLayout>
      <Head title="Reportes Generales" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Reportes Generales</h1>
        <p className="text-gray-600">
          Visualiza reportes globales de docentes, grupos y materias.
        </p>
      </div>
    </AppLayout>
  );
}
