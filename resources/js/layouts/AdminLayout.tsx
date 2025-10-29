import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Shield,
  BookOpen,
  ChevronRight,
  Menu,
  LogOut,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast'; //nuevo 

// ✅ Tipado para evitar errores de props
interface AuthProps {
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
}

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  

  const { url, props } = usePage();
  const { post } = useForm({});
  const [openSidebar, setOpenSidebar] = useState(true);
  const [openUserMenu, setOpenUserMenu] = useState(true);

  // ✅ sin Ziggy: usamos ruta directa
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    post('/logout');
  };
 
  const user = props.auth?.user;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside
        className={`${
          openSidebar ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-lg transition-all duration-300`}
      >
        <div className="p-4 border-b border-blue-700 flex items-center justify-between">
          {openSidebar && (
            <h2 className="text-xl font-bold tracking-wide">Control Docente</h2>
          )}
          <button
            onClick={() => setOpenSidebar(!openSidebar)}
            className="p-2 hover:bg-blue-800 rounded-md transition"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 transition-all rounded-r-full ${
              url.startsWith('/admin/dashboard')
                ? 'bg-blue-700 text-white shadow-inner'
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            {openSidebar && <span>Dashboard</span>}
          </Link>

          <button
            onClick={() => setOpenUserMenu(!openUserMenu)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-r-full transition-all ${
              openUserMenu
                ? 'bg-blue-700 text-white shadow-inner'
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={18} />
              {openSidebar && <span>Gestionar Usuarios</span>}
            </div>
            {openSidebar && (
              <ChevronRight
                size={16}
                className={`transform transition-transform ${
                  openUserMenu ? 'rotate-90' : ''
                }`}
              />
            )}
          </button>

          {openUserMenu && (
            <div
              className={`${
                openSidebar ? 'ml-6 pl-3' : 'ml-3'
              } mt-1 border-l border-blue-700 space-y-1`}
            >
              <Link
                href="/admin/usuarios"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  url.startsWith('/admin/usuarios')
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <UserCog size={16} />
                {openSidebar && <span>Usuarios</span>}
              </Link>
              <Link
                href="/admin/docentes"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  url.startsWith('/admin/docentes')
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <BookOpen size={16} />
                {openSidebar && <span>Docentes</span>}
              </Link>
              <Link
                href="/admin/roles"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  url.startsWith('/admin/roles')
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <Shield size={16} />
                {openSidebar && <span>Roles</span>}
              </Link>
              <Link
                href="/admin/permisos"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  url.startsWith('/admin/permisos')
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <FileText size={16} />
                {openSidebar && <span>Permisos</span>}
              </Link>
              <Link
                href="/admin/bitacora"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                  url.startsWith('/admin/bitacora')
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <FileText size={16} />
                {openSidebar && <span>Bitácora</span>}
              </Link>
            </div>
          )}
        </nav>

        <div className="border-t border-blue-700 p-4 flex items-center justify-between">
          {openSidebar && user && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {user.name}
              </span>
              <span className="text-xs text-blue-300">{user.email}</span>
            </div>
          )}
          <form onSubmit={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-blue-800 hover:bg-blue-700 transition text-white"
            >
              <LogOut size={16} />
              {openSidebar && <span>Salir</span>}
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto transition-all">
        {children}
      </main>
      {/* ✅ Notificaciones flotantes */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}