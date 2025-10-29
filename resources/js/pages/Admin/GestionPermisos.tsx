import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Key, Plus, Edit3, Trash2, X } from 'lucide-react';

interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function GestionPermisos() {
  const { props } = usePage<{ permisos: Permiso[] }>();
  const permisos = props.permisos || [];

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingPermiso, setEditingPermiso] = useState<Permiso | null>(null);

  const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
    nombre: '',
    descripcion: '',
  });

  const openCreateModal = () => {
    reset();
    setEditMode(false);
    setEditingPermiso(null);
    setShowModal(true);
  };

  const openEditModal = (permiso: Permiso) => {
    setEditMode(true);
    setEditingPermiso(permiso);
    setData({
      nombre: permiso.nombre,
      descripcion: permiso.descripcion,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && editingPermiso) {
      put(`/admin/permisos/${editingPermiso.id}`, {
        onSuccess: () => {
          setShowModal(false);
          reset();
        },
      });
    } else {
      post('/admin/permisos', {
        onSuccess: () => {
          setShowModal(false);
          reset();
        },
      });
    }
  };

  const handleDelete = (permiso: Permiso) => {
    if (confirm(`¿Seguro que deseas eliminar el permiso "${permiso.nombre}"?`)) {
      destroy(`/admin/permisos/${permiso.id}`);
    }
  };

  return (
    <AdminLayout>
      <Head title="Gestión de Permisos" />

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Permisos</h1>
          <p className="text-gray-500 mt-1">Administra los permisos del sistema</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md transition"
        >
          <Plus size={18} />
          Nuevo Permiso
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-orange-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Descripción</th>
              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {permisos.length > 0 ? (
              permisos.map((p, i) => (
                <tr key={p.id} className="hover:bg-orange-50 transition duration-150 ease-in-out">
                  <td className="px-4 py-3 text-gray-700">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3 text-gray-700">{p.descripcion || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Editar"
                        onClick={() => openEditModal(p)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => handleDelete(p)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500 italic">
                  No hay permisos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 border border-orange-200 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-orange-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-orange-600 border-b pb-2 flex items-center gap-2">
              <Key className="text-orange-500" size={22} />
              {editMode ? 'Editar Permiso' : 'Nuevo Permiso'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  placeholder="Ej: ver_usuarios"
                  className="text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  placeholder="Ej: Permite ver la lista de usuarios"
                  className="text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm transition"
                >
                  {processing ? 'Guardando...' : editMode ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
