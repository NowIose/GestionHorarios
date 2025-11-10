import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";

interface Grupo {
  id: number;
  codigo: string;
  cupos: number | null;
  modalidad: string | null;
}

interface Props {
  grupos: Grupo[];
}

export default function Grupos({ grupos }: Props) {
  const [editing, setEditing] = useState<Grupo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    codigo: "",
    cupos: "",
    modalidad: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      put(`/admin/grupos/${editing.id}`, {
        onSuccess: () => {
          toast.success("✏️ Grupo actualizado correctamente");
          reset();
          setEditing(null);
          setShowForm(false);
        },
      });
    } else {
      post("/admin/grupos", {
        onSuccess: () => {
          toast.success("✅ Grupo creado correctamente");
          reset();
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (grupo: Grupo) => {
    setEditing(grupo);
    setData({
      codigo: grupo.codigo,
      cupos: grupo.cupos?.toString() ?? "",
      modalidad: grupo.modalidad ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este grupo?")) {
      destroy(`/admin/grupos/${id}`, {
        onSuccess: () => toast.success("🗑️ Grupo eliminado correctamente"),
      });
    }
  };

  const filtered = grupos.filter((g) =>
    g.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl font-bold text-purple-900 flex items-center gap-2">
            <Users size={28} /> Gestión de Grupos
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
                <ChevronDown size={18} /> Agregar Grupo
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
              <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Users size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-wide">
                      {editing ? "Editar Grupo" : "Nuevo Grupo"}
                    </h2>
                    <p className="text-sm text-purple-100">
                      {editing
                        ? "Modifica los datos del grupo seleccionado"
                        : "Agrega un nuevo grupo académico"}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-md text-sm">
                  {editing ? "✏️ Edición" : "➕ Creación"}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Código *
                    </label>
                    <input
                      type="text"
                      placeholder="G-01"
                      className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                      value={data.codigo}
                      onChange={(e) => setData("codigo", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Cupos
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                      value={data.cupos}
                      onChange={(e) => setData("cupos", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Modalidad *
                    </label>
                    <select
                      className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                      value={data.modalidad}
                      onChange={(e) => setData("modalidad", e.target.value)}
                      required
                    >
                      <option value="">Seleccione una modalidad</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual">Virtual</option>
                    </select>
                  </div>

                </div>

                {/* Botones */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-purple-700 text-white px-5 py-2 rounded-md hover:bg-purple-800 transition shadow-md"
                  >
                    {editing ? "Actualizar Grupo" : "Agregar Grupo"}
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
            placeholder="🔍 Buscar por código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-72 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tabla */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-xl shadow-md border border-purple-200"
        >
          <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white p-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-lg font-semibold tracking-wide">📋 Listado de Grupos</h2>
            <span className="bg-white/20 px-3 py-1 rounded-md text-sm shadow">
              Total: {filtered.length}
            </span>
          </div>

          <table className="w-full bg-white">
            <thead className="bg-purple-100 text-purple-900 text-sm uppercase">
              <tr>
                <th className="p-3 text-left font-semibold">Código</th>
                <th className="p-3 text-center font-semibold">Cupos</th>
                <th className="p-3 text-center font-semibold">Modalidad</th>
                <th className="p-3 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((g, i) => (
                  <motion.tr
                    key={g.id}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-purple-50/30" : "bg-white"
                    } hover:bg-purple-100/40 transition-all duration-200`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td className="p-3 font-medium text-gray-800">{g.codigo}</td>
                    <td className="p-3 text-center text-gray-700">{g.cupos ?? "—"}</td>
                    <td className="p-3 text-center text-gray-700">{g.modalidad ?? "—"}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(g)}
                          title="Editar grupo"
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition shadow-sm"
                        >
                          <Edit2 size={16} /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          title="Eliminar grupo"
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500 font-medium">
                    No se encontraron grupos registrados.
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
