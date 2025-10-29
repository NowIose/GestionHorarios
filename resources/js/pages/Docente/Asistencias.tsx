import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface HorarioMateria {
  id: number;
  aula?: { nombre: string };
  grupo_materia?: {
    materia?: { nombre: string };
    grupo?: { nombre: string };
  };
  horario?: {
    dia: string;
    hora_inicio: string;
    hora_fin: string;
  };
}

interface Asistencia {
  id: number;
  fecha: string;
  modalidad: string;
  estado: boolean;
  horario_materia?: HorarioMateria;
}

export default function Asistencias({
  horarios = [],
  asistencias = [],
}: {
  horarios: HorarioMateria[];
  asistencias: Asistencia[];
}) {
  const { flash } = usePage().props as any;
  const [selectedHorario, setSelectedHorario] = useState<number | null>(null);

  const { post, data, setData, processing, reset } = useForm({
    horario_materia_id: "",
    modalidad: "presencial",
    estado: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/docente/asistencias", {
      onSuccess: () => reset(),
    });
  };

  return (
    <AppLayout>
      <Head title="Registro de Asistencia" />

      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-600 mb-4">
          Registro de Asistencia
        </h1>

        {/* 🔔 Mensajes flash */}
        {flash?.success && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
            <CheckCircle size={20} />
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
            <XCircle size={20} />
            <span>{flash.error}</span>
          </div>
        )}

        {/* 🧾 Formulario principal */}
        <form
          onSubmit={handleSubmit}
          className="max-w-md border rounded-lg p-4 shadow-md bg-white mb-8"
        >
          {/* Selección de horario/materia */}
          <label className="block mb-2 font-semibold text-gray-700">
            Seleccione horario / materia:
          </label>
          <select
            className="w-full border rounded-md px-3 py-2 mb-4"
            value={data.horario_materia_id}
            onChange={(e) => setData("horario_materia_id", e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            {horarios.map((h) => (
              <option key={h.id} value={h.id}>
                {h.grupo_materia?.grupo?.nombre} —{" "}
                {h.grupo_materia?.materia?.nombre} (
                {h.aula?.nombre || "Sin aula"}) | {h.horario?.dia}{" "}
                {h.horario?.hora_inicio} - {h.horario?.hora_fin}
              </option>
            ))}
          </select>

          {/* Modalidad */}
          <label className="block mb-2 font-semibold text-gray-700">
            Modalidad:
          </label>
          <select
            className="w-full border rounded-md px-3 py-2 mb-4"
            value={data.modalidad}
            onChange={(e) => setData("modalidad", e.target.value)}
          >
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
          </select>

          {/* Estado */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={data.estado}
              onChange={(e) => setData("estado", e.target.checked)}
            />
            <span className="text-gray-700">Asistí hoy</span>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md"
          >
            {processing ? "Guardando..." : "Registrar Asistencia"}
          </button>
        </form>

        {/* 📋 Historial de asistencias */}
        <div className="border rounded-lg shadow-md bg-white p-4">
          <h2 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
            <Clock size={18} />
            Historial reciente
          </h2>

          {asistencias.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-orange-100">
                <tr>
                  <th className="border p-2 text-left">Fecha</th>
                  <th className="border p-2 text-left">Materia</th>
                  <th className="border p-2 text-left">Grupo</th>
                  <th className="border p-2 text-center">Modalidad</th>
                  <th className="border p-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((a) => (
                  <tr key={a.id} className="hover:bg-orange-50">
                    <td className="border p-2">
                      {new Date(a.fecha).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      {a.horario_materia?.grupo_materia?.materia?.nombre}
                    </td>
                    <td className="border p-2">
                      {a.horario_materia?.grupo_materia?.grupo?.nombre}
                    </td>
                    <td className="border p-2 text-center">{a.modalidad}</td>
                    <td className="border p-2 text-center">
                      {a.estado ? (
                        <span className="text-green-600 font-semibold">
                          Presente
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Ausente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">
              No hay asistencias registradas recientemente.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
