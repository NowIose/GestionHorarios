import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Clock,
  Building2,
  Users,
} from "lucide-react";

interface Horario {
  id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

interface Aula {
  id: number;
  nro: string;
  tipo: string;
}

interface GrupoMateria {
  id: number;
  materia: { sigla: string; nombre: string };
  grupo: { codigo: string };
  docente?: { user?: { name: string } };
}

interface Asignacion {
  id: number;
  horario: Horario;
  aula: Aula;
  grupo_materia: GrupoMateria;
  estado: string;
}

interface Props {
  asignaciones: Asignacion[];
  horarios: Horario[];
  aulas: Aula[];
  grupoMaterias: GrupoMateria[];
}

export default function HorarioMateria({
  asignaciones,
  horarios,
  aulas,
  grupoMaterias,
}: Props) {
  const [editing, setEditing] = useState<Asignacion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    horario_id: "",
    aula_id: "",
    grupo_materia_id: "",
    estado: "activo",
  });

  const filtered = asignaciones.filter((a) => {
    const texto = search.toLowerCase();
    return (
      a.horario.dia.toLowerCase().includes(texto) ||
      a.aula.nro.toLowerCase().includes(texto) ||
      a.grupo_materia.materia.nombre.toLowerCase().includes(texto)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación en frontend para duplicados
    const existe = asignaciones.some(
      (a) =>
        a.horario.id === Number(data.horario_id) &&
        (a.aula.id === Number(data.aula_id) ||
          a.grupo_materia.id === Number(data.grupo_materia_id)) &&
        (!editing || a.id !== editing.id)
    );

    if (existe) {
      toast.error("⚠️ Ya existe una asignación con ese horario o grupo/aula.");
      return;
    }

    if (editing) {
      put(`/admin/horarios/asignaciones/${editing.id}`, {
        onSuccess: () => {
          toast.success("✏️ Asignación actualizada correctamente");
          reset();
          setEditing(null);
          setShowForm(false);
        },
      });
    } else {
      post("/admin/horarios/asignaciones", {
        onSuccess: () => {
          toast.success("✅ Asignación creada correctamente");
          reset();
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (asig: Asignacion) => {
    setEditing(asig);
    setData({
      horario_id: asig.horario.id.toString(),
      aula_id: asig.aula.id.toString(),
      grupo_materia_id: asig.grupo_materia.id.toString(),
      estado: asig.estado,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta asignación?")) {
      destroy(`/admin/horarios/asignaciones/${id}`, {
        onSuccess: () => toast.success("🗑️ Asignación eliminada correctamente"),
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
        {/* 🔹 Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Layers size={28} /> Asignación de Horarios a Grupos
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
                <ChevronDown size={18} /> Nueva Asignación
              </>
            )}
          </button>
        </div>

        {/* 🧾 Formulario */}
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
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <PlusCircle size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-wide">
                      {editing ? "Editar Asignación" : "Nueva Asignación"}
                    </h2>
                    <p className="text-sm text-emerald-100">
                      Selecciona el horario, aula y grupo-materia correspondiente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Horario *
                  </label>
                  <select
                    value={data.horario_id}
                    onChange={(e) => setData("horario_id", e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {horarios.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.dia} — {h.hora_inicio} a {h.hora_fin}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Aula *
                  </label>
                  <select
                    value={data.aula_id}
                    onChange={(e) => setData("aula_id", e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {aulas.map((a) => (
                      <option key={a.id} value={a.id}>
                        Aula {a.nro} ({a.tipo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Grupo - Materia *
                  </label>
                  <select
                    value={data.grupo_materia_id}
                    onChange={(e) => setData("grupo_materia_id", e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {grupoMaterias.map((gm) => (
                      <option key={gm.id} value={gm.id}>
                        {gm.materia.sigla} - {gm.materia.nombre} / G{gm.grupo.codigo}{" "}
                        ({gm.docente?.user?.name ?? "Sin docente"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Estado
                  </label>
                  <select
                    value={data.estado}
                    onChange={(e) => setData("estado", e.target.value)}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="col-span-4 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-700 text-white px-5 py-2 rounded-md hover:bg-emerald-800 transition shadow-md"
                  >
                    {editing ? "Actualizar Asignación" : "Agregar Asignación"}
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
            placeholder="🔍 Buscar por materia, aula o día..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-80 rounded-md focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* 📋 Tabla de Asignaciones */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-xl shadow-md border border-emerald-200"
        >
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-600 text-white p-4 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <Clock size={22} className="text-white" />
              <div>
                <h2 className="text-lg font-semibold tracking-wide">
                  📚 Listado de Asignaciones
                </h2>
                <p className="text-xs text-emerald-100">
                  Horarios asignados a grupos, materias y aulas
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
      <th className="p-3 text-left font-semibold">Horario</th>
      <th className="p-3 text-left font-semibold">Aula</th>
      <th className="p-3 text-left font-semibold">Grupo</th>
      <th className="p-3 text-left font-semibold">Materia</th>
      <th className="p-3 text-left font-semibold">Docente</th>
      <th className="p-3 text-center font-semibold">Estado</th>
      <th className="p-3 text-center font-semibold">Acciones</th>
    </tr>
  </thead>

  <tbody>
    {filtered.length > 0 ? (
      filtered.map((a, i) => (
        <motion.tr
          key={a.id}
          className={`border-b ${
            i % 2 === 0 ? "bg-white" : "bg-emerald-50"
          } hover:bg-emerald-100 transition-all duration-200`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <td className="p-3 font-medium text-gray-800">
            {a.horario.dia} ({a.horario.hora_inicio} - {a.horario.hora_fin})
          </td>
          <td className="p-3 text-gray-800">{a.aula.nro}</td>
          <td className="p-3 text-gray-800">G{a.grupo_materia.grupo.codigo}</td>
          <td className="p-3 text-gray-800">
            {a.grupo_materia.materia.nombre}
          </td>
          <td className="p-3 text-gray-800">
            {a.grupo_materia.docente?.user?.name ?? "—"}
          </td>
          <td className="p-3 text-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                a.estado === "activo"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {a.estado === "activo" ? "Activo" : "Inactivo"}
            </span>
          </td>
          <td className="p-3 text-center">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleEdit(a)}
                className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition shadow-sm"
              >
                <Edit size={14} /> Editar
              </button>
              <button
                onClick={() => handleDelete(a.id)}
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
          colSpan={7}
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
