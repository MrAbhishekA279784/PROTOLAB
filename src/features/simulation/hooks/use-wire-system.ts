import { useState, useCallback } from "react";
import { Wire } from "../types";
import { COMPONENT_DEFS } from "../constants/component-defs";

export function useWireSystem(components: any[]) {
  const [wires, setWires] = useState<Wire[]>([]);
  const [drawingWire, setDrawingWire] = useState<{ startComp: string; startPin: string; endX: number; endY: number } | null>(null);

  const startWire = useCallback((compId: string, pinId: string, startX: number, startY: number) => {
    setDrawingWire({ startComp: compId, startPin: pinId, endX: startX, endY: startY });
  }, []);

  const updateDrawingWire = useCallback((x: number, y: number) => {
    if (drawingWire) setDrawingWire(prev => prev ? { ...prev, endX: x, endY: y } : null);
  }, [drawingWire]);

  const completeWire = useCallback((compId: string, pinId: string) => {
    if (drawingWire && drawingWire.startComp !== compId) {
      const colors = ["#ef4444", "#16a34a", "#1e293b", "#eab308"];
      setWires(prev => [...prev, {
        id: crypto.randomUUID(),
        startComp: drawingWire.startComp, startPin: drawingWire.startPin,
        endComp: compId, endPin: pinId,
        color: colors[Math.floor(Math.random() * colors.length)]
      }]);
    }
    setDrawingWire(null);
  }, [drawingWire]);

  const cancelWire = useCallback(() => setDrawingWire(null), []);

  const getPinAbsoluteCoords = (comp: any, pin: any) => {
    const def = COMPONENT_DEFS[comp.type];
    const cx = def.width / 2, cy = def.height / 2;
    const dx = pin.x - cx, dy = pin.y - cy;
    const rot = (comp.rotation || 0) * (Math.PI / 180);
    const rx = dx * Math.cos(rot) - dy * Math.sin(rot);
    const ry = dx * Math.sin(rot) + dy * Math.cos(rot);
    return { x: comp.x + cx + rx, y: comp.y + cy + ry };
  };

  return { wires, setWires, drawingWire, startWire, updateDrawingWire, completeWire, cancelWire, getPinAbsoluteCoords };
}
