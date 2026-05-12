import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Cpu, Users, FolderGit2, MessageSquare, 
  Box, Code2, Zap, Clock, History, TrendingUp,
  Command, ChevronRight, CornerDownLeft, Sparkles,
  CircuitBoard, Bot
} from 'lucide-react';
import { useStore, Post, User } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { SafeIcon } from '@/components/ui/safe-icon';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { posts, users, triggerAI } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search Logic
  const results = useMemo(() => {
    if (!query) return [];
    
    const q = query.toLowerCase();
    const matchedProjects = posts.filter(p => 
      p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
    ).map(p => ({ ...p, resultType: 'project' as const }));

    const matchedUsers = users.filter(u => 
      u.username.toLowerCase().includes(q) || u.bio?.toLowerCase().includes(q)
    ).map(u => ({ ...u, resultType: 'user' as const }));

    return [...matchedProjects, ...matchedUsers].slice(0, 10);
  }, [query, posts, users]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) handleSelect(results[selectedIndex]);
        else if (query) handleAISearch();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query]);

  const handleSelect = (item: any) => {
    if (item.resultType === 'project') navigate(`/project/${item.id}`);
    else if (item.resultType === 'user') navigate(`/profile/${item.username}`);
    onClose();
  };

  const handleAISearch = () => {
    triggerAI(`Researching engineering topics related to: ${query}. Please provide technical context and related components.`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col"
          >
            {/* Search Input Area */}
            <div className="p-6 flex items-center gap-4 bg-secondary/20 border-b border-border/50">
              <Search className="w-6 h-6 text-primary" />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, engineers, components..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-muted-foreground/50 text-foreground"
              />
              <div className="flex items-center gap-2 px-2 py-1 bg-background border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Command size={10} /> K
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {query ? (
                <div className="p-4 space-y-2">
                  <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Results</h3>
                  {results.length > 0 ? results.map((item: any, i) => (
                    <button
                      key={item.id || item.username}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        selectedIndex === i ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'hover:bg-secondary/50 text-foreground'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedIndex === i ? 'bg-white/20' : 'bg-secondary'}`}>
                        {item.resultType === 'project' ? (
                          <SafeIcon icon={item.type === 'Simulation' ? Zap : item.type === 'Code' ? Code2 : Box} size={20} />
                        ) : (
                          <SafeIcon icon={Users} size={20} />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-black truncate">{item.title || item.username}</p>
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${selectedIndex === i ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {item.resultType === 'project' ? `${item.type} • ${item.complexity}` : `Engineer • ${item.followers} Followers`}
                        </p>
                      </div>
                      {selectedIndex === i && <CornerDownLeft size={16} className="text-white/50" />}
                    </button>
                  )) : (
                    <button 
                      onClick={handleAISearch}
                      className="w-full flex items-center gap-4 p-6 rounded-3xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all group"
                    >
                      <Bot size={24} className="group-hover:rotate-12 transition-transform" />
                      <div className="text-left">
                        <p className="text-sm font-black">No results found. Ask Proto AI?</p>
                        <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">Research "{query}" with engineering intelligence</p>
                      </div>
                      <Sparkles size={16} className="ml-auto" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Recent Searches */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <History size={12} /> Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {['Robotic Arm Inverse Kinematics', 'ESP32 MQTT Hub', 'High Current ESC'].map(s => (
                        <button key={s} onClick={() => setQuery(s)} className="w-full text-left p-3 rounded-xl hover:bg-secondary/50 text-sm font-bold text-foreground flex items-center justify-between group">
                          {s}
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-30" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Topics */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <TrendingUp size={12} /> Trending Engineering
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['STM32', 'LoRaWAN', 'PID Control', 'FOC Drivers', 'LiPo Safety'].map(t => (
                        <button key={t} onClick={() => setQuery(t)} className="px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-secondary/20 border-t border-border/50 flex items-center justify-between px-8">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1"><ArrowUpDown size={12} /> Navigate</span>
                <span className="flex items-center gap-1"><CornerDownLeft size={12} /> Select</span>
                <span className="flex items-center gap-1"><kbd className="bg-background border border-border px-1 rounded">ESC</kbd> Close</span>
              </div>
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                <SafeIcon icon={Bot} size={12} /> Powered by Proto AI
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function ArrowUpDown({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>
    </svg>
  );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
