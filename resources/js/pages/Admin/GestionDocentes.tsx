import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Eye,
  Edit3,
  UserCog,
  BookOpen,
  CalendarDays,
  DollarSign,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';// nuevo para el toast en lugar de alerta
interface Docente {
  id: number;
  especialidad?: string;
  sueldo?: string;
  fecha_contrato?: string;
  estado: boolean;
  user?: {
    id: number;
    registro: number;
    name: string;
    email: string;
  };
  grupo_materias?: {
    id: number;
    materia?: { nombre: string };
    grupo?: { codigo: string };
  }[];
}

export default function GestionDocentes() {
  const { props } = usePage<{ docentes: Docente[] }>();
  const docentes = props.docentes || [];

  // Formulario controlado
  const { data, setData, put, processing, reset } = useForm({
    especialidad: '',
    sueldo: '',
    fecha_contrato: '',
    estado: true,
  });

  // Estados de control
  const [selected, setSelected] = useState<Docente | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingDocente, setEditingDocente] = useState<Docente | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Cambiar estado sin borrar otros campos
  const handleToggleEstado = (docente: Docente) => {
    if (!confirm(`¿Estás seguro de cambiar el estado de ${docente.user?.name}?`)) return;

    // 🔸 Usamos router.put() en lugar de put() de useForm()
    router.put(
      `/admin/docentes/${docente.id}`,
      { estado: !docente.estado },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Estado actualizado correctamente.');
        },
      }
    );
  };

  // ✅ Abrir modal de edición
  const openEditModal = (docente: Docente) => {
    setEditMode(true);
    setEditingDocente(docente);
    setData({
      especialidad: docente.especialidad || '',
      sueldo: docente.sueldo || '',
      fecha_contrato: docente.fecha_contrato || '',
      estado: docente.estado,
    });
    setShowModal(true);
  };

  // ✅ Guardar cambios del docente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocente) return;

    put(`/admin/docentes/${editingDocente.id}`, {
      onSuccess: () => {
        setShowModal(false);
        setEditMode(false);
        setEditingDocente(null);
        reset();
        toast.success('Datos del docente actualizados correctamente.');
      },
    });
  };

  return (
    <AdminLayout>
      <Head title="Gestión de Docentes" />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Docentes</h1>
          <p className="text-gray-500 mt-1">
            Visualiza y administra los docentes registrados
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-orange-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Registro</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Correo</th>
              <th className="px-4 py-3 text-left font-semibold">Especialidad</th>
              <th className="px-4 py-3 text-left font-semibold">Materias</th>
              <th className="px-4 py-3 text-center font-semibold">Estado</th>
              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {docentes.length > 0 ? (
              docentes.map((d, i) => (
                <tr
                  key={d.id}
                  className="hover:bg-orange-50 transition duration-150 ease-in-out"
                >
                  <td className="px-4 py-3 text-gray-700">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {d.user?.registro ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {d.user?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{d.user?.email}</td>
                  <td className="px-4 py-3 text-gray-700">{d.especialidad ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {d.grupo_materias?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleEstado(d)}
                      className={`p-2 rounded-full transition ${
                        d.estado
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={d.estado ? 'Activo' : 'Inactivo'}
                    >
                      {d.estado ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Ver detalles"
                        onClick={() => setSelected(d)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Editar datos"
                        onClick={() => openEditModal(d)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No hay docentes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 👁️ Modal Detalles */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-orange-600"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold text-orange-600 border-b pb-2 mb-4">
              {selected.user?.name}
            </h2>

            <p className="text-gray-600 mb-2">
              <b>Correo:</b> {selected.user?.email}
            </p>
            <p className="text-gray-600 mb-2">
              <b>Especialidad:</b> {selected.especialidad ?? 'N/A'}
            </p>
            <p className="text-gray-600 mb-4">
              <b>Sueldo:</b> {selected.sueldo ?? 'No asignado'}
            </p>

            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <BookOpen size={16} /> Materias Asignadas
            </h3>
            <ul className="list-disc pl-6 text-gray-700 text-sm">
              {selected.grupo_materias && selected.grupo_materias.length > 0 ? (
                selected.grupo_materias.map((gm) => (
                  <li key={gm.id}>
                    {gm.materia?.nombre} ({gm.grupo?.codigo})
                  </li>
                ))
              ) : (
                <li className="italic text-gray-500">
                  Sin materias asignadas
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ✏️ Modal Edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 border border-orange-200 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
            <button
              onClick={() => {
                setShowModal(false);
                setEditMode(false);
                setEditingDocente(null);
                reset();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-orange-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-orange-600 border-b pb-2 flex items-center gap-2">
              <UserCog className="text-orange-500" size={22} />
              Editar Datos del Docente
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <div className="relative">
                  <Briefcase
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={data.especialidad}
                    onChange={(e) => setData('especialidad', e.target.value)}
                    placeholder="Ej. Matemáticas, Informática..."
                    className="pl-10 text-gray-800 placeholder-gray-400 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Sueldo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sueldo (Bs)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    value={data.sueldo}
                    onChange={(e) => setData('sueldo', e.target.value)}
                    placeholder="Ej. 4500"
                    className="pl-10 text-gray-800 placeholder-gray-400 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Fecha de Contrato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Contrato
                </label>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="date"
                    value={data.fecha_contrato}
                    onChange={(e) => setData('fecha_contrato', e.target.value)}
                    className="pl-10 text-gray-800 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setEditingDocente(null);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm transition"
                >
                  {processing ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
