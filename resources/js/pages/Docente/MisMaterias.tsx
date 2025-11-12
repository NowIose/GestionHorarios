import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";

interface Materia {
  id: number;
  materia: { sigla: string; nombre: string; semestre: string; creditos: number };
  grupo: { codigo: string };
}

interface Props {
  materias: Materia[];
  nombre: string;
}

export default function MisMaterias({ materias, nombre }: Props) {
  const [search, setSearch] = useState("");

  const filtradas = materias.filter(
    (m) =>
      m.materia.nombre.toLowerCase().includes(search.toLowerCase()) ||
      m.materia.sigla.toLowerCase().includes(search.toLowerCase())
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
          <BookOpen className="text-orange-600" /> Materias de {nombre}
        </h1>

        <div className="mb-6 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-orange-200 dark:border-orange-600 px-4 py-2 w-full max-w-md">
          <Search className="text-orange-500" size={18} />
          <input
            type="text"
            placeholder="Buscar materia o sigla..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtradas.length ? (
            filtradas.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 dark:from-orange-500 dark:via-orange-600 dark:to-orange-700 text-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-1">
                  {m.materia.sigla} — {m.materia.nombre}
                </h2>
                <p className="text-sm mb-1">Grupo: G{m.grupo.codigo}</p>
                <p className="text-sm mb-1">Semestre: {m.materia.semestre}</p>
                <p className="text-sm opacity-90">
                  Créditos: {m.materia.creditos}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No se encontraron materias.
            </p>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
