import React from "react";
import { ComponentInstance, Wire, Pin } from "../types";
import { COMPONENT_DEFS } from "../constants/component-defs";
import { WireLayer } from "./wire-layer";
import { CommentNote } from "./comment-note";
import { InspectorPanel } from "./inspector-panel";

interface CommentItem {
  id: string;
  x: number;
  y: number;
  text?: string;
  editing?: boolean;
}

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface SimulationCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  pan: { x: number; y: number };
  zoom: number;
  isPanning: boolean;
  isSpacePanning: boolean;
  activeTool: string;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean | ((v: boolean) => boolean)) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  components: ComponentInstance[];
  setComponents: (comps: ComponentInstance[]) => void;
  wires: Wire[];
  drawingWire: { startComp: string; startPin: string; endX: number; endY: number } | null;
  isRunning: boolean;
  simSpeed: number;
  comments: CommentItem[];
  setComments: React.Dispatch<React.SetStateAction<CommentItem[]>>;
  showInspect: boolean;
  inspectTarget: ComponentInstance | null;
  setShowInspect: (val: boolean) => void;
  cursors: { id: string; username: string; x: number; y: number; color: string; timestamp: number }[];
  selBox: SelectionBox | null;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleCanvasClick: (e: React.MouseEvent) => void;
  handleWheel: (e: React.WheelEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  getLogicalCoords: (clientX: number, clientY: number) => { x: number; y: number };
  getPinAbsoluteCoords: (comp: ComponentInstance, pin: Pin) => { x: number; y: number };
  startWire: (compId: string, pinId: string, x: number, y: number) => void;
  completeWire: (compId: string, pinId: string) => void;
  draggingComp: ComponentInstance | null;
  setDraggingComp: (comp: ComponentInstance | null) => void;
  dragStartPositions: React.MutableRefObject<Record<string, { x: number; y: number }>>;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  containerRef,
  pan,
  zoom,
  isPanning,
  isSpacePanning,
  activeTool,
  snapEnabled,
  setSnapEnabled,
  selectedIds,
  setSelectedIds,
  components,
  setComponents,
  wires,
  drawingWire,
  isRunning,
  simSpeed,
  comments,
  setComments,
  showInspect,
  inspectTarget,
  setShowInspect,
  cursors,
  selBox,
  handleMouseMove,
  handleMouseUp,
  handleMouseDown,
  handleCanvasClick,
  handleWheel,
  handleDrop,
  getLogicalCoords,
  getPinAbsoluteCoords,
  startWire,
  completeWire,
  draggingComp,
  setDraggingComp,
  dragStartPositions,
}) => {
  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-[#fafafa] dark:bg-[#0b1221]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Infinite Grid Visual */}
      <div
        id="workspace-bg"
        className={`absolute inset-0 z-0 transition-[cursor] ${
          isPanning ? "cursor-grabbing" : "cursor-grab"
        } ${activeTool === "comment" ? "!cursor-cell" : ""}`}
        style={{
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        }}
      />

      {/* Bottom-left: Zoom / Snap / Tool indicators */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
        <span className="text-[11px] font-mono text-muted-foreground bg-card/80 px-2 py-1 rounded-md border border-border shadow-sm">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setSnapEnabled((v: boolean) => !v)}
          className={`text-[11px] font-bold px-2 py-1 rounded-md border shadow-sm transition-all ${
            snapEnabled
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border text-muted-foreground"
          }`}
          title="Toggle grid snap (20px)"
        >
          ⊞ Snap {snapEnabled ? "ON" : "OFF"}
        </button>
        {isSpacePanning && (
          <span className="text-[11px] font-bold text-muted-foreground bg-card border border-border px-2 py-1 rounded-md shadow-sm">
            Hold Space + Drag to Pan
          </span>
        )}
        {selectedIds.length > 1 && (
          <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md shadow-sm">
            {selectedIds.length} selected
          </span>
        )}
        {activeTool !== "select" && (
          <span className="text-[11px] font-bold text-warning bg-warning/10 border border-warning/20 px-2 py-1 rounded-md shadow-sm capitalize">
            {activeTool} mode
          </span>
        )}
      </div>

      {/* Live User Cursors */}
      {cursors.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none z-50 flex flex-col items-center"
          style={{
            left: `${c.x * zoom + pan.x}px`,
            top: `${c.y * zoom + pan.y}px`,
          }}
        >
          <div
            className="w-4 h-4"
            style={{
              color: c.color,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.653 3.123l13.561 6.781c1.17.585 1.17 2.254 0 2.838l-13.561 6.781c-1.21.605-2.653-.271-2.653-1.621V4.744c0-1.35 1.443-2.226 2.653-1.621z" />
            </svg>
          </div>
          <div
            className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-sm -mt-1 whitespace-nowrap"
            style={{ backgroundColor: c.color }}
          >
            {c.username}
          </div>
        </div>
      ))}

      {/* Logical Workspace transform container */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        {/* Selection box overlay */}
        {selBox && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-100/20 rounded pointer-events-none z-50"
            style={{
              left: Math.min(selBox.startX, selBox.endX),
              top: Math.min(selBox.startY, selBox.endY),
              width: Math.abs(selBox.endX - selBox.startX),
              height: Math.abs(selBox.endY - selBox.startY),
            }}
          />
        )}

        <WireLayer
          wires={wires}
          components={components}
          drawingWire={drawingWire}
          isRunning={isRunning}
          simSpeed={simSpeed}
          getPinAbsoluteCoords={getPinAbsoluteCoords}
        />

        {/* Comment notes on canvas */}
        {comments.map((cm) => (
          <CommentNote key={cm.id} comment={cm} setComments={setComments} />
        ))}

        {/* Inspect Panel */}
        <InspectorPanel inspectTarget={inspectTarget} setShowInspect={setShowInspect} />

        {components.map((comp) => {
          const def = COMPONENT_DEFS[comp.type];
          if (!def) return null;
          const isSelected = selectedIds.includes(comp.id);
          const isDraggingThis = draggingComp?.id === comp.id;

          return (
            <div
              key={comp.id}
              className={`absolute z-20 pointer-events-auto group drop-shadow-sm hover:drop-shadow-[0_4px_12px_rgba(59,130,246,0.3)] transition-[filter] duration-300 ${
                isDraggingThis
                  ? "scale-105 z-50 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-transform ease-out"
                  : ""
              }`}
              style={{
                left: comp.x,
                top: comp.y,
                width: def.width,
                height: def.height,
                perspective: "1000px",
              }}
            >
              <div
                onMouseDown={(e) => {
                  if ((e.target as HTMLElement).dataset.pin) return;
                  e.stopPropagation();
                  const { x, y } = getLogicalCoords(e.clientX, e.clientY);
                  if (e.shiftKey) {
                    setSelectedIds((prev) =>
                      prev.includes(comp.id)
                        ? prev.filter((id) => id !== comp.id)
                        : [...prev, comp.id]
                    );
                  } else {
                    if (!selectedIds.includes(comp.id)) setSelectedIds([comp.id]);
                  }
                  const ids = e.shiftKey
                    ? selectedIds.includes(comp.id)
                      ? selectedIds.filter((id) => id !== comp.id)
                      : [...selectedIds, comp.id]
                    : selectedIds.includes(comp.id)
                    ? selectedIds
                    : [comp.id];
                  const positions: Record<string, { x: number; y: number }> = {};
                  components.forEach((c) => {
                    if (ids.includes(c.id)) positions[c.id] = { x: c.x, y: c.y };
                  });
                  dragStartPositions.current = positions;
                  setDraggingComp({ id: comp.id, originX: x, originY: y });
                }}
                className={`absolute inset-0 cursor-grab active:cursor-grabbing origin-center transition-transform hover:-translate-y-[1px] duration-300 ${
                  isSelected
                    ? selectedIds.length > 1
                      ? "ring-2 ring-violet-500 ring-offset-4 ring-offset-background rounded-sm shadow-[0_0_0_4px_rgba(139,92,246,0.15)]"
                      : "ring-2 ring-primary ring-offset-4 ring-offset-background rounded-sm shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    : ""
                }`}
                style={{
                  transform: `rotate(${comp.rotation || 0}deg) ${
                    isDraggingThis ? "scale(1.05)" : ""
                  }`,
                }}
              >
                {def.render({ isRunning })}
              </div>

              {/* Connection Pins */}
              {def.pins.map((pin) => {
                const absPos = getPinAbsoluteCoords(comp, pin);
                return (
                  <div
                    key={pin.id}
                    data-pin="true"
                    style={{
                      left: absPos.x - comp.x,
                      top: absPos.y - comp.y,
                      transform: "translate(-50%, -50%)",
                    }}
                    className="absolute w-4 h-4 bg-red-500 rounded-full opacity-0 hover:opacity-50 cursor-crosshair transition-opacity z-30"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startWire(
                        comp.id,
                        pin.id,
                        getLogicalCoords(e.clientX, e.clientY).x,
                        getLogicalCoords(e.clientX, e.clientY).y
                      );
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      completeWire(comp.id, pin.id);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
