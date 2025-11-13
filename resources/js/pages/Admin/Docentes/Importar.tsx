import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";

export default function ImportDocentes() {
  const { flash } = usePage().props as any;

  const { data, setData, post, processing, errors } = useForm({
    archivo: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/docentes/import");
  };

  React.useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Importar Docentes
        </h1>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label className="block mb-3 font-semibold">
            Seleccionar Archivo Excel (*.xlsx)
          </label>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setData("archivo", e.target.files?.[0] ?? null)}
            className="mb-4 border rounded p-2 w-full"
          />

          {errors.archivo && (
            <p className="text-red-500 text-sm mb-2">{errors.archivo}</p>
          )}

          <button
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {processing ? "Importando..." : "Importar"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
