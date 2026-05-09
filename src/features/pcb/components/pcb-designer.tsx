import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { ShareModal } from "@/features/simulation/components/share-modal";
import html2canvas from "html2canvas";
import {
  Layers, ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock,
  File, FolderOpen, Search, ZoomIn, ZoomOut, Move, Crosshair,
  RotateCw, Grid3X3, Save, History, Download
} from "lucide-react";

const menuItems = ["File", "Edit", "View", "Place", "Route", "Tools", "Design", "Help"];

const layers = [
  { name: "Top Copper", color: "#ef4444", visible: true },
  { name: "Bottom Copper", color: "#3b82f6", visible: true },
  { name: "Top Silk", color: "#fbbf24", visible: true },
  { name: "Bottom Silk", color: "#8b5cf6", visible: false },
  { name: "Solder Mask", color: "#22c55e", visible: true },
  { name: "Drill", color: "#f97316", visible: true },
];

const PCBDesigner = () => {
  const { currentUser, addPost, loadedProject, posts } = useStore();
  const pcbRef = useRef<HTMLDivElement>(null);
  
  const activePost = loadedProject?.id ? posts.find(p => p.id === loadedProject.id) : null;
  const isOwner = activePost?.userId === currentUser?.id;

  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>(
    loadedProject?.type === "PCB Design" && loadedProject.data?.layerVisibility 
      ? loadedProject.data.layerVisibility 
      : Object.fromEntries(layers.map((l) => [l.name, l.visible]))
  );
  const [activeLayer, setActiveLayer] = useState("Top Copper");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const handleShareButton = async () => {
    if (!currentUser) {
      toast.error("Please login to share your project!");
      return;
    }
    setIsShareModalOpen(true);
    setIsGeneratingPreview(true);
    try {
      if (pcbRef.current) {
        await new Promise(r => setTimeout(r, 100));
        const canvas = await html2canvas(pcbRef.current, {
           logging: false, scale: 1.5, backgroundColor: "#fafafa"
        });
        setSharePreviewUrl(canvas.toDataURL("image/jpeg", 0.7));
      }
    } catch (e) {
      toast.error("Failed to generate preview image");
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleConfirmShare = async (meta: any) => {
    if (!currentUser) return;
    addPost({
      userId: currentUser.id,
      type: "PCB Design",
      title: meta.title,
      data: { tracks, layerVisibility },
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
     useStore.getState().saveVersion(activePost.id, vName, { tracks, layerVisibility });
     toast.success("Version saved!");
  };

  const handleExport = () => {
     const dataStr = "data:application/zip;charset=utf-8,PK\x03\x04MockZipFileHereForGerbers";
     const dlAnchorElem = document.createElement('a');
     dlAnchorElem.setAttribute("href", dataStr);
     dlAnchorElem.setAttribute("download", `${activePost?.title?.replace(/\s+/g,'_') || 'pcb-design'}_gerbers.zip`);
     dlAnchorElem.click();
     toast.success("Exported Gerber package!");
  };

  const handleLoadVersion = (vData: any) => {
     if (vData.tracks) setTracks(vData.tracks);
     if (vData.layerVisibility) setLayerVisibility(vData.layerVisibility);
     toast.success("Version loaded.");
  };

  type Point = { x: number; y: number };
  type Track = Point[];
  const [tracks, setTracks] = useState<{ layer: string; path: Track }[]>(
    loadedProject?.type === "PCB Design" && loadedProject.data?.tracks
      ? loadedProject.data.tracks
      : []
  );

  useEffect(() => {
    if (loadedProject?.type === "PCB Design" && loadedProject.data) {
      if (loadedProject.data.layerVisibility) setLayerVisibility(loadedProject.data.layerVisibility);
      if (loadedProject.data.tracks) setTracks(loadedProject.data.tracks);
    }
  }, [loadedProject]);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Menu Bar */}
      <div className="h-8 flex items-center gap-0 border-b border-border bg-card px-2 shrink-0">
        {menuItems.map((item) => (
          <button
            key={item}
            className="px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          >
            {item}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          {isOwner && (
            <button onClick={handleSaveVersion} title="Commit Version" className="tool-btn text-blue-600 hover:bg-blue-50 align-middle">
              <Save className="w-3.5 h-3.5" />
            </button>
          )}
          
          {activePost && activePost.versions && activePost.versions.length > 0 && (
            <div className="relative group mr-1 inline-block">
              <button className="tool-btn flex items-center gap-1" title="Version History">
                <History className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">{activePost.versions.length}</span>
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-xl hidden group-hover:block z-50 text-left">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">Version History</div>
                {activePost.versions.map(v => (
                  <button key={v.id} onClick={() => handleLoadVersion(v.data)} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 border-b border-slate-100 last:border-0 hover:text-blue-600 transition-colors">
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-[9px] text-slate-400">{new Date(v.createdAt).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button onClick={handleExport} title="Export Gerbers (.zip)" className="tool-btn text-emerald-600 hover:bg-emerald-50 mr-2">
            <Download className="w-3.5 h-3.5" />
          </button>
          
          <button onClick={handleShareButton} className="mr-2 px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors">
            Share to Community
          </button>
          {[ZoomOut, ZoomIn, Move, Crosshair, RotateCw, Grid3X3].map((Icon, i) => (
            <button key={i} className="tool-btn !w-7 !h-7">
              <Icon className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Project / Layers */}
        <div className="w-52 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-2.5 border-b border-border">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-secondary text-xs">
              <Search className="w-3 h-3 text-muted-foreground" />
              <input placeholder="Search..." className="bg-transparent text-[11px] outline-none flex-1 placeholder:text-muted-foreground" />
            </div>
          </div>

          {/* Project Files */}
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-1 px-1.5 py-1 text-[11px] font-semibold text-foreground">
              <ChevronDown className="w-3 h-3" />
              <FolderOpen className="w-3 h-3 text-primary" />
              Project Files
            </div>
            <div className="ml-4 space-y-0.5 mt-0.5">
              {["main_board.pcb", "schematic.sch", "BOM.csv", "gerber_output/"].map((f) => (
                <div key={f} className="flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary rounded cursor-pointer">
                  <File className="w-3 h-3" />
                  <span className="font-mono">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layers */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center gap-1 px-1.5 py-1 text-[11px] font-semibold text-foreground">
              <Layers className="w-3 h-3" />
              Layers
            </div>
            <div className="space-y-0.5 mt-1">
              {layers.map((layer) => (
                <div
                  key={layer.name}
                  onClick={() => setActiveLayer(layer.name)}
                  className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                    activeLayer === layer.name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: layer.color }} />
                  <span className="flex-1 truncate">{layer.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLayerVisibility((p) => ({ ...p, [layer.name]: !p[layer.name] }));
                    }}
                    className="opacity-60 hover:opacity-100"
                  >
                    {layerVisibility[layer.name] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PCB Canvas */}
        <div className="flex-1 pcb-grid relative overflow-hidden" ref={pcbRef}>
          {currentTrack && currentTrack.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={() => {
                  if (currentTrack.length > 1) {
                    setTracks((prev) => [...prev, { layer: activeLayer, path: currentTrack }]);
                  }
                  setCurrentTrack(null);
                  setMousePos(null);
                }}
                className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md shadow-lg hover:bg-primary/90 flex items-center gap-2"
              >
                Finish Track
              </button>
            </div>
          )}

          {/* Board Outline */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div 
              className="w-[500px] h-[340px] border border-emerald-500/40 rounded-sm relative cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setCurrentTrack(prev => prev ? [...prev, { x, y }] : [{ x, y }]);
              }}
              onMouseMove={(e) => {
                if (currentTrack) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
              onMouseLeave={() => setMousePos(null)}
            >
              {/* Copper Traces */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 340">
                {/* Top copper (red) traces */}
                <path d="M 80 60 L 200 60 L 200 120" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 200 120 L 350 120 L 350 200" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 80 200 L 150 200 L 150 280 L 350 280" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* Bottom copper (blue) traces */}
                <path d="M 120 60 L 120 200 L 250 200" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 2" />
                <path d="M 250 200 L 250 60 L 400 60" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 2" />
                {/* Vias */}
                <circle cx="200" cy="120" r="4" fill="#f97316" stroke="#fbbf24" strokeWidth="1" />
                <circle cx="250" cy="200" r="4" fill="#f97316" stroke="#fbbf24" strokeWidth="1" />
                <circle cx="350" cy="200" r="4" fill="#f97316" stroke="#fbbf24" strokeWidth="1" />

                {/* Drawn Tracks */}
                {tracks.map((t, i) => layerVisibility[t.layer] && (
                  <polyline
                    key={i}
                    points={t.path.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={layers.find((l) => l.name === t.layer)?.color || "#fbbf24"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={t.layer === "Bottom Copper" ? "4 2" : "none"}
                  />
                ))}
                {currentTrack && currentTrack.length > 0 && (
                  <polyline
                    points={[...currentTrack, ...(mousePos ? [mousePos] : [])].map(p => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={layers.find(l => l.name === activeLayer)?.color || "#fbbf24"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 2"
                  />
                )}
              </svg>

              {/* IC Component */}
              <div className="absolute left-16 top-10 flex flex-col items-center">
                <div className="w-16 h-20 bg-slate-800 border border-slate-600 rounded-sm relative">
                  <div className="absolute left-0 top-2 space-y-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={`l-${i}`} className="w-2 h-1 bg-slate-400 -ml-1 rounded-r-sm" />
                    ))}
                  </div>
                  <div className="absolute right-0 top-2 space-y-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={`r-${i}`} className="w-2 h-1 bg-slate-400 -mr-1 rounded-l-sm" />
                    ))}
                  </div>
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full border border-slate-400" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-300">ATmega</span>
                  </div>
                </div>
              </div>

              {/* Capacitors */}
              {[{ x: 200, y: 240 }, { x: 240, y: 240 }].map((pos, i) => (
                <div key={i} className="absolute flex flex-col items-center" style={{ left: pos.x, top: pos.y }}>
                  <div className="w-3 h-5 flex flex-col items-center justify-center gap-0.5">
                    <div className="w-3 h-0.5 bg-slate-400" />
                    <div className="w-3 h-0.5 bg-slate-400" />
                  </div>
                  <span className="text-[7px] font-mono text-emerald-400 mt-0.5">100nF</span>
                </div>
              ))}

              {/* Resistors */}
              {[{ x: 330, y: 100 }, { x: 370, y: 100 }].map((pos, i) => (
                <div key={i} className="absolute" style={{ left: pos.x, top: pos.y }}>
                  <div className="w-8 h-3 border border-slate-400 rounded-sm flex items-center justify-center">
                    <span className="text-[6px] font-mono text-fuchsia-300">10K</span>
                  </div>
                </div>
              ))}

              {/* Silkscreen labels */}
              <span className="absolute bottom-2 right-2 text-[8px] font-mono text-yellow-400/60">ProtoLab PCB v1.0</span>
              <span className="absolute top-2 right-2 text-[8px] font-mono text-yellow-400/40">Rev A</span>
            </div>
          </div>

          {/* Layer Stack Widget */}
          <div className="absolute bottom-3 left-3 panel-lg p-2 space-y-1 bg-canvas-dark border-slate-700">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Layer Stack</span>
            {layers.filter((l) => layerVisibility[l.name]).map((l) => (
              <div key={l.name} className="flex items-center gap-1.5">
                <div className="w-16 h-1 rounded-full" style={{ backgroundColor: l.color, opacity: 0.7 }} />
                <span className="text-[8px] font-mono text-slate-400">{l.name}</span>
              </div>
            ))}
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-3 right-3 panel px-2 py-1 text-[10px] font-mono text-muted-foreground">
            X: 142.5mm Y: 89.2mm
          </div>
        </div>

        {/* Right Panel - Inspector */}
        <div className="w-52 border-l border-border bg-card flex flex-col shrink-0">
          <div className="px-3 py-2 border-b border-border">
            <h3 className="text-[11px] font-semibold">Properties</h3>
          </div>
          <div className="p-3 space-y-3 text-[11px]">
            <div>
              <label className="text-muted-foreground text-[9px] uppercase tracking-wider font-medium">Selected</label>
              <p className="font-medium mt-0.5">ATmega328P-AU</p>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-[9px] uppercase tracking-wider font-medium">Net Info</label>
              {[
                ["Designator", "U1"],
                ["Package", "TQFP-32"],
                ["Layer", "Top"],
                ["Rotation", "0°"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-0.5 border-b border-border">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-[9px] uppercase tracking-wider font-medium">Design Rules</label>
              {[
                ["Clearance", "0.2mm"],
                ["Trace Width", "0.25mm"],
                ["Via Size", "0.6mm"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-0.5 border-b border-border">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono text-accent">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        previewImage={sharePreviewUrl} 
        isLoadingPreview={isGeneratingPreview} 
        onConfirm={handleConfirmShare} 
      />
    </div>
  );
};

export default PCBDesigner;
