import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import MallaMaterias from "./MallaMaterias";

// ✅ Tipo local (no interfiere con MallaMaterias)
interface Materia {
  id: number;
  sigla: string;
  nombre: string;
  semestre: number;
  creditos: number | null;
  prerequisitos?: {
    materia_requisito_id?: number;
    materia_requisito?: Materia;
  }[];
}

interface Props {
  materias: Materia[];
}

export default function Materias({ materias }: Props) {
  const [editing, setEditing] = useState<Materia | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewMalla, setViewMalla] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // ✅ Adaptado para múltiples prerequisitos
  const { data, setData, post, put, delete: destroy, reset } = useForm({
    sigla: "",
    nombre: "",
    semestre: 1,
    creditos: 1,
    prerequisito_ids: [] as number[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(`/admin/materias/${editing.id}`, {
        onSuccess: () => {
          toast.success("✅ Materia actualizada");
          reset();
          setEditing(null);
          setShowForm(false);
        },
      });
    } else {
      post("/admin/materias", {
        onSuccess: () => {
          toast.success("✅ Materia creada");
          reset();
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (m: Materia) => {
    setEditing(m);
    setData({
      sigla: m.sigla,
      nombre: m.nombre,
      semestre: m.semestre,
      creditos: m.creditos || 1,
      prerequisito_ids:
        m.prerequisitos?.map((p) => p.materia_requisito_id ?? 0) || [],
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta materia?")) {
      destroy(`/admin/materias/${id}`, {
        onSuccess: () => toast.success("🗑️ Materia eliminada"),
      });
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = materias.filter(
    (m) =>
      m.nombre.toLowerCase().includes(search.toLowerCase()) ||
      m.sigla.toLowerCase().includes(search.toLowerCase())
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
            <BookOpen size={28} /> Gestión de Materias
          </h1>
          <div className="flex gap-2">
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
                  <ChevronDown size={18} /> Agregar Materia
                </>
              )}
            </button>
            <button
              onClick={() => setViewMalla(!viewMalla)}
              className="bg-purple-900 hover:bg-purple-950 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
            >
              <Eye size={18} /> {viewMalla ? "Ocultar Malla" : "Ver Malla"}
            </button>
          </div>
        </div>

        {/* FORMULARIO */}
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
              {/* 🌈 Cabecera visual */}
              <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <BookOpen size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-wide">
                      {editing ? "Editar Materia" : "Nueva Materia"}
                    </h2>
                    <p className="text-sm text-purple-100">
                      {editing
                        ? "Modifica los datos de la materia seleccionada"
                        : "Agrega una nueva materia al plan académico"}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-md text-sm">
                  {editing ? "✏️ Edición" : "➕ Creación"}
                </span>
              </div>

              {/* 🧩 Contenido del formulario */}
              <div className="p-6 space-y-6">
                {/* Sección 1: Datos Generales */}
                <div>
                  <h3 className="flex items-center gap-2 text-purple-800 font-semibold text-lg mb-3">
                    🧾 Datos Generales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Sigla *
                      </label>
                      <input
                        type="text"
                        placeholder="INF101"
                        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                        value={data.sigla}
                        onChange={(e) => setData("sigla", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        placeholder="Programación I"
                        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                        value={data.nombre}
                        onChange={(e) => setData("nombre", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Semestre *
                      </label>
                      <select
                        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                        value={data.semestre}
                        onChange={(e) => setData("semestre", Number(e.target.value))}
                      >
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Semestre {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Créditos *
                      </label>
                      <select
                        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                        value={data.creditos}
                        onChange={(e) => setData("creditos", Number(e.target.value))}
                      >
                        {Array.from({ length: 6 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sección 2: Prerequisitos (multi select) */}
<div>
  <h3 className="flex items-center gap-2 text-purple-800 font-semibold text-lg mb-3">
    🔗 Prerequisitos
  </h3>
  <div>
    <label className="text-sm font-semibold text-gray-700">
      Selecciona una o más materias prerequisito (opcional)
    </label>
    <select
      multiple
      value={data.prerequisito_ids.map(String)}
      onChange={(e) =>
        setData(
          "prerequisito_ids",
          Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
        )
      }
      className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
      size={5}
    >
      {materias
        // ✅ Filtramos según las condiciones:
        // - solo materias de semestre menor
        // - si está editando, excluir la misma materia
        .filter(
          (m) =>
            m.semestre < data.semestre &&
            (!editing || m.id !== editing.id)
        )
        .map((m) => (
          <option key={m.id} value={m.id}>
            {m.sigla} — {m.nombre} (S{m.semestre})
          </option>
        ))}
    </select>

    {/* Mensaje visual de ayuda */}
    <p className="text-xs text-gray-500 mt-1">
      Solo se muestran materias de semestres anteriores. Mantén presionado{" "}
      <strong>Ctrl</strong> (Windows) o <strong>Cmd</strong> (Mac) para
      seleccionar varias.
    </p>

    {/* 🟣 Advertencia visual si no hay prerequisitos válidos */}
    {materias.filter(
      (m) =>
        m.semestre < data.semestre &&
        (!editing || m.id !== editing.id)
    ).length === 0 && (
      <p className="text-xs text-amber-600 mt-1">
        No hay materias de semestres anteriores disponibles como prerequisitos.
      </p>
    )}
  </div>
</div>

                {/* Botones */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-purple-700 text-white px-5 py-2 rounded-md hover:bg-purple-800 transition shadow-md"
                  >
                    {editing ? "Actualizar Materia" : "Agregar Materia"}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setEditing(null);
                        setShowForm(false);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Buscador */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o sigla..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-72 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tabla */}
        {!viewMalla && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-x-auto rounded-xl shadow-md border border-purple-200"
          >
            <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white p-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-md">
                  <Layers size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-wide">
                    📚 Listado de Materias
                  </h2>
                  <p className="text-xs text-purple-200">
                    Gestión general de todas las materias registradas
                  </p>
                </div>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-md text-sm shadow">
                Total: {filtered.length}
              </span>
            </div>

            <table className="w-full bg-white">
              <thead className="bg-purple-100 text-purple-900 text-sm uppercase">
                <tr>
                  <th className="p-3 text-left font-semibold">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} /> SIGLA
                    </div>
                  </th>
                  <th className="p-3 text-left font-semibold">
                    <div className="flex items-center gap-2">
                      <FileText size={16} /> NOMBRE
                    </div>
                  </th>
                  <th className="p-3 text-center font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Layers size={16} /> SEMESTRE
                    </div>
                  </th>
                  <th className="p-3 text-center font-semibold">
                    ⊜ CRÉDITOS
                  </th>
                  <th className="p-3 text-center font-semibold">🔗 PREREQS</th>
                  <th className="p-3 text-center font-semibold">⚙️ ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((m, i) => (
                    <React.Fragment key={m.id}>
                      <motion.tr
                        className={`border-b ${
                          i % 2 === 0 ? "bg-purple-50/30" : "bg-white"
                        } hover:bg-purple-100/40 transition-all duration-200`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <td className="p-3 font-medium text-gray-800">
                          {m.sigla}
                        </td>
                        <td className="p-3 text-gray-700">{m.nombre}</td>
                        <td className="p-3 text-center font-semibold text-purple-800">
                          {m.semestre}
                        </td>
                        <td className="p-3 text-center text-gray-700">
                          {m.creditos}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleExpand(m.id)}
                            className="text-purple-700 hover:text-purple-900 transition"
                            title="Ver prerequisitos"
                          >
                            {expanded[m.id] ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(m)}
                              title="Editar materia"
                              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition shadow-sm"
                            >
                              ✏️ <span className="hidden sm:inline">Editar</span>
                            </button>
                            <button
                              onClick={() => handleDelete(m.id)}
                              title="Eliminar materia"
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
                            >
                              🗑️ <span className="hidden sm:inline">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>

                      {/* 🔽 Filas de prerequisitos desplegables */}
                      <AnimatePresence>
                        {expanded[m.id] && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-purple-50/20"
                          >
                            <td colSpan={6} className="p-4">
                              {m.prerequisitos && m.prerequisitos.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                  {m.prerequisitos.map((p, idx) => (
                                    <li key={idx}>
                                      {p.materia_requisito?.sigla} —{" "}
                                      {p.materia_requisito?.nombre}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500 italic">
                                  No tiene prerequisitos.
                                </p>
                              )}
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-500 font-medium"
                    >
                      No se encontraron materias registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Malla */}
        {viewMalla && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-white shadow-lg rounded-xl p-4 border border-purple-300"
          >
            <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} /> Malla Curricular
            </h2>
            <MallaMaterias materias={materias} />
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
