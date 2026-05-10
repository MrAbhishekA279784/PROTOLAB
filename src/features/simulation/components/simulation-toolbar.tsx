import React from "react";
import { 
  Undo, Redo, Activity, Trash2, Copy, RotateCw, RefreshCw, 
  MessageSquare, ScanSearch, ChevronDown, ChevronRight, 
  Code2, Square, Play, Share2, FolderOpen, Save, History, Download 
} from "lucide-react";

interface SimulationToolbarProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDebugMode: boolean;
  setIsDebugMode: (val: boolean) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  rotateSelected: () => void;
  resetCanvas: () => void;
  selectedIds: string[];
  activeTool: "select" | "comment" | "inspect";
  setActiveTool: (tool: "select" | "comment" | "inspect") => void;
  selectedComp: any;
  setInspectTarget: (comp: any) => void;
  setShowInspect: (val: boolean) => void;
  showInspect: boolean;
  wireType: string;
  setWireType: (type: any) => void;
  showWireDropdown: boolean;
  setShowWireDropdown: (val: boolean) => void;
  WIRE_TYPES: any[];
  currentWireType: any;
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  handleShareButton: () => void;
  loadTemplate: (name: string) => void;
  setComponents: (comps: any[]) => void;
  isOwner: boolean;
  handleSaveVersion: () => void;
  activePost: any;
  handleLoadVersion: (data: any) => void;
  handleExport: () => void;
}

export const SimulationToolbar: React.FC<SimulationToolbarProps> = ({
  undo,
  redo,
  canUndo,
  canRedo,
  isDebugMode,
  setIsDebugMode,
  deleteSelected,
  duplicateSelected,
  rotateSelected,
  resetCanvas,
  selectedIds,
  activeTool,
  setActiveTool,
  selectedComp,
  setInspectTarget,
  setShowInspect,
  showInspect,
  wireType,
  setWireType,
  showWireDropdown,
  setShowWireDropdown,
  WIRE_TYPES,
  currentWireType,
  isRunning,
  setIsRunning,
  handleShareButton,
  loadTemplate,
  setComponents,
  isOwner,
  handleSaveVersion,
  activePost,
  handleLoadVersion,
  handleExport,
}) => {
  return (
    <div className="h-14 border-b border-border bg-card/95 backdrop-blur-sm flex items-center px-3 gap-1 z-20 shrink-0 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] animate-in slide-in-from-top-4 fade-in duration-500">
      {/* LEFT: Undo / Redo / Delete / Duplicate / Rotate / Reset */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />
      <button
        onClick={() => setIsDebugMode(!isDebugMode)}
        className={`p-2 rounded hover:scale-110 active:scale-95 transition-all ${
          isDebugMode
            ? "bg-warning/20 text-warning border border-warning/30 shadow-inner"
            : "text-muted-foreground hover:text-warning hover:bg-warning/10"
        }`}
        title="Debug Circuit"
      >
        <Activity className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-border mx-1" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={deleteSelected}
          disabled={selectedIds.length === 0}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Delete selected (Del)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={duplicateSelected}
          disabled={selectedIds.length === 0}
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={rotateSelected}
          disabled={selectedIds.length === 0}
          className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Rotate 90°"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={resetCanvas}
          className="p-2 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded hover:scale-110 active:scale-95 transition-all"
          title="Reset canvas"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* MIDDLE: Comment + Inspect tools */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setActiveTool(activeTool === "comment" ? "select" : "comment")}
          className={`p-2 rounded hover:scale-110 active:scale-95 transition-all ${
            activeTool === "comment"
              ? "bg-warning/20 text-warning shadow-inner"
              : "text-muted-foreground hover:text-warning hover:bg-warning/10"
          }`}
          title="Comment tool – click on canvas to add note"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (selectedComp) {
              setInspectTarget(selectedComp);
              setShowInspect(true);
            }
          }}
          disabled={!selectedComp}
          className={`p-2 rounded hover:scale-110 active:scale-95 transition-all ${
            showInspect
              ? "bg-primary/20 text-primary shadow-inner"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed"
          }`}
          title="Inspect selected component"
        >
          <ScanSearch className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" />

      {/* RIGHT: Wire-type dropdown + Code + Simulate + Send To */}
      <div className="flex items-center gap-2">
        {/* Wire Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWireDropdown(!showWireDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-semibold text-foreground hover:bg-secondary hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full" style={{ background: currentWireType.color }} />
            {currentWireType.label}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {showWireDropdown && (
            <div className="absolute top-full mt-1 right-0 w-44 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 pt-1 pb-1">
                Wire Type
              </p>
              {WIRE_TYPES.map((wt) => (
                <button
                  key={wt.id}
                  onClick={() => {
                    setWireType(wt.id);
                    setShowWireDropdown(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors ${
                    wireType === wt.id ? "font-bold text-primary bg-primary/10" : ""
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border-2"
                    style={{
                      borderColor: wt.color,
                      background: wireType === wt.id ? wt.color : "transparent",
                    }}
                  />
                  {wt.label}
                  {wireType === wt.id && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold text-foreground hover:bg-secondary transition-all border border-transparent hover:border-border hover:scale-105 active:scale-95">
          <Code2 className="w-4 h-4" /> Code
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 border ${
            isRunning
              ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              : "bg-gradient-to-b from-[#16a34a] to-[#15803d] text-white border-[#16a34a]"
          }`}
        >
          {isRunning ? (
            <Square className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          {isRunning ? "Stop" : "Start Simulation"}
        </button>
        <button
          onClick={handleShareButton}
          className="ml-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Templates Dropdown */}
        <div className="relative group z-50">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-secondary text-foreground hover:bg-muted transition-colors">
            <FolderOpen className="w-3.5 h-3.5" /> Templates
          </button>
          <div className="absolute top-full right-0 mt-1 w-40 bg-popover border border-border rounded shadow-xl hidden group-hover:block">
            <button
              onClick={() => loadTemplate("LED Blinker")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted border-b border-border text-foreground"
            >
              LED Blinker
            </button>
            <button
              onClick={() => loadTemplate("DHT22 Sensor")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted border-b border-border text-foreground"
            >
              Temp Monitor
            </button>
            <button
              onClick={() => setComponents([])}
              className="w-full text-left px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
            >
              Clear Board
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-border mx-1" />
        {isOwner && (
          <button
            onClick={handleSaveVersion}
            title="Commit Version"
            className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
          >
            <Save className="w-4 h-4" />
          </button>
        )}

        {activePost && activePost.versions && activePost.versions.length > 0 && (
          <div className="relative group">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors flex items-center gap-1" title="Version History">
              <History className="w-4 h-4" />
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded shadow-xl hidden group-hover:block z-50">
                <p className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">Versions</p>
                {activePost.versions.map((v: any, idx: number) => (
                  <button key={idx} onClick={() => handleLoadVersion(v.data)} className="w-full text-left px-3 py-2 text-xs hover:bg-muted border-b border-border last:border-0 truncate flex items-center justify-between text-foreground">
                    <span>{v.name}</span>
                    <span className="text-[9px] text-muted-foreground">{new Date(v.timestamp).toLocaleDateString()}</span>
                  </button>
                ))}
              </div>
            </button>
          </div>
        )}

        <button onClick={handleExport} title="Export as JSON" className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
