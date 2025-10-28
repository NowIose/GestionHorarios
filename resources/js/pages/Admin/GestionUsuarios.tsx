import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { UserPlus, X, Edit3, Trash2, User, Mail, Lock, UserCog } from 'lucide-react';

interface User {
  id: number;
  registro: number;
  name: string;
  email: string;
  role_id: number;
  role?: { nombre: string };
}

interface Role {
  id: number;
  nombre: string;
}

export default function GestionUsuarios() {
  const { props } = usePage<{ users: User[]; roles: Role[]; flash?: any }>();
  const users = props.users || [];
  const roles = props.roles || [];

  const [showModal, setShowModal] = useState(false);

  //  nuevos estados para modo edición
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 🟧 nuevos estados para modo eliminación
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // 🟧 agregamos deleteRequest para manejar eliminación
  const { data, setData, post, put, delete: deleteRequest, processing, reset, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role_id: roles.length ? roles[0].id : '',
  });

  //  función unificada para crear o editar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && editingUser) {
      put(`/admin/usuarios/${editingUser.id}`, {
        onSuccess: () => {
          setShowModal(false);
          setEditMode(false);
          setEditingUser(null);
          reset();
        },
      });
    } else {
      post('/admin/usuarios', {
        onSuccess: () => {
          setShowModal(false);
          reset();
        },
      });
    }
  };

  //  al abrir modal en modo crear
  const openCreateModal = () => {
    reset();
    setEditMode(false);
    setEditingUser(null);
    setShowModal(true);
  };

  //  al abrir modal en modo editar
  const openEditModal = (user: User) => {
    setEditMode(true);
    setEditingUser(user);
    setData({
      name: user.name,
      email: user.email,
      password: '',
      role_id: user.role_id,
    });
    setShowModal(true);
  };

  // 🟧 función para eliminar usuario
  const handleDelete = () => {
    if (userToDelete) {
      deleteRequest(`/admin/usuarios/${userToDelete.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setShowConfirm(false);
          setUserToDelete(null);
        },
      });
    }
  };

  return (
    <AdminLayout>
      <Head title="Gestión de Usuarios" />

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra las cuentas registradas en el sistema</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md transition"
        >
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* 🟧 Mensaje flash al eliminar o crear */}
      {props.flash?.success && (
        <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-md border border-green-300">
          {props.flash.success}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-orange-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Registro</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Correo</th>
              <th className="px-4 py-3 text-left font-semibold">Rol</th>
              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((u, i) => (
                <tr
                  key={u.id}
                  className="hover:bg-orange-50 transition duration-150 ease-in-out"
                >
                  <td className="px-4 py-3 text-gray-700">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{u.registro}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-700">{u.email}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {u.role?.nombre ?? `Rol #${u.role_id}`}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* ✅ botón editar */}
                      <button
                        title="Editar"
                        onClick={() => openEditModal(u)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* 🟧 botón eliminar */}
                      <button
                        title="Eliminar"
                        onClick={() => {
                          setUserToDelete(u);
                          setShowConfirm(true);
                        }}
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
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal elegante */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 border border-orange-200 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
            {/* Botón cerrar */}
            <button
              onClick={() => {
                setShowModal(false);
                setEditMode(false);
                setEditingUser(null);
                reset();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-orange-600 transition"
            >
              <X size={22} />
            </button>

            {/* 🔸 título dinámico */}
            <h2 className="text-2xl font-semibold mb-4 text-orange-600 border-b pb-2 flex items-center gap-2">
              <UserPlus className="text-orange-500" size={22} />
              {editMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Ingrese nombre"
                    className="pl-10 text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="pl-10 text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Contraseña (solo visible si es nuevo) */}
              {!editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="********"
                      className="pl-10 text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select
                    value={data.role_id}
                    onChange={(e) => setData('role_id', e.target.value)}
                    className="pl-10 text-gray-800 placeholder-gray-400 mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role_id && <p className="text-sm text-red-500 mt-1">{errors.role_id}</p>}
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setEditingUser(null);
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
                  {processing ? 'Guardando...' : editMode ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟧 Modal de confirmación de eliminación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 border border-orange-200 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-orange-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-orange-600 border-b pb-2 flex items-center gap-2">
              <Trash2 className="text-orange-500" size={22} />
              Confirmar Eliminación
            </h2>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <span className="font-semibold text-orange-600">
                {userToDelete?.name}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
