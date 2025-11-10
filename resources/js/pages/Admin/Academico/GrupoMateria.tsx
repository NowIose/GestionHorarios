import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronDown, ChevronUp, Trash2, BookOpen, Users, Calendar } from "lucide-react";

interface Asignacion {
  id: number;
  grupo: { id: number; codigo: string };
  materia: { id: number; sigla: string; nombre: string };
  docente?: { id: number; user: { name: string } } | null;
  gestion: number;
}

interface Grupo {
  id: number;
  codigo: string;
}

interface Materia {
  id: number;
  sigla: string;
  nombre: string;
}

interface Docente {
  id: number;
  user: { name: string };
}

interface Props {
  asignaciones: Asignacion[];
  grupos: Grupo[];
  materias: Materia[];
  docentes: Docente[];
}

export default function GrupoMateria({ asignaciones, grupos, materias, docentes }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { data, setData, post, delete: destroy, reset } = useForm({
    grupo_id: "",
    materia_id: "",
    docente_id: "",
    gestion: new Date().getFullYear(),
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // ⚠️ Validación para evitar asignaciones duplicadas
  const existe = asignaciones.some(
    (a) =>
      a.grupo.id === Number(data.grupo_id) &&
      a.materia.id === Number(data.materia_id) &&
      a.gestion === Number(data.gestion)
  );

  if (existe) {
    toast.error("⚠️ Ya existe esta asignación para ese grupo, materia y gestión.");
    return; // 🚫 Evita enviar el formulario
  }

  // ✅ Si no hay duplicados, procede a guardar normalmente
  post("/admin/grupo-materia", {
    onSuccess: () => {
      toast.success("✅ Asignación registrada correctamente");
      reset();
      setShowForm(false);
    },
  });
};


  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta asignación?")) {
      destroy(`/admin/grupo-materia/${id}`, {
        onSuccess: () => toast.success("🗑️ Asignación eliminada correctamente"),
      });
    }
  };

  const filtered = asignaciones.filter(
    (a) =>
      a.grupo.codigo.toLowerCase().includes(search.toLowerCase()) ||
      a.materia.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.materia.sigla.toLowerCase().includes(search.toLowerCase()) ||
      a.docente?.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl font-bold text-purple-900 flex items-center gap-2">
            <Layers size={28} /> Asignación Grupo - Materia
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
          >
            {showForm ? (
              <>
                <ChevronUp size={18} /> Cerrar Formulario
              </>
            ) : (
              <>
                <ChevronDown size={18} /> Nueva Asignación
              </>
            )}
          </button>
        </div>

        {/* Formulario */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-purple-200 overflow-hidden"
            >
              {/* Cabecera visual */}
              <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Layers size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-wide">Nueva Asignación</h2>
                    <p className="text-sm text-purple-100">
                      Asocia una materia y un docente a un grupo académico.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Grupo */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Grupo *</label>
                  <select
                    value={data.grupo_id}
                    onChange={(e) => setData("grupo_id", e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Seleccione un grupo</option>
                    {grupos.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.codigo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Materia */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Materia *</label>
                  <select
                    value={data.materia_id}
                    onChange={(e) => setData("materia_id", e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Seleccione una materia</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.sigla} — {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Docente */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Docente</label>
                  <select
                    value={data.docente_id}
                    onChange={(e) => setData("docente_id", e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sin asignar</option>
                    {docentes.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.user.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gestión */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Gestión *</label>
                  <input
                    type="number"
                    min="2020"
                    max={new Date().getFullYear() + 1}
                    value={data.gestion}
                    onChange={(e) => setData("gestion", Number(e.target.value))}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-5 py-2 rounded-md hover:bg-purple-800 transition shadow-md"
                >
                  Guardar Asignación
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Buscador */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="🔍 Buscar por grupo, materia o docente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-80 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tabla de asignaciones */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-xl shadow-md border border-purple-200"
        >
          <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white p-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-lg font-semibold tracking-wide">📘 Asignaciones Registradas</h2>
            <span className="bg-white/20 px-3 py-1 rounded-md text-sm shadow">
              Total: {filtered.length}
            </span>
          </div>

          <table className="w-full bg-white">
            <thead className="bg-purple-100 text-purple-900 text-sm uppercase">
              <tr>
                <th className="p-3 text-left font-semibold">Grupo</th>
                <th className="p-3 text-left font-semibold">Materia</th>
                <th className="p-3 text-left font-semibold">Docente</th>
                <th className="p-3 text-center font-semibold">Gestión</th>
                <th className="p-3 text-center font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-purple-50/30" : "bg-white"
                    } hover:bg-purple-100/40 transition-all duration-200`}
                  >
                    <td className="p-3 text-gray-800 font-medium">{a.grupo.codigo}</td>
                    <td className="p-3 text-gray-700">
                      {a.materia.sigla} — {a.materia.nombre}
                    </td>
                    <td className="p-3 text-gray-700">
                      {a.docente ? a.docente.user.name : "—"}
                    </td>
                    <td className="p-3 text-center text-purple-800 font-semibold">
                      {a.gestion}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm mx-auto"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No hay asignaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
