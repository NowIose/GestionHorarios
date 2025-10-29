import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function FacultadesDecano() {
  return (
    <AppLayout>
      <Head title="Gestión de Facultades" />

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-orange-600">Gestión de Facultades</h1>
        <p className="text-gray-600">
          El Decano puede gestionar las facultades de la institución.
        </p>
      </div>
    </AppLayout>
  );
}
