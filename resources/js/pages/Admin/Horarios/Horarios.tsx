import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  PlusCircle,
  ChevronDown,
  ChevronUp,
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
  flash?: { success?: string; error?: string };
}

export default function Horarios({ horarios }: Props) {
  const { flash } = usePage().props as any;
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { data, setData, post, delete: destroy, reset, processing } = useForm({
    dia: "",
    hora_inicio: "",
    hora_fin: "",
  });

  // ✅ Mostrar mensajes flash enviados desde el backend
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  // Filtrar horarios
  const filtered = horarios.filter((h) =>
    h.dia.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Crear nuevo horario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.dia || !data.hora_inicio || !data.hora_fin) {
      toast.error("⚠️ Todos los campos son obligatorios");
      return;
    }

    if (data.hora_inicio >= data.hora_fin) {
      toast.error("⚠️ La hora de fin debe ser posterior a la de inicio");
      return;
    }

    post("/admin/horarios", {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  // 🗑️ Eliminar horario (confirmación en el front)
  const handleDelete = (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-800">
            ¿Seguro que deseas eliminar este horario?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                destroy(`/admin/horarios/${id}`, {
                  preserveScroll: true,
                  onSuccess: () => toast.dismiss(t.id),
                });
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: { background: "#fff", padding: "16px" },
      }
    );
  };

  return (
    <AdminLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🔹 Encabezado principal */}
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
                      Nuevo Horario
                    </h2>
                    <p className="text-sm text-emerald-100">
                      Crea un nuevo bloque de horario disponible
                    </p>
                  </div>
                </div>
              </div>

              {/* Campos */}
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
                      "Domingo",
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
                    disabled={processing}
                    className="bg-emerald-700 text-white px-5 py-2 rounded-md hover:bg-emerald-800 transition shadow-md"
                  >
                    {processing ? "Guardando..." : "Agregar Horario"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setShowForm(false);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
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
                <Calendar size={22} />
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
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
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
