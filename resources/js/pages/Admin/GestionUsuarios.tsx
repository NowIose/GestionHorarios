import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

interface Rol {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  registro: number;
  name: string;
  email: string;
  role_id: number;
  role?: Rol;
}

export default function GestionUsuarios() {
  const { users, roles } = usePage<{ users: Usuario[]; roles: Rol[] }>().props;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Head title="Gestión de Usuarios" />

      {/* 🔹 Encabezado con botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Usuarios
        </h1>

        <button
          className="px-5 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* 🔹 Tabla */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay usuarios registrados en el sistema.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-inner border border-gray-200">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="py-3 px-4 border-b text-left font-semibold">
                    Registro
                  </th>
                  <th className="py-3 px-4 border-b text-left font-semibold">
                    Nombre
                  </th>
                  <th className="py-3 px-4 border-b text-left font-semibold">
                    Email
                  </th>
                  <th className="py-3 px-4 border-b text-left font-semibold">
                    Rol
                  </th>
                  <th className="py-3 px-4 border-b text-center font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-3 px-4 border-b text-gray-700">
                      {u.registro}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-700">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-700">
                      {u.email}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-700">
                      {u.role?.nombre || 'Sin rol'}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
                          Editar
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

     {/* 🔹 Modal (crear usuario mejorado) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fadeIn relative border border-gray-200">
              {/* Botón cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Crear Nuevo Usuario
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Enviar formulario (a implementar)');
                  setShowModal(false);
                }}
                className="space-y-5"
              >
                {/* Campo Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                {/* Campo Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                    placeholder="Ej: correo@ejemplo.com"
                    required
                  />
                </div>

                {/* Campo Rol */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Rol del usuario
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                  >
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </div>
  );
}
