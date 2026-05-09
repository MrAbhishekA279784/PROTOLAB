import { useState, useCallback, useRef } from "react";

export function useSimulationHistory(initialComponents: any[], initialWires: any[]) {
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback((components: any[], wires: any[]) => {
    const newState = JSON.stringify({ components, wires });
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newState]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback((setComponents: any, setWires: any) => {
    if (historyIndex > 0) {
      const { components, wires } = JSON.parse(history[historyIndex - 1]);
      setComponents(components);
      setWires(wires);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback((setComponents: any, setWires: any) => {
    if (historyIndex < history.length - 1) {
      const { components, wires } = JSON.parse(history[historyIndex + 1]);
      setComponents(components);
      setWires(wires);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  return { pushHistory, undo, redo, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1 };
}
