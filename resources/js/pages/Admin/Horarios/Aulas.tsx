import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit,
  Layers,
} from "lucide-react";

interface Aula {
  id: number;
  nro: string;
  tipo: string | null;
}

interface Props {
  aulas: Aula[];
}

export default function Aulas({ aulas }: Props) {
  const [editing, setEditing] = useState<Aula | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    nro: "",
    tipo: "",
  });

  const filtered = aulas.filter(
    (a) =>
      a.nro.toLowerCase().includes(search.toLowerCase()) ||
      (a.tipo || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      put(`/admin/horarios/aulas/${editing.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("✏️ Aula actualizada correctamente");
          reset();
          setEditing(null);
          setShowForm(false);
        },
        onError: (err) => {
          toast.error("⚠️ Error al actualizar el aula");
          console.error(err);
        },
      });
    } else {
      post("/admin/horarios/aulas", {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("🏫 Aula creada correctamente");
          reset();
          setShowForm(false);
        },
        onError: (err) => {
          toast.error("⚠️ Error al crear el aula");
          console.error(err);
        },
      });
    }
  };

  const handleEdit = (aula: Aula) => {
    setEditing(aula);
    setData({
      nro: aula.nro,
      tipo: aula.tipo || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta aula?")) {
      destroy(`/admin/horarios/aulas/${id}`, {
        preserveScroll: true,
        onSuccess: () => toast.success("🗑️ Aula eliminada correctamente"),
        onError: () => toast.error("⚠️ Error al eliminar el aula"),
      });
    }
  };

  return (
    <AdminLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🔹 Header principal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Building2 size={28} /> Gestión de Aulas
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
          >
            {showForm ? (
              <>
                <ChevronUp size={18} /> Cerrar Formulario
              </>
            ) : (
              <>
                <ChevronDown size={18} /> Agregar Aula
              </>
            )}
          </button>
        </div>

        {/* 🔸 Formulario */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-emerald-200 overflow-hidden"
            >
              {/* Cabecera del formulario */}
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <PlusCircle size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-wide">
                      {editing ? "Editar Aula" : "Nueva Aula"}
                    </h2>
                    <p className="text-sm text-emerald-100">
                      {editing
                        ? "Modifica los datos del aula seleccionada"
                        : "Registra una nueva aula en el sistema"}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-md text-sm">
                  {editing ? "✏️ Edición" : "➕ Creación"}
                </span>
              </div>

              {/* Contenido */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Número de Aula *
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    value={data.nro}
                    onChange={(e) => setData("nro", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Tipo de Aula *
                  </label>
                  <select
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    value={data.tipo}
                    onChange={(e) => setData("tipo", e.target.value)}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Teórica">Teórica</option>
                    <option value="Laboratorio">Laboratorio</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>
                <div className="col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-700 text-white px-5 py-2 rounded-md hover:bg-emerald-800 transition shadow-md"
                  >
                    {editing ? "Actualizar Aula" : "Agregar Aula"}
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

        {/* 🔍 Buscador */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="🔍 Buscar aula o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-72 rounded-md focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* 📋 Tabla de Aulas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-xl shadow-md border border-emerald-200"
        >
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-600 text-white p-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-md">
                <Layers size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-wide">
                  🏫 Listado de Aulas
                </h2>
                <p className="text-xs text-emerald-100">
                  Gestión general de las aulas registradas
                </p>
              </div>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-md text-sm shadow">
              Total: {filtered.length}
            </span>
          </div>

          <table className="w-full bg-white">
            <thead className="bg-emerald-100 text-emerald-900 text-sm uppercase">
              <tr>
                <th className="p-3 text-left font-semibold">N° AULA</th>
                <th className="p-3 text-left font-semibold">TIPO</th>
                <th className="p-3 text-center font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((aula, i) => (
                  <motion.tr
                    key={aula.id}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-emerald-50/30" : "bg-white"
                    } hover:bg-emerald-100/40 transition-all duration-200`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td className="p-3 font-medium text-gray-800">{aula.nro}</td>
                    <td className="p-3 text-gray-700">{aula.tipo || "—"}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(aula)}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition shadow-sm"
                        >
                          <Edit size={14} /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(aula.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No se encontraron aulas registradas.
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
