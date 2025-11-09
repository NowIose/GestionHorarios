import React, { useMemo, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

interface MateriaNode {
  id: number;
  sigla: string;
  nombre: string;
  semestre: number;
  creditos: number | null;
  prerequisitos?: {
    materia_requisito_id?: number;
    materia_requisito?: MateriaNode;
  }[];
}

interface Props {
  materias: MateriaNode[];
}

const coloresSemestre = [
  "#F87171", // rojo
  "#FBBF24", // amarillo
  "#34D399", // verde
  "#60A5FA", // azul
  "#A78BFA", // violeta
  "#F472B6", // rosado
  "#22D3EE", // celeste
  "#F59E0B", // naranja
  "#10B981", // esmeralda
  "#6366F1", // índigo
];

export default function MallaMaterias({ materias }: Props) {
  const [darkMode, setDarkMode] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);

  // Agrupar materias por semestre
  const grouped = useMemo(() => {
    const g: Record<number, MateriaNode[]> = {};
    materias.forEach((m) => {
      const s = Number(m.semestre) || 1;
      if (!g[s]) g[s] = [];
      g[s].push(m);
    });
    return g;
  }, [materias]);

  // Crear nodos
  const nodesInit: Node[] = useMemo(() => {
    const arr: Node[] = [];
    const semestres = Object.keys(grouped)
      .map((k) => Number(k))
      .sort((a, b) => a - b);

    semestres.forEach((semIdx) => {
      const mats = grouped[semIdx];
      mats.forEach((m, i) => {
        const x = (semIdx - 1) * 280;
        const y = i * 160;

        arr.push({
          id: m.id.toString(),
          data: {
            label: (
              <div
                className="flex flex-col items-center justify-center text-center leading-snug cursor-pointer"
                onClick={() => setHighlight(m.id.toString())}
                onMouseEnter={() => setHighlight(m.id.toString())}
                onMouseLeave={() => setHighlight(null)}
              >
                <span
                  className={`font-bold text-sm ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {m.sigla}
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {m.nombre}
                </span>
                <span
                  className={`text-[11px] opacity-80 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  ({m.creditos ?? "-"} cr)
                </span>
              </div>
            ),
          },
          position: { x, y },
          draggable: true,
          selectable: true,
          style: {
            background: coloresSemestre[(semIdx - 1) % coloresSemestre.length],
            color: darkMode ? "#fff" : "#000",
            borderRadius: 14,
            width: 220,
            minHeight: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            boxShadow: darkMode
              ? "0 6px 16px rgba(0,0,0,0.6)"
              : "0 6px 16px rgba(0,0,0,0.15)",
            border: "2px solid rgba(0,0,0,0.05)",
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        });
      });
    });
    return arr;
  }, [grouped, darkMode]);

  // Crear edges con efecto dinámico
  const edgesInit: Edge[] = useMemo(() => {
    const arr: Edge[] = [];
    materias.forEach((m) => {
      if (!m.prerequisitos) return;
      m.prerequisitos.forEach((p) => {
        const sourceId = p.materia_requisito_id ?? p.materia_requisito?.id;
        if (!sourceId) return;
        const color =
          coloresSemestre[(m.semestre - 1) % coloresSemestre.length];
        arr.push({
          id: `${sourceId}-${m.id}`,
          source: sourceId.toString(),
          target: m.id.toString(),
          animated: true,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
          },
          data: { baseColor: color },
          style: {
            stroke: color,
            strokeWidth: 2.5,
            opacity: 0.9,
            transition: "all 0.3s ease",
          },
        });
      });
    });
    return arr;
  }, [materias]);

  const [nodes, , onNodesChange] = useNodesState(nodesInit);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesInit);

  // 🔥 Actualizar efecto de highlight dinámico
  const highlightedEdges = useMemo(() => {
    return edges.map((e) => {
      const isConnected =
        e.source === highlight || e.target === highlight;
      return {
        ...e,
        style: {
          ...e.style,
          strokeWidth: isConnected ? 4 : 2.5,
          opacity: isConnected ? 1 : 0.2,
          stroke: isConnected
            ? darkMode
              ? "#fff"
              : e.data?.baseColor || "#000"
            : e.data?.baseColor,
        },
        animated: isConnected,
      };
    });
  }, [edges, highlight, darkMode]);

  const semestreKeys = useMemo(
    () =>
      Array.from(new Set(materias.map((m) => Number(m.semestre) || 1))).sort(
        (a, b) => a - b
      ),
    [materias]
  );

  const miniMapNodeColor = useCallback(
    (n: Node): string =>
      String(
        (n.style && (n.style as React.CSSProperties).background) ??
          (darkMode ? "#6D28D9" : "#A78BFA")
      ),
    [darkMode]
  );

  return (
    <div
      className={`relative rounded-xl shadow-md overflow-hidden border ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h3
            className={`text-lg font-bold ${
              darkMode ? "text-purple-100" : "text-purple-800"
            }`}
          >
            Malla Curricular
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Visualización por semestres y prerequisitos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`text-sm px-3 py-1 rounded ${
              darkMode
                ? "bg-purple-800 text-purple-100"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            <strong>{materias.length}</strong> materias
          </div>

          <button
            onClick={() => setDarkMode((v) => !v)}
            className={`px-3 py-1 rounded transition ${
              darkMode
                ? "bg-gray-800 text-purple-200 hover:bg-gray-700"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
        </div>
      </div>

      {/* Leyenda solo de colores de semestre */}
      <div
        className={`p-3 border-t ${
          darkMode ? "border-gray-800" : "border-gray-100"
        } flex flex-wrap gap-4 items-center justify-end`}
      >
        {semestreKeys.map((s) => (
          <div key={s} className="flex items-center gap-2 text-xs">
            <div
              style={{
                width: 18,
                height: 12,
                background:
                  coloresSemestre[(s - 1) % coloresSemestre.length],
                borderRadius: 4,
              }}
            />
            <span
              className={`${
                darkMode ? "text-gray-200" : "text-gray-800"
              } font-medium`}
            >
              S{s}
            </span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ height: "70vh", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={highlightedEdges}
          fitView
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <MiniMap
            nodeColor={miniMapNodeColor}
            maskColor={
              darkMode ? "rgba(0,0,0,0.4)" : "rgba(109,40,217,0.08)"
            }
            nodeStrokeWidth={2}
          />
          <Controls
            showInteractive={true}
            style={{
              background: darkMode ? "#111827" : "white",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Background color={darkMode ? "#2b0953" : "#C4B5FD"} gap={22} />
        </ReactFlow>
      </div>
    </div>
  );
}
