import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useStore, Visibility, Complexity, ProjectData } from "@/store/useStore";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { useCollaboration } from "@/store/useCollaboration";
import { Grid3X3, ArrowRight, DollarSign } from "lucide-react";
import { ComponentInstance, Wire } from "@/features/simulation/types";

interface CommentItem {
  id: string;
  x: number;
  y: number;
  text?: string;
  editing?: boolean;
}

// Feature Modular Imports
import { COMPONENT_DEFS } from "@/features/simulation/constants/component-defs";
import { WIRE_TYPES } from "@/features/simulation/constants/wire-types";
import { useWireSystem } from "@/features/simulation/hooks/use-wire-system";
import { useSimulationViewport } from "@/features/simulation/hooks/use-simulation-viewport";
import { useSimulationHistory } from "@/features/simulation/hooks/use-simulation-history";
import { SimulationToolbar } from "@/features/simulation/components/simulation-toolbar";
import { ComponentLibrary } from "@/features/simulation/components/component-library";
import { SimulationCanvas } from "@/features/simulation/components/simulation-canvas";
import { BOMEstimator } from "@/features/simulation/components/bom-estimator";
import { ShareModal } from "@/features/simulation/components/share-modal";

export default function SimulationLab() {
  const { currentUser, addPost, loadedProject, posts } = useStore();
  const activePost = loadedProject?.id ? posts.find((p) => p.id === loadedProject.id) : null;
  const isOwner = activePost?.userId === currentUser?.id;

  // Real-time collaboration
  const { cursors, broadcastCursor } = useCollaboration("global-sim");

  // Viewport State
  const { pan, setPan, zoom, setZoom, containerRef, getLogicalCoords, handleWheel } = useSimulationViewport();
  const [isPanning, setIsPanning] = useState(false);

  // Core State
  const [components, setComponents] = useState<ComponentInstance[]>(
    loadedProject?.type === "Simulation" && (loadedProject.data as ProjectData)?.components
      ? (loadedProject.data as ProjectData).components as ComponentInstance[]
      : [
          { id: "ard1", type: "arduino", x: 400, y: 150, rotation: 0 },
          { id: "bat1", type: "battery", x: 100, y: 300, rotation: 0 },
          { id: "led1", type: "led", x: 250, y: 150, rotation: 0 },
          { id: "res1", type: "resistor", x: 250, y: 250, rotation: 0 },
          { id: "mot1", type: "motor", x: 500, y: 350, rotation: 0 },
        ]
  );

  // Wire System
  const { 
    wires, setWires, drawingWire, startWire, 
    updateDrawingWire, completeWire, cancelWire, getPinAbsoluteCoords 
  } = useWireSystem(components);

  // History System
  const { pushHistory, undo: historyUndo, redo: historyRedo, canUndo, canRedo } = useSimulationHistory(components, wires);

  // UI State
  const [isRunning, setIsRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState<0.5 | 1 | 2>(1);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draggingComp, setDraggingComp] = useState<ComponentInstance | null>(null);
  const dragStartPositions = useRef<Record<string, { x: number; y: number }>>({});
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isBOMOpen, setIsBOMOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<"select" | "comment" | "inspect">("select");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [showInspect, setShowInspect] = useState(false);
  const [inspectTarget, setInspectTarget] = useState<ComponentInstance | null>(null);
  const [wireType, setWireType] = useState("normal");
  const [showWireDropdown, setShowWireDropdown] = useState(false);
  
  // Share/Preview State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const GRID_SIZE = 20;
  const snap = useCallback((v: number) => (snapEnabled ? Math.round(v / GRID_SIZE) * GRID_SIZE : v), [snapEnabled]);

  // Space+drag pan system
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const isSpaceDown = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpaceDown.current) {
        isSpaceDown.current = true;
        setIsSpacePanning(true);
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceDown.current = false;
        setIsSpacePanning(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Handlers
  const handleShareButton = async () => {
    if (!currentUser) return toast.error("Please login to share your project!");
    setIsShareModalOpen(true);
    setIsGeneratingPreview(true);
    try {
      const container = document.getElementById("sim-container");
      if (container) {
        await new Promise((r) => setTimeout(r, 100));
        const canvas = await html2canvas(container, {
          logging: false, useCORS: true, scale: 1.5, backgroundColor: "#fafafa"
        });
        setSharePreviewUrl(canvas.toDataURL("image/jpeg", 0.7));
      }
    } catch (e) {
      toast.error("Failed to generate preview image");
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleConfirmShare = async (meta: { title: string; visibility: Visibility; complexity: Complexity; tags: string[]; componentsUsed: string[] }) => {
    if (!currentUser) return;
    addPost({
      userId: currentUser.id,
      type: "Simulation",
      title: meta.title,
      data: { components, wires },
      preview: sharePreviewUrl,
      visibility: meta.visibility,
      complexity: meta.complexity,
      tags: meta.tags,
      componentsUsed: meta.componentsUsed,
    });
  };

  const handleSaveVersion = () => {
    if (!activePost || !isOwner) return toast.error("You can only save versions for your own projects.");
    const vName = prompt("Enter version name:", `v${(activePost.versions?.length || 0) + 1}`);
    if (!vName) return;
    useStore.getState().saveVersion(activePost.id, vName, { components, wires });
    toast.success("Version saved!");
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ components, wires }, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${activePost?.title || "circuit"}.json`);
    dlAnchorElem.click();
  };

  const handleLoadVersion = (vData: { components?: ComponentInstance[]; wires?: Wire[] }) => {
    if (vData.components) setComponents(vData.components);
    if (vData.wires) setWires(vData.wires);
    toast.success("Version loaded.");
  };

  const loadTemplate = (templateName: string) => {
    if (templateName === "LED Blinker") {
      const newComps = [
        { id: "t_ard", type: "arduino", x: 200, y: 150, rotation: 0 },
        { id: "t_led", type: "led", x: 500, y: 180, rotation: 0 },
        { id: "t_res", type: "resistor", x: 500, y: 280, rotation: 0 },
      ];
      const newWires = [
        { id: "tw1", startComp: "t_ard", startPin: "13", endComp: "t_led", endPin: "anode", color: "#ef4444" },
        { id: "tw2", startComp: "t_led", startPin: "cathode", endComp: "t_res", endPin: "p1", color: "#3b82f6" },
        { id: "tw3", startComp: "t_res", startPin: "p2", endComp: "t_ard", endPin: "gnd", color: "#10b981" },
      ];
      setComponents(newComps);
      setWires(newWires);
      pushHistory(newComps, newWires);
      toast.success("LED Blinker Template Loaded");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const undo = useCallback(() => { historyUndo(setComponents, setWires); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const redo = useCallback(() => { historyRedo(setComponents, setWires); }, []);

  const deleteSelected = useCallback(() => {
    if (selectedIds.length > 0) {
      const newComps = components.filter((c) => !selectedIds.includes(c.id));
      const newWires = wires.filter((w) => !selectedIds.includes(w.startComp) && !selectedIds.includes(w.endComp));
      setComponents(newComps);
      setWires(newWires);
      pushHistory(newComps, newWires);
      setSelectedIds([]);
    }
  }, [selectedIds, components, wires, setWires, pushHistory]);

  const rotateSelected = useCallback(() => {
    const newComps = components.map((c) =>
      selectedIds.includes(c.id) ? { ...c, rotation: ((c.rotation || 0) + 90) % 360 } : c
    );
    setComponents(newComps);
    pushHistory(newComps, wires);
  }, [components, selectedIds, wires, pushHistory]);

  const duplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const newIds: string[] = [];
    const clones = selectedIds.map((id) => {
      const c = components.find((x) => x.id === id);
      if (!c) return null;
      const newId = crypto.randomUUID();
      newIds.push(newId);
      return { ...c, id: newId, x: c.x + 40, y: c.y + 40 };
    }).filter(Boolean);
    const newComps = [...components, ...clones];
    setComponents(newComps);
    pushHistory(newComps, wires);
    setSelectedIds(newIds);
  }, [selectedIds, components, wires, pushHistory]);

  const resetCanvas = () => {
    setComponents([]);
    setWires([]);
    setSelectedIds([]);
    setComments([]);
    pushHistory([], []);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
      return;
    }
    const { x, y } = getLogicalCoords(e.clientX, e.clientY);
    broadcastCursor(x, y);

    if (drawingWire) {
      updateDrawingWire(x, y);
    } else if (draggingComp) {
      const startPos = dragStartPositions.current[draggingComp.id];
      if (!startPos) return;
      const dx = x - draggingComp.originX;
      const dy = y - draggingComp.originY;
      setComponents((prev) =>
        prev.map((c) => {
          if (!selectedIds.includes(c.id)) return c;
          const s = dragStartPositions.current[c.id];
          if (!s) return c;
          return { ...c, x: snap(s.x + dx), y: snap(s.y + dy) };
        })
      );
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggingComp) pushHistory(components, wires);
    setIsPanning(false);
    setDraggingComp(null);
    dragStartPositions.current = {};
    if (drawingWire && !(e.target as HTMLElement).dataset?.pin) cancelWire();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isBackground = target.id === "workspace-bg";
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      return;
    }
    if (isBackground) {
      if (activeTool !== "comment") {
        setIsPanning(true);
        setSelectedIds([]);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id !== "workspace-bg") return;
    if (activeTool === "comment") {
      const { x, y } = getLogicalCoords(e.clientX, e.clientY);
      setComments((prev) => [...prev, { id: crypto.randomUUID(), x, y, text: "", editing: true }]);
      setActiveTool("select");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const { x, y } = getLogicalCoords(e.clientX, e.clientY);
    const type = e.dataTransfer.getData("new_component");
    if (type) {
      const newComps = [...components, { id: crypto.randomUUID(), type, x: x - 40, y: y - 20, rotation: 0 }];
      setComponents(newComps);
      pushHistory(newComps, wires);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.length > 0) deleteSelected();
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
      if (e.ctrlKey && e.key === "d") { e.preventDefault(); duplicateSelected(); }
      if (e.ctrlKey && e.key === "a") { e.preventDefault(); setSelectedIds(components.map((c) => c.id)); }
      if ((e.key === "r" || e.key === "R") && !e.ctrlKey) rotateSelected();
      if (e.key === "Escape") setSelectedIds([]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, components, deleteSelected, undo, redo, duplicateSelected, rotateSelected]);

  const currentWireType = WIRE_TYPES.find((w) => w.id === wireType) || WIRE_TYPES[0];
  const selectedComp = components.find((c) => selectedIds.includes(c.id));

  return (
    <div className="flex h-full bg-background" id="sim-container">
      {/* 1. Left Panel (Tutorial Guide) */}
      <div className="w-72 bg-card/95 backdrop-blur-sm border-r border-border flex flex-col shrink-0 z-30 shadow-[4px_0_20px_-5px_rgba(0,0,0,0.05)] animate-in slide-in-from-left-8 fade-in duration-500">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <Grid3X3 className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-foreground text-lg">Start Simulating</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-6 font-medium leading-relaxed">
            Let's learn how to test a circuit design with the simulator. Follow the steps below!
          </p>
          <div className="w-full aspect-[4/3] bg-muted/50 rounded-lg border border-border shadow-inner flex items-center justify-center mb-6 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
            <div className="text-muted-foreground font-semibold text-sm">Preview Img</div>
          </div>
          <div className="flex justify-between items-center bg-muted border border-border rounded p-1 shadow-sm">
            <button className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 transition-all">
              Prev
            </button>
            <span className="text-xs font-bold text-muted-foreground">1 / 3</span>
            <button className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded flex items-center gap-1 hover:scale-105 active:scale-95 transition-all">
              Next <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <SimulationToolbar
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          isDebugMode={isDebugMode}
          setIsDebugMode={setIsDebugMode}
          deleteSelected={deleteSelected}
          duplicateSelected={duplicateSelected}
          rotateSelected={rotateSelected}
          resetCanvas={resetCanvas}
          selectedIds={selectedIds}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          selectedComp={selectedComp}
          setInspectTarget={setInspectTarget}
          setShowInspect={setShowInspect}
          showInspect={showInspect}
          wireType={wireType}
          setWireType={setWireType}
          showWireDropdown={showWireDropdown}
          setShowWireDropdown={setShowWireDropdown}
          WIRE_TYPES={WIRE_TYPES}
          currentWireType={currentWireType}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          handleShareButton={handleShareButton}
          loadTemplate={loadTemplate}
          setComponents={setComponents}
          isOwner={isOwner}
          handleSaveVersion={handleSaveVersion}
          activePost={activePost}
          handleLoadVersion={handleLoadVersion}
          handleExport={handleExport}
        />

        <SimulationCanvas
          containerRef={containerRef}
          pan={pan}
          zoom={zoom}
          isPanning={isPanning}
          isSpacePanning={isSpacePanning}
          activeTool={activeTool}
          snapEnabled={snapEnabled}
          setSnapEnabled={setSnapEnabled}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          components={components}
          setComponents={setComponents}
          wires={wires}
          drawingWire={drawingWire}
          isRunning={isRunning}
          simSpeed={simSpeed}
          comments={comments}
          setComments={setComments}
          showInspect={showInspect}
          inspectTarget={inspectTarget}
          setShowInspect={setShowInspect}
          cursors={cursors}
          selBox={null} // Simplified for now
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleMouseDown={handleMouseDown}
          handleCanvasClick={handleCanvasClick}
          handleWheel={handleWheel}
          handleDrop={handleDrop}
          getLogicalCoords={getLogicalCoords}
          getPinAbsoluteCoords={getPinAbsoluteCoords}
          startWire={startWire}
          completeWire={completeWire}
          draggingComp={draggingComp}
          setDraggingComp={setDraggingComp}
          dragStartPositions={dragStartPositions}
        />
      </div>

      <ComponentLibrary
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={activeSearchTerm}
        setSearchTerm={setActiveSearchTerm}
      />

      <BOMEstimator isOpen={isBOMOpen} onClose={() => setIsBOMOpen(false)} components={components} />
      
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        previewImage={sharePreviewUrl} 
        isLoadingPreview={isGeneratingPreview} 
        onConfirm={handleConfirmShare} 
      />
    </div>
  );
}
