import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { motion } from "framer-motion";

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="min-h-screen w-full bg-white px-8 py-10">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">
                            Panel de Administración
                        </h1>
                        <p className="text-gray-600 text-lg mt-2">
                            Gestión general del sistema.
                        </p>
                    </div>

                    <motion.img
                        src="/images/logo.png"
                        alt="Logo FICCT"
                        className="w-32 h-auto drop-shadow-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    />
                </motion.div>

                <div className="w-full h-[2px] bg-blue-200 my-8 rounded-full"></div>

                {/* =============================================================== */}
                {/* 📌 SECCIÓN 1: GESTIÓN DE USUARIOS */}
                {/* =============================================================== */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-blue-700 mb-4"
                >
                    Gestión de Usuarios
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
                    {[
                        "Usuarios del Sistema",
                        "Docentes",
                        "Roles y Permisos",
                        "Bitácora del Sistema",
                    ].map((titulo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="
                                bg-gradient-to-br from-blue-700 to-blue-500
                                text-white rounded-2xl shadow-xl p-7
                                border border-blue-300
                            "
                        >
                            <h3 className="text-xl font-bold">{titulo}</h3>
                            <p className="mt-2 text-white/90">
                                Administración y control total del módulo.
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* =============================================================== */}
                {/* 📘 SECCIÓN 2: ACADÉMICO */}
                {/* =============================================================== */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-blue-700 mb-4"
                >
                    Académico
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
                    {[
                        "Materias",
                        "Grupos",
                        "Grupo-Materia (Asignaciones Académicas)",
                    ].map((titulo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="
                                bg-white rounded-2xl shadow-xl p-7
                                border border-blue-300
                            "
                        >
                            <h3 className="text-xl font-bold text-blue-700">{titulo}</h3>
                            <p className="mt-2 text-gray-600">
                                Gestión estructural del área académica.
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* =============================================================== */}
                {/* 🔷 SECCIÓN 3: HORARIOS */}
                {/* =============================================================== */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-blue-700 mb-4"
                >
                    Módulo de Horarios
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
                    {[
                        "Aulas",
                        "Horarios",
                        "Asignaciones Horario-Materia",
                        "Control de Asistencias",
                    ].map((titulo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="
                                bg-gradient-to-br from-blue-600 to-blue-400
                                text-white rounded-2xl shadow-xl p-7
                                border border-blue-300
                            "
                        >
                            <h3 className="text-xl font-bold">{titulo}</h3>
                            <p className="mt-2 text-white/90">
                                Administración de todos los horarios institucionales.
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="h-12"></div>
            </div>
        </AdminLayout>
    );
}
