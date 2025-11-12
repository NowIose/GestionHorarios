import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { motion } from "framer-motion";
import { Clock, Search } from "lucide-react";

interface Horario {
  id: number;
  horario: { dia: string; hora_inicio: string; hora_fin: string };
  aula: { nro: string; tipo: string };
  grupo_materia: {
    materia: { nombre: string; sigla: string };
    grupo: { codigo: string };
  };
}

interface Props {
  horarios: Horario[];
  nombre: string;
}

export default function MisHorarios({ horarios, nombre }: Props) {
  const [search, setSearch] = useState("");

  const filtrados = horarios.filter(
    (h) =>
      h.horario.dia.toLowerCase().includes(search.toLowerCase()) ||
      h.aula.nro.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <motion.div
        className="p-8 dark:text-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
          <Clock className="text-orange-600" /> Horarios de {nombre}
        </h1>

        <div className="mb-6 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-orange-200 dark:border-orange-600 px-4 py-2 w-full max-w-md">
          <Search className="text-orange-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por día o aula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-orange-200 dark:border-orange-600 shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 uppercase text-sm">
              <tr>
                <th className="p-3">Día</th>
                <th className="p-3">Horario</th>
                <th className="p-3">Aula</th>
                <th className="p-3">Materia</th>
                <th className="p-3">Grupo</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length ? (
                filtrados.map((h, i) => (
                  <tr
                    key={h.id}
                    className={`border-b hover:bg-orange-50 dark:hover:bg-orange-800 transition ${
                      i % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-orange-50/20 dark:bg-gray-700"
                    }`}
                  >
                    <td className="p-3 font-semibold">{h.horario.dia}</td>
                    <td className="p-3">
                      {h.horario.hora_inicio} - {h.horario.hora_fin}
                    </td>
                    <td className="p-3">
                      {h.aula.nro} ({h.aula.tipo})
                    </td>
                    <td className="p-3">{h.grupo_materia.materia.nombre}</td>
                    <td className="p-3 text-center">
                      G{h.grupo_materia.grupo.codigo}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                  >
                    No se encontraron horarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AppLayout>
  );
}
