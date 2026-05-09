import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { ShareModal } from "@/features/simulation/components/share-modal";
import html2canvas from "html2canvas";
import {
  File, FolderOpen, ChevronDown, ChevronRight, Play, Upload, Settings,
  Terminal, X, Maximize2, Minimize2, Code2, Plus, RefreshCw, Layers, History, Save, Download
} from "lucide-react";

const files = [
  { name: "main.ino", type: "file", active: true },
  { name: "sensors.h", type: "file" },
  { name: "motor_control.cpp", type: "file" },
  { name: "config.h", type: "file" },
  { name: "libraries/", type: "folder", children: ["Wire.h", "Servo.h", "SPI.h"] },
];

const CodingLab = () => {
  const [libOpen, setLibOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const { currentUser, addPost, loadedProject, posts } = useStore();
  const codeRef = useRef<HTMLDivElement>(null);

  const activePost = loadedProject?.id ? posts.find(p => p.id === loadedProject.id) : null;
  const isOwner = activePost?.userId === currentUser?.id;

  const [code, setCode] = useState(
    loadedProject?.type === "Code" && typeof loadedProject.data === "string" 
      ? loadedProject.data 
      : `#include <Arduino.h>\n#include "sensors.h"\n\n// Pin definitions\n#define LED_PIN     13\n#define SENSOR_PIN  A0\n#define MOTOR_PIN   9\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(LED_PIN, OUTPUT);\n  pinMode(SENSOR_PIN, INPUT);\n  pinMode(MOTOR_PIN, OUTPUT);\n  \n  Serial.println("ProtoLab initialized!");\n}\n\nvoid loop() {\n  int sensorValue = analogRead(SENSOR_PIN);\n  float voltage = sensorValue * (5.0 / 1023.0);\n  \n  Serial.print("Voltage: ");\n  Serial.println(voltage);\n  \n  if (voltage > 2.5) {\n    digitalWrite(LED_PIN, HIGH);\n    analogWrite(MOTOR_PIN, 200);\n  } else {\n    digitalWrite(LED_PIN, LOW);\n    analogWrite(MOTOR_PIN, 0);\n  }\n  \n  delay(100);\n}`
  );

  useEffect(() => {
    if (loadedProject?.type === "Code" && typeof loadedProject.data === "string") {
      setCode(loadedProject.data);
    }
  }, [loadedProject]);

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
      if (codeRef.current) {
        await new Promise(r => setTimeout(r, 100));
        const canvas = await html2canvas(codeRef.current, {
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
      type: "Code",
      title: meta.title,
      data: code, // Raw string or rich object depending on needs, string is fine
      preview: "", // Code posts don't need a visual preview
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
     useStore.getState().saveVersion(activePost.id, vName, code);
     toast.success("Version saved!");
  };

  const handleExport = () => {
     const dataStr = "data:text/x-arduino;charset=utf-8," + encodeURIComponent(code);
     const dlAnchorElem = document.createElement('a');
     dlAnchorElem.setAttribute("href", dataStr);
     dlAnchorElem.setAttribute("download", `${activePost?.title?.replace(/\s+/g,'_') || 'sketch'}.ino`);
     dlAnchorElem.click();
  };

  const handleLoadVersion = (vData: any) => {
     if (typeof vData === "string") setCode(vData);
     toast.success("Version loaded.");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-10 border-b border-border bg-card flex items-center px-3 gap-2 shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-accent text-accent-foreground">
          <Play className="w-3 h-3" /> Run
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Settings className="w-3 h-3" /> Compile
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground">
          <Upload className="w-3 h-3" /> Upload
        </button>

          <div className="w-px h-6 bg-slate-200 mx-3" />
          
          {isOwner && (
            <button onClick={handleSaveVersion} title="Commit Version" className="tool-btn text-blue-600 hover:bg-blue-50 mr-1">
              <Save className="w-4 h-4" />
            </button>
          )}
          
          {activePost && activePost.versions && activePost.versions.length > 0 && (
            <div className="relative group mr-1">
              <button className="tool-btn flex items-center gap-1" title="Version History">
                <History className="w-4 h-4" />
                <span className="text-[10px] font-bold">{activePost.versions.length}</span>
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-xl hidden group-hover:block z-50">
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
          
          <button onClick={handleExport} title="Export Project (.ino)" className="tool-btn text-emerald-600 hover:bg-emerald-50 mr-3">
            <Download className="w-4 h-4" />
          </button>

        <button onClick={handleShareButton} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200">
          Share to Community
        </button>
        <div className="flex-1" />
        <span className="text-[10px] font-mono text-muted-foreground">Arduino Uno · COM3 · 9600 baud</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-48 border-r border-border bg-card flex flex-col shrink-0">
          <div className="px-3 py-2 border-b border-border text-[11px] font-semibold flex items-center gap-1.5">
            <FolderOpen className="w-3 h-3 text-primary" />
            Explorer
          </div>
          <div className="p-1.5 space-y-0.5">
            {files.map((f) =>
              f.type === "folder" ? (
                <div key={f.name}>
                  <button
                    onClick={() => setLibOpen(!libOpen)}
                    className="flex items-center gap-1.5 w-full px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                  >
                    {libOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <FolderOpen className="w-3 h-3 text-primary/60" />
                    <span className="font-mono">{f.name}</span>
                  </button>
                  {libOpen && f.children?.map((c) => (
                    <div key={c} className="flex items-center gap-1.5 ml-6 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary rounded cursor-pointer">
                      <File className="w-3 h-3" />
                      <span className="font-mono">{c}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  key={f.name}
                  className={`flex items-center gap-1.5 px-2 py-1 text-[11px] rounded cursor-pointer ${
                    f.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <File className="w-3 h-3" />
                  <span className="font-mono">{f.name}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Editor + Console */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-8 border-b border-border bg-card flex items-center px-2 gap-0.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background rounded-t-md text-[11px] font-medium border border-border border-b-0">
              <File className="w-3 h-3 text-primary" />
              <span className="font-mono">main.ino</span>
              <X className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer ml-2" />
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-auto bg-[#fafbfc]" ref={codeRef}>
            <div className="flex">
              {/* Line numbers */}
              <div className="py-3 px-3 text-right select-none shrink-0">
                {code.split("\n").map((_, i) => (
                  <div key={i} className="text-[11px] leading-5 font-mono text-muted-foreground/50">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code */}
              <pre className="py-3 pr-4 flex-1 overflow-x-auto">
                <code className="text-[11px] leading-5 font-mono text-foreground whitespace-pre">
                  {code}
                </code>
              </pre>
            </div>
          </div>

          {/* Console */}
          {consoleOpen && (
            <div className="h-36 border-t border-border bg-card flex flex-col shrink-0">
              <div className="h-7 flex items-center justify-between px-3 border-b border-border shrink-0">
                <div className="flex items-center gap-1.5 text-[11px] font-medium">
                  <Terminal className="w-3 h-3" />
                  Output
                </div>
                <button onClick={() => setConsoleOpen(false)}>
                  <Minimize2 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="flex-1 p-2 overflow-auto font-mono text-[11px] leading-5 text-muted-foreground">
                <div className="text-accent">Compiling sketch...</div>
                <div>Sketch uses 4,532 bytes (14%) of program storage space.</div>
                <div>Global variables use 230 bytes (11%) of dynamic memory.</div>
                <div className="text-accent">Upload complete.</div>
                <div>Voltage: 3.21</div>
                <div>Voltage: 3.18</div>
                <div>Voltage: 2.94</div>
              </div>
            </div>
          )}
          {!consoleOpen && (
            <div className="h-7 border-t border-border bg-card flex items-center px-3 shrink-0">
              <button onClick={() => setConsoleOpen(true)} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground">
                <Terminal className="w-3 h-3" />
                Output
                <Maximize2 className="w-3 h-3 ml-1" />
              </button>
            </div>
          )}
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

export default CodingLab;
