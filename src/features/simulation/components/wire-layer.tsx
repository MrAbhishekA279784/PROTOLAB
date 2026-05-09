import React, { useState } from "react";
import { Wire } from "../types";
import { COMPONENT_DEFS } from "../constants/component-defs";

interface WireLayerProps {
  wires: Wire[];
  components: any[];
  drawingWire: { startComp: string; startPin: string; endX: number; endY: number } | null;
  isRunning: boolean;
  simSpeed: number;
  getPinAbsoluteCoords: (comp: any, pin: any) => { x: number; y: number };
}

export const WireLayer: React.FC<WireLayerProps> = ({
  wires,
  components,
  drawingWire,
  isRunning,
  simSpeed,
  getPinAbsoluteCoords,
}) => {
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);

  return (
    <svg className="absolute inset-0 w-[10000px] h-[10000px]" style={{ overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <style>{`
          @keyframes wire-flow {
            from { stroke-dashoffset: 24; }
            to { stroke-dashoffset: 0; }
          }
          .wire-animated {
            animation: wire-flow linear infinite;
          }
        `}</style>
      </defs>
      {wires.map((w) => {
        const startComp = components.find((c) => c.id === w.startComp);
        const endComp = components.find((c) => c.id === w.endComp);
        if (!startComp || !endComp) return null;

        const sPin = COMPONENT_DEFS[startComp.type]?.pins.find((p: any) => p.id === w.startPin);
        const ePin = COMPONENT_DEFS[endComp.type]?.pins.find((p: any) => p.id === w.endPin);
        if (!sPin || !ePin) return null;

        const startCoords = getPinAbsoluteCoords(startComp, sPin);
        const endCoords = getPinAbsoluteCoords(endComp, ePin);
        const flex = Math.abs(startCoords.x - endCoords.x) * 0.25;
        const isHovered = hoveredWire === w.id;
        const d = `M ${startCoords.x} ${startCoords.y} C ${startCoords.x + flex} ${startCoords.y}, ${endCoords.x - flex} ${endCoords.y}, ${endCoords.x} ${endCoords.y}`;
        const flowDuration = simSpeed === 0.5 ? "1.5s" : simSpeed === 2 ? "0.4s" : "0.8s";

        return (
          <g
            key={w.id}
            style={{ pointerEvents: "stroke" }}
            onMouseEnter={() => setHoveredWire(w.id)}
            onMouseLeave={() => setHoveredWire(null)}
          >
            {/* Hover hit area */}
            <path
              d={d}
              stroke="transparent"
              strokeWidth="16"
              fill="none"
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
            />
            {/* Glow on hover */}
            {isHovered && (
              <path d={d} stroke={w.color} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.25" />
            )}
            {/* Main wire */}
            <path
              d={d}
              stroke={isRunning ? "#16a34a" : w.color}
              strokeWidth={isHovered ? 4.5 : 3.5}
              fill="none"
              strokeLinecap="round"
              style={{ transition: "stroke 0.3s, stroke-width 0.2s" }}
            />
            {/* Current flow dots */}
            {isRunning && (
              <path
                d={d}
                stroke="rgba(134,239,172,0.9)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="4 20"
                className="wire-animated"
                style={{ animationDuration: flowDuration }}
              />
            )}
          </g>
        );
      })}

      {drawingWire &&
        (() => {
          const startComp = components.find((c) => c.id === drawingWire.startComp);
          if (!startComp) return null;
          const sPin = COMPONENT_DEFS[startComp.type]?.pins.find((p: any) => p.id === drawingWire.startPin);
          if (!sPin) return null;
          const startCoords = getPinAbsoluteCoords(startComp, sPin);
          const flex = Math.abs(startCoords.x - drawingWire.endX) * 0.25;
          return (
            <path
              d={`M ${startCoords.x} ${startCoords.y} C ${startCoords.x + flex} ${startCoords.y}, ${drawingWire.endX - flex} ${drawingWire.endY}, ${drawingWire.endX} ${drawingWire.endY}`}
              stroke="#16a34a"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="5,5"
            />
          );
        })()}
    </svg>
  );
};
