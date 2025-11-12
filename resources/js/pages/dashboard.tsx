import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      {/* Fondo degradado suave adaptable a modo oscuro */}
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] overflow-hidden px-6 py-12 transition-all duration-500 bg-gradient-to-br from-orange-100 via-orange-200 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-black">
        {/* Efecto animado de fondo con patrón sutil */}
        <div className="absolute inset-0 opacity-10">
          <PlaceholderPattern className="stroke-orange-400 dark:stroke-orange-300" />
        </div>

        {/* Logo animado */}
        <motion.img
          src="/images/ficct_logo.png"
          alt="FICCT Logo"
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-40 md:w-56 mb-6 drop-shadow-lg select-none"
        />

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-400 bg-clip-text text-transparent drop-shadow-sm"
        >
          Bienvenido al Sistema de Control Docente
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-4 max-w-2xl text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
        >
          Gestiona tus materias, horarios y asistencias de forma eficiente.
          <br />
          Una plataforma moderna para docentes y administradores.
        </motion.p>

        {/* Tarjetas decorativas animadas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="relative overflow-hidden rounded-xl border border-orange-300 dark:border-orange-800 bg-white/70 dark:bg-neutral-900/70 shadow-md backdrop-blur-md transition-all duration-300"
            >
              <PlaceholderPattern className="absolute inset-0 stroke-orange-300/30 dark:stroke-orange-600/20" />
              <div className="relative z-10 p-6 text-center">
                <h3 className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-2">
                  {i === 1
                    ? '📅 Horarios'
                    : i === 2
                    ? '📘 Materias'
                    : '🕒 Asistencias'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualiza y gestiona toda tu información docente con facilidad.
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
}
