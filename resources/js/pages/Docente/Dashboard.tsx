import React from "react";
import AppLayout from "@/layouts/app-layout";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays, ClipboardCheck } from "lucide-react";

interface Resumen {
  nombre: string;
  total_materias: number;
  total_horarios: number;
}

interface Props {
  resumen: Resumen;
}

export default function DashboardDocente({ resumen }: Props) {
  const cards = [
    {
      title: "Mis Materias",
      description: "Consulta las materias que tienes asignadas este semestre.",
      icon: <BookOpen size={40} className="text-white" />,
      color: "from-orange-500 via-orange-600 to-orange-700",
      link: "/docente/materias",
    },
    {
      title: "Mis Horarios",
      description: "Revisa tus horarios de clases de forma organizada.",
      icon: <CalendarDays size={40} className="text-white" />,
      color: "from-amber-500 via-orange-500 to-orange-700",
      link: "/docente/horarios",
    },
    {
      title: "Asistencias",
      description: "Registra y revisa tus asistencias diarias.",
      icon: <ClipboardCheck size={40} className="text-white" />,
      color: "from-rose-500 via-orange-500 to-amber-600",
      link: "/docente/asistencias",
    },
  ];

  return (
    <AppLayout>
      <motion.div
        className="p-8 dark:text-gray-100"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-extrabold text-orange-700 dark:text-orange-400 mb-2">
          ¡Hola, {resumen.nombre}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Tienes <strong>{resumen.total_materias}</strong> materias y{" "}
          <strong>{resumen.total_horarios}</strong> horarios activos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.a
              key={i}
              href={card.link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-r ${card.color} text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between transition`}
            >
              <div className="flex justify-center mb-4">{card.icon}</div>
              <h2 className="text-2xl font-semibold text-center">
                {card.title}
              </h2>
              <p className="text-sm text-center opacity-90 mt-2">
                {card.description}
              </p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}
