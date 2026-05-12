import { useState, useCallback, useRef } from "react";
import { ComponentInstance, Wire } from "../types";

export function useSimulationHistory(initialComponents: ComponentInstance[], initialWires: Wire[]) {
  const [history, setHistory] = useState<{ components: ComponentInstance[]; wires: Wire[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyRef = useRef(history);
  const historyIndexRef = useRef(historyIndex);

  historyRef.current = history;
  historyIndexRef.current = historyIndex;

  const pushHistory = useCallback((components: ComponentInstance[], wires: Wire[]) => {
    const newState = { components, wires };
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndexRef.current + 1), newState];
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, []);

  const undo = useCallback((setComponents: (comps: ComponentInstance[]) => void, setWires: (wires: Wire[]) => void) => {
    if (historyIndexRef.current > 0) {
      const { components, wires } = historyRef.current[historyIndexRef.current - 1];
      setComponents(components);
      setWires(wires);
      setHistoryIndex(prev => prev - 1);
    }
  }, []);

  const redo = useCallback((setComponents: (comps: ComponentInstance[]) => void, setWires: (wires: Wire[]) => void) => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      const { components, wires } = historyRef.current[historyIndexRef.current + 1];
      setComponents(components);
      setWires(wires);
      setHistoryIndex(prev => prev + 1);
    }
  }, []);

  return { pushHistory, undo, redo, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1 };
}
