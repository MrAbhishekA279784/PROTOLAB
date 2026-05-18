import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Send, 
  Bot, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Activity,
  Trash2,
  Settings,
  MoreVertical,
  ChevronRight,
  Terminal,
  Code2,
  Sparkles,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProtoAIResponse } from "../../knowledge/proto-ai-engine";
import { useStore } from "@/store/useStore";

interface Message {
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  { label: "Check Circuit", icon: ShieldAlert, prompt: "Can you analyze my current circuit for any safety issues?" },
  { label: "Explain Circuit", icon: Activity, prompt: "Explain Circuit" },
  { label: "Debug Arduino Code", icon: Terminal, prompt: "Debug Arduino Code" },
  { label: "Recommend Components", icon: Cpu, prompt: "Recommend Components" },
  { label: "Optimize Wiring", icon: Zap, prompt: "Optimize Wiring" },
  { label: "Generate Starter Sketch", icon: Code2, prompt: "Generate Starter Sketch" },
  { label: "Suggest Better Design", icon: Sparkles, prompt: "Suggest Better Design" },
];

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const { loadedProject, aiTrigger, clearAITrigger, aiOrbPosition } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "### Initialization Complete\n\nGreetings. I am **Proto AI**, your advanced engineering copilot. My systems are synchronized with your workspace. \n\nI can analyze your circuit logic, suggest component optimizations, and debug your embedded code. How shall we proceed with your engineering project today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Position calculation relative to orb
  const windowRight = isMaximized ? "5vw" : `calc(24px - ${aiOrbPosition?.x || 0}px)`;
  const windowBottom = isMaximized ? "7.5vh" : `calc(96px - ${aiOrbPosition?.y || 0}px)`;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Focus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  const handleSend = React.useCallback(async (textOverride?: string) => {
    const msgText = (textOverride || input).trim();
    if (!msgText || isThinking) return;

    const userMsg: Message = { role: "user", text: msgText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate streaming feel
    setTimeout(() => {
      const response = getProtoAIResponse(msgText, loadedProject);
      const aiMsg: Message = { role: "ai", text: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1000);
  }, [input, isThinking, loadedProject]);

  // Listen to external AI triggers
  const lastProcessedTrigger = useRef<number>(0);
  useEffect(() => {
    if (aiTrigger && isOpen && aiTrigger.timestamp > lastProcessedTrigger.current) {
       lastProcessedTrigger.current = aiTrigger.timestamp;
       handleSend(aiTrigger.prompt);
       clearAITrigger();
    }
  }, [aiTrigger, isOpen, handleSend, clearAITrigger]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (text: string) => {
    // Handle code blocks
    if (text.includes('```')) {
      const parts = text.split('```');
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          const lines = part.split('\n');
          const lang = lines[0].trim();
          const code = lines.slice(1).join('\n').trim();
          return (
            <div key={i} className="my-4 rounded-xl overflow-hidden border border-border bg-slate-950 shadow-inner">
               <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-border/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{lang || 'CODE'}</span>
                  <button className="text-[9px] font-bold text-muted-foreground hover:text-white transition-colors">COPY</button>
               </div>
               <pre className="p-4 overflow-x-auto custom-scrollbar">
                  <code className="text-[12px] font-mono text-emerald-400 leading-relaxed">{code}</code>
               </pre>
            </div>
          );
        }
        return renderTextContent(part, i);
      });
    }

    return renderTextContent(text, 0);
  };

  const renderTextContent = (text: string, keyPrefix: number) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const key = `${keyPrefix}-${i}`;
      // Engineering Alert Rendering
      if (line.startsWith('### ⚠️') || line.startsWith('### ⚡') || line.startsWith('### 🚨') || line.startsWith('### 📏')) {
        const icon = line.includes('⚠️') ? <ShieldAlert className="w-5 h-5 text-amber-500" /> : 
                     line.includes('⚡') ? <Zap className="w-5 h-5 text-yellow-500" /> : 
                     line.includes('🚨') ? <Activity className="w-5 h-5 text-red-500" /> : 
                     <Cpu className="w-5 h-5 text-primary" />;
        
        return (
          <div key={key} className="my-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 animate-in fade-in slide-in-from-left-2">
            <div className="shrink-0">{icon}</div>
            <div className="flex-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">{line.replace('### ', '').replace(/[⚠️⚡🚨📏]/g, '').trim()}</h3>
              <p className="text-[10px] text-muted-foreground font-bold leading-tight uppercase tracking-widest opacity-60">Critical Insight</p>
            </div>
          </div>
        );
      }

      if (line.startsWith('### ')) {
        return <h3 key={key} className="text-primary font-black tracking-tight text-lg mt-6 mb-3 flex items-center gap-2">
          <div className="w-1 h-6 bg-primary/20 rounded-full" />
          {line.replace('### ', '')}
        </h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={key} className="text-foreground font-bold text-sm mt-4 mb-2">{line.replace('#### ', '')}</h4>;
      }
      
      if (line.trim().startsWith('- ')) {
        return <div key={key} className="flex gap-2 my-1.5 pl-2">
          <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
          <p className="text-[13px] text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: processInlines(line.replace('- ', '')) }} />
        </div>;
      }

      return <p key={key} className="my-1.5 text-[13px] text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: processInlines(line) }} />;
    });
  };

  const processInlines = (line: string) => {
    return line
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-primary/80">$1</span>')
      .replace(/`(.*?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-primary font-mono text-[11px]">$1</code>');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag={!isMaximized}
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            width: isMaximized ? "90vw" : "420px",
            height: isMaximized ? "85vh" : "600px",
            right: windowRight,
            bottom: windowBottom
          }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "fixed z-[110] flex flex-col overflow-hidden",
            "bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]",
            "selection:bg-primary/10"
          )}
        >
          {/* Elegant Header */}
          <div className="h-14 flex items-center justify-between px-5 bg-gradient-to-r from-background to-secondary/30 border-b border-border cursor-grab active:cursor-grabbing shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" 
                />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-foreground leading-none">Proto AI</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Engineering Copilot Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar for Categories (Desktop/Maximized only) */}
            <AnimatePresence>
              {isMaximized && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-r border-border bg-secondary/20 p-4 space-y-6 overflow-y-auto custom-scrollbar shrink-0"
                >
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">Engineering Core</h3>
                    <div className="space-y-1">
                      {['Electronics', 'Electrical', 'Mechatronics', 'Embedded/IoT', 'PCB Design', 'Sim Analysis'].map(cat => (
                        <button key={cat} className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-between group">
                          {cat}
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500/70 mb-3 px-2">Recent Schematics</h3>
                    <div className="space-y-2">
                       <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                          <p className="text-[11px] font-bold text-foreground">ESP32_Blinker.ino</p>
                          <p className="text-[9px] text-muted-foreground">Modified 2m ago</p>
                       </div>
                       <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                          <p className="text-[11px] font-bold text-foreground">Motor_Driver_V1.pcb</p>
                          <p className="text-[9px] text-muted-foreground">Modified 15m ago</p>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col overflow-hidden relative">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-4",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border shadow-sm",
                      msg.role === 'user' 
                        ? "bg-secondary border-border" 
                        : "bg-primary/10 border-primary/20"
                    )}>
                      {msg.role === 'user' ? <div className="text-[10px] font-bold text-muted-foreground">ME</div> : <Bot className="w-4 h-4 text-primary" />}
                    </div>
                    
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white dark:bg-slate-900 border border-border rounded-tl-none"
                    )}>
                      <div className="chat-content">
                        {renderMarkdown(msg.text)}
                      </div>
                      <div className="mt-2 text-[9px] opacity-40 font-bold uppercase tracking-widest text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isThinking && (
                   <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                     </div>
                     <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl rounded-tl-none px-5 py-3 flex items-center gap-3 shadow-sm">
                        <div className="flex gap-1">
                           {[0, 1, 2].map(dot => (
                             <motion.div
                               key={dot}
                               animate={{ y: [0, -3, 0] }}
                               transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
                               className="w-1.5 h-1.5 bg-primary/40 rounded-full"
                             />
                           ))}
                        </div>
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Analyzing Engineering Workspace...</span>
                     </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Fixes overlay */}
              <AnimatePresence>
                {!isThinking && messages.length > 1 && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-4 left-6 right-6 p-4 rounded-2xl bg-primary/5 backdrop-blur-md border border-primary/20 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Proactive Insights</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button className="text-left px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900 border border-border text-[10px] text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                          Add 0.1µF Decoupling Capacitor
                       </button>
                       <button className="text-left px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900 border border-border text-[10px] text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                          Use Logic Level Shifter (3.3V ↔ 5V)
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Prompt Suggestions */}
          {messages.length < 3 && (
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.prompt)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary hover:bg-primary/10 transition-all whitespace-nowrap group"
                >
                  <p.icon className="w-3 h-3 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-secondary/10 border-t border-border">
            <div className="relative flex items-end gap-3 bg-white dark:bg-slate-900 border border-border rounded-2xl p-3 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your engineering copilot..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60 resize-none max-h-32 min-h-[24px] py-1 custom-scrollbar"
                rows={1}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isThinking}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                  input.trim() && !isThinking 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95" 
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5" strokeWidth={2} />
              </button>
              
              <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-md bg-secondary border border-border text-[8px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                 <Command className="w-2.5 h-2.5" /> Core Protocol v2.5
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
               <div className="flex items-center gap-4">
                  <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                    <Trash2 className="w-3 h-3" /> Reset
                  </button>
                  <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                    <Settings className="w-3 h-3" /> Config
                  </button>
               </div>
               <p className="text-[9px] text-muted-foreground/40 font-medium">Shift + Enter for new line</p>
            </div>
          </div>

          {/* Modern Scanning Effect */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/10 to-transparent z-[120] pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
