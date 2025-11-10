import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { motion } from "framer-motion";
import { Calendar, FileText } from "lucide-react";

interface Asistencia {
  id: number;
  fecha: string;
  horario_materia: {
    horario: { dia: string; hora_inicio: string; hora_fin: string };
    aula: { nro: string };
    grupo_materia: {
      materia: { sigla: string; nombre: string };
      grupo: { codigo: string };
      docente: { user: { name: string } };
    };
  };
}

interface Props {
  asistencias: Asistencia[];
  fecha: string;
}

export default function Asistencias({ asistencias, fecha }: Props) {
  const [selectedDate, setSelectedDate] = useState(fecha);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    router.get(`/admin/horarios/asistencias?fecha=${e.target.value}`);
  };

  const handleReporte = () => {
    window.open(`/admin/horarios/asistencias/reporte?fecha=${selectedDate}`, "_blank");
  };

  return (
    <AdminLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Calendar size={28} /> Registro de Asistencias
          </h1>

          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleReporte}
              className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
            >
              <FileText size={18} /> Generar Reporte
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-md border border-emerald-200">
          <table className="w-full bg-white">
            <thead className="bg-emerald-100 text-emerald-900 text-sm uppercase">
              <tr>
                <th className="p-3 text-left font-semibold">Fecha</th>
                <th className="p-3 text-left font-semibold">Horario</th>
                <th className="p-3 text-left font-semibold">Materia</th>
                <th className="p-3 text-left font-semibold">Docente</th>
                <th className="p-3 text-left font-semibold">Aula</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.length > 0 ? (
                asistencias.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-emerald-50">
                    <td className="p-3">{a.fecha}</td>
                    <td className="p-3">
                      {a.horario_materia.horario.dia} (
                      {a.horario_materia.horario.hora_inicio} -{" "}
                      {a.horario_materia.horario.hora_fin})
                    </td>
                    <td className="p-3">
                      {a.horario_materia.grupo_materia.materia.sigla} -{" "}
                      {a.horario_materia.grupo_materia.materia.nombre}
                    </td>
                    <td className="p-3">
                      {a.horario_materia.grupo_materia.docente.user.name}
                    </td>
                    <td className="p-3">{a.horario_materia.aula.nro}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No hay asistencias registradas para esta fecha.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
