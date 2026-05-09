import { useState, useRef, useCallback, useEffect } from "react";

export function useSimulationViewport() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLogicalCoords = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }, [pan, zoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = delta > 0 ? 1.1 : 0.9;
      const newZoom = Math.max(0.1, Math.min(5, zoom * factor));
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dx = (mouseX - pan.x) * (newZoom / zoom - 1);
        const dy = (mouseY - pan.y) * (newZoom / zoom - 1);
        setPan(prev => ({ x: prev.x - dx, y: prev.y - dy }));
      }
      setZoom(newZoom);
    } else {
      setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  }, [zoom, pan]);

  return { pan, setPan, zoom, setZoom, containerRef, getLogicalCoords, handleWheel };
}
