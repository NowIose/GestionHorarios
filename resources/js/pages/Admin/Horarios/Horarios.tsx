import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
} from "lucide-react";

interface Horario {
  id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

interface Props {
  horarios: Horario[];
}

export default function Horarios({ horarios }: Props) {
  const [editing, setEditing] = useState<Horario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
    dia: "",
    hora_inicio: "",
    hora_fin: "",
  });

  const filtered = horarios.filter((h) =>
    h.dia.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Manejo del envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🚫 Validaciones básicas
    if (!data.dia || !data.hora_inicio || !data.hora_fin) {
      toast.error("⚠️ Todos los campos son obligatorios");
      return;
    }

    if (data.hora_inicio >= data.hora_fin) {
      toast.error("⚠️ La hora de fin debe ser posterior a la de inicio");
      return;
    }

    // 🚫 Validar duplicados en frontend
    const existeDuplicado = horarios.some(
      (h) =>
        h.dia === data.dia &&
        h.hora_inicio === data.hora_inicio &&
        h.hora_fin === data.hora_fin &&
        (!editing || h.id !== editing.id)
    );

    if (existeDuplicado) {
      toast.error("⚠️ Ya existe un horario con el mismo día y rango de horas.");
      return;
    }

    // ✏️ Si estamos editando
    if (editing) {
      put(`/admin/horarios/${editing.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("✏️ Horario actualizado correctamente");
          reset();
          setEditing(null);
          setShowForm(false);
        },
        onError: () => toast.error("⚠️ Error al actualizar el horario"),
      });
    } else {
      // 🆕 Si estamos creando uno nuevo
      post("/admin/horarios", {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("✅ Horario creado correctamente");
          reset();
          setShowForm(false);
        },
        onError: (err) => {
          console.error("❌ Error al crear horario:", err);
          toast.error("⚠️ Error al crear el horario");
        },
      });
    }
  };

  // ✏️ Editar horario existente
  const handleEdit = (horario: Horario) => {
    setEditing(horario);
    setData({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
    });
    setShowForm(true);
  };

  // 🗑️ Eliminar horario
  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este horario?")) {
      destroy(`/admin/horarios/${id}`, {
        preserveScroll: true,
        onSuccess: () => toast.success("🗑️ Horario eliminado correctamente"),
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
            <Clock size={28} /> Gestión de Horarios
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
                <ChevronDown size={18} /> Agregar Horario
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
                      {editing ? "Editar Horario" : "Nuevo Horario"}
                    </h2>
                    <p className="text-sm text-emerald-100">
                      {editing
                        ? "Modifica el horario seleccionado"
                        : "Crea un nuevo bloque de horario disponible"}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-md text-sm">
                  {editing ? "✏️ Edición" : "➕ Creación"}
                </span>
              </div>

              {/* Contenido del formulario */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Día *
                  </label>
                  <select
                    name="dia"
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    value={data.dia}
                    onChange={(e) => setData("dia", e.target.value)}
                    required
                  >
                    <option value="">Seleccionar día</option>
                    {[
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Hora Inicio *
                  </label>
                  <input
                    type="time"
                    name="hora_inicio"
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    value={data.hora_inicio}
                    onChange={(e) => setData("hora_inicio", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Hora Fin *
                  </label>
                  <input
                    type="time"
                    name="hora_fin"
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    value={data.hora_fin}
                    onChange={(e) => setData("hora_fin", e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-3 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-700 text-white px-5 py-2 rounded-md hover:bg-emerald-800 transition shadow-md"
                  >
                    {editing ? "Actualizar Horario" : "Agregar Horario"}
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
            placeholder="🔍 Buscar por día..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-72 rounded-md focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* 📋 Tabla */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-xl shadow-md border border-emerald-200"
        >
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-600 text-white p-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-md">
                <Calendar size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-wide">
                  🕒 Listado de Horarios
                </h2>
                <p className="text-xs text-emerald-100">
                  Gestión general de bloques horarios
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
                <th className="p-3 text-left font-semibold">DÍA</th>
                <th className="p-3 text-left font-semibold">HORA INICIO</th>
                <th className="p-3 text-left font-semibold">HORA FIN</th>
                <th className="p-3 text-center font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((h, i) => (
                  <motion.tr
                    key={h.id}
                    className={`border-b ${
                      i % 2 === 0 ? "bg-emerald-50/30" : "bg-white"
                    } hover:bg-emerald-100/40 transition-all duration-200`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td className="p-3 font-medium text-gray-800">{h.dia}</td>
                    <td className="p-3 text-gray-700">{h.hora_inicio}</td>
                    <td className="p-3 text-gray-700">{h.hora_fin}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(h)}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition shadow-sm"
                        >
                          <Edit size={14} /> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
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
                    colSpan={4}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No hay horarios registrados.
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
