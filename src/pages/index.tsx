import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Cpu, CircuitBoard, Code2, Bot, ShoppingBag, Users, Sun, Moon, Home } from "lucide-react";
import SimulationLab from "@/features/simulation/components/simulation-lab";
import PCBDesigner from "@/features/pcb/components/pcb-designer";
import ProtoCodeStudio from "@/features/protocode-studio/ProtoCodeStudio";
import AIAssistant from "@/features/ai/components/ai-assistant";
import StorePage from "@/features/store/components/store-page";
import CommunityFeed from "@/features/community/components/community-feed";
import HomePage from "@/features/homepage/HomePage";
import { AuthButtons } from "@/components/auth/auth-modals";
import { OnboardingTour } from "@/components/layout/onboarding-tour";
import { useStore, Post } from "@/store/useStore";

const modes = [
  { id: "home", label: "Home", icon: Home },
  { id: "store", label: "Store", icon: ShoppingBag },
  { id: "sim", label: "Simulation", icon: Cpu },
  { id: "pcb", label: "PCB LAB", icon: CircuitBoard },
  { id: "code", label: "Code Lab", icon: Code2 },
  { id: "community", label: "Community", icon: Users },
] as const;

type Mode = (typeof modes)[number]["id"] | "ai";

const Index = () => {
  const location = useLocation();
  const [activeMode, setActiveMode] = useState<Mode>(location.state?.targetMode || "home");
  const { loadProject, theme, setTheme } = useStore();
  
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleViewProject = (post: Post) => {
    let targetMode: Mode = "sim";
    if (post.type === "Code") targetMode = "code";
    if (post.type === "PCB Design") targetMode = "pcb";
    
    loadProject(post.type, post.data, post.id);
    setActiveMode(targetMode);
  };
  
  const [isAIOpen, setIsAIOpen] = useState(false);
  // Drag state for AI Button
  const [aiPos, setAiPos] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setAiPos({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Global Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-card shrink-0 relative">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Cpu className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:inline-block">ProtoLab</span>
        </div>
        
        <nav className="flex-1 max-w-[50vw] sm:max-w-none overflow-x-auto no-scrollbar mx-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-1.5 snap-x">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            const isStore = mode.id === "store";
            
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`shrink-0 snap-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? (isStore ? "bg-primary text-primary-foreground font-bold shadow-[0_4px_10px_rgba(79,107,255,0.3)] shadow-primary/30 scale-105" : "bg-primary text-primary-foreground font-semibold shadow-md scale-105")
                    : (isStore ? "text-primary hover:bg-primary/10 font-semibold hover:scale-105 hover:shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary font-medium hover:scale-105")
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground border-r border-border pr-4">
            <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent-foreground font-medium">v0.2 Beta</span>
          </div>
          <AuthButtons />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <div key={activeMode} className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards relative z-10">
          {activeMode === "home" && <HomePage onNavigate={(mode) => setActiveMode(mode as Mode)} />}
          {activeMode === "sim" && <SimulationLab />}
          {activeMode === "pcb" && <PCBDesigner />}
          {activeMode === "code" && <ProtoCodeStudio />}
          {activeMode === "store" && <StorePage />}
          {activeMode === "community" && <CommunityFeed onViewProject={handleViewProject} />}
        </div>
        
        {/* Onboarding Tour Overlay */}
        <OnboardingTour />
        
        {/* AI Assistant Drawer */}
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

        {/* Floating AI Button */}
        <button
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setIsDragging(true);
            dragStart.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            };
            if (!aiPos) {
              setAiPos({ x: rect.left, y: rect.top });
            }
          }}
          onClick={() => {
            if (!isDragging) {
              setIsAIOpen(true);
            }
          }}
          style={aiPos ? { left: aiPos.x, top: aiPos.y } : { right: 24, bottom: 24 }}
          className={`fixed w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center z-50 transition-transform duration-200 ease-out border border-primary/30 ${
            isDragging 
              ? "cursor-grabbing scale-[1.05] shadow-[0_10px_25px_rgba(37,99,235,0.6)]" 
              : "cursor-grab hover:scale-[1.05] hover:shadow-[0_8px_20px_rgba(37,99,235,0.5)] shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
          }`}
        >
          <Bot className="w-8 h-8 pointer-events-none drop-shadow-sm" />
        </button>
      </div>
    </div>
  );
};

export default Index;
