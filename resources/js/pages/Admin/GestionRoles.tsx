import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Shield, Plus, Edit3, Trash2, CheckSquare, X ,ChevronRight,ChevronDown } from 'lucide-react';

interface Permission {
  id: number;
  nombre: string;
  descripcion: string;
  modulo?: string; // ✅ nuevo campo
}

interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permissions: Permission[];
}

//  Subcomponente para manejar cada grupo de permisos plegable
const PermissionGroup = ({
  modulo,
  perms,
  data,
  setData,
  togglePermission,
}: {
  modulo: string;
  perms: Permission[];
  data: { permissions: number[] };
  setData: (field: string, value: any) => void;
  togglePermission: (id: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const allSelected = perms.every((p) => data.permissions.includes(p.id));
  const partiallySelected =
    perms.some((p) => data.permissions.includes(p.id)) && !allSelected;

  return (
    <div className="border rounded-lg p-3 mb-3 shadow-sm bg-gray-50">
      {/* Encabezado del módulo */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <label className="flex items-center gap-2 font-semibold text-orange-600">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = partiallySelected;
            }}
            onChange={(e) => {
              const newPermissions = e.target.checked
                ? [...new Set([...data.permissions, ...perms.map((p) => p.id)])]
                : data.permissions.filter((id) => !perms.some((p) => p.id === id));
              setData('permissions', newPermissions);
            }}
          />
          {modulo}
        </label>
        {isOpen ? (
  <ChevronDown size={18} className="text-gray-500 transition-transform" />
) : (
  <ChevronRight size={18} className="text-gray-500 transition-transform" />
)}

      </div>

      {/* Permisos hijos colapsables */}
      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-3 ml-5">
          {perms.map((perm) => (
            <label
              key={perm.id}
              className={`flex items-center gap-2 text-sm text-gray-700 cursor-pointer ${
                allSelected ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={data.permissions.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
                disabled={allSelected}
              />
              {perm.descripcion || perm.nombre}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function GestionRoles() {
  const { props } = usePage<{ roles: Role[]; permissions: Permission[] }>();
  const roles = props.roles || [];
  const permissions = props.permissions || [];

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
    nombre: '',
    descripcion: '',
    permissions: [] as number[],
  });

  // Abrir modal en modo creación
  const openCreateModal = () => {
    reset();
    setEditMode(false);
    setEditingRole(null);
    setShowModal(true);
  };

  // Abrir modal en modo edición
  const openEditModal = (role: Role) => {
    setEditMode(true);
    setEditingRole(role);
    setData({
      nombre: role.nombre,
      descripcion: role.descripcion,
      permissions: role.permissions.map((p) => p.id),
    });
    setShowModal(true);
  };

  // Guardar cambios (crear o editar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && editingRole) {
      put(`/admin/roles/${editingRole.id}`, {
        onSuccess: () => {
          setShowModal(false);
          reset();
        },
      });
    } else {
      post('/admin/roles', {
        onSuccess: () => {
          setShowModal(false);
          reset();
        },
      });
    }
  };

  // Eliminar rol
  const handleDelete = (role: Role) => {
    if (confirm(`¿Seguro que deseas eliminar el rol "${role.nombre}"?`)) {
      destroy(`/admin/roles/${role.id}`);
    }
  };

  // Alternar permiso individual
  const togglePermission = (id: number) => {
    setData(
      'permissions',
      data.permissions.includes(id)
        ? data.permissions.filter((p) => p !== id)
        : [...data.permissions, id]
    );
  };

  return (
    <AdminLayout>
      <Head title="Gestión de Roles" />

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Roles</h1>
          <p className="text-gray-500 mt-1">Administra los roles y sus permisos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md transition"
        >
          <Plus size={18} />
          Nuevo Rol
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
              <th className="px-4 py-3 text-center font-semibold">Permisos</th>
              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.length > 0 ? (
              roles.map((r, i) => (
                <tr key={r.id} className="hover:bg-orange-50 transition duration-150 ease-in-out">
                  <td className="px-4 py-3 text-gray-700">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{r.nombre}</td>
                  <td className="px-4 py-3 text-gray-700">{r.descripcion || '-'}</td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {r.permissions.length}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Editar"
                        onClick={() => openEditModal(r)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => handleDelete(r)}
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
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 italic">
                  No hay roles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 border border-orange-200 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-orange-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-orange-600 border-b pb-2 flex items-center gap-2">
              <Shield className="text-orange-500" size={22} />
              {editMode ? 'Editar Rol' : 'Nuevo Rol'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  placeholder="Ej: Docente"
                  className="text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  placeholder="Ej: Acceso a gestión de docentes"
                  className="text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Permisos agrupados */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckSquare size={16} /> Permisos disponibles
                </h3>

                {/* 🧱 Contenedor con scroll si hay muchos módulos */}
                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(
                    permissions.reduce((acc, permiso) => {
                      const grupo = permiso.modulo || 'General';
                      if (!acc[grupo]) acc[grupo] = [];
                      acc[grupo].push(permiso);
                      return acc;
                    }, {} as Record<string, Permission[]>)
                  ).map(([modulo, perms]) => (
                    <PermissionGroup
                      key={modulo}
                      modulo={modulo}
                      perms={perms}
                      data={data}
                      setData={setData}
                      togglePermission={togglePermission}
                    />
                  ))}
                </div>
              </div>


              {/* Botones */}
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
