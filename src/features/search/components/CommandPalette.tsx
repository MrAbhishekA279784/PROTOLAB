import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Cpu, Users, FolderGit2,
  Box, Code2, Zap,
  Command, CornerDownLeft, Sparkles,
  Bot, Home, Bell, Settings, Plus, LayoutGrid
} from 'lucide-react';
import { useStore } from '@/store/useStore';
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

  // Pre-defined Actions
  const quickActions = useMemo(() => [
    { id: 'home', icon: Home, label: 'Open ProtoCode', action: () => navigate('/') },
    { id: 'community', icon: Users, label: 'Open Community', action: () => navigate('/community') },
    { id: 'new-repo', icon: FolderGit2, label: 'Create Repository', action: () => { /* open repo modal */ onClose(); } },
    { id: 'new-project', icon: Plus, label: 'New Project', action: () => { navigate('/'); onClose(); } },
    { id: 'dashboard', icon: LayoutGrid, label: 'Open Dashboard', action: () => navigate('/profile/me') },
    { id: 'notifications', icon: Bell, label: 'Open Notifications', action: () => navigate('/notifications') },
    { id: 'settings', icon: Settings, label: 'Open Settings', action: () => { /* go to settings */ onClose(); } },
  ], [navigate, onClose]);

  const aiCommands = useMemo(() => [
    { id: 'ai-ask', icon: Bot, label: 'Ask engineering question', action: () => triggerAI('I have an engineering question: ') },
    { id: 'ai-gen', icon: Code2, label: 'Generate starter code', action: () => triggerAI('Generate starter code for ') },
    { id: 'ai-explain', icon: Box, label: 'Explain repository', action: () => triggerAI('Explain how this repository works') },
    { id: 'ai-recommend', icon: Cpu, label: 'Recommend components', action: () => triggerAI('Recommend compatible components for ') },
    { id: 'ai-debug', icon: Zap, label: 'Debug issue', action: () => triggerAI('Help me debug an issue with ') },
  ], [triggerAI]);

  // Combined Results List
  const results = useMemo(() => {
    const q = query.toLowerCase();
    const list: any[] = [];
    
    if (!q) {
      // Empty state
      list.push({ type: 'group', label: 'Quick Actions' });
      list.push(...quickActions.slice(0, 5).map(a => ({ ...a, resultType: 'action' })));
      list.push({ type: 'group', label: 'Proto AI Commands' });
      list.push(...aiCommands.slice(0, 3).map(a => ({ ...a, resultType: 'ai-action' })));
    } else {
      // Filter actions
      const matchedActions = quickActions.filter(a => a.label.toLowerCase().includes(q));
      if (matchedActions.length > 0) {
        list.push({ type: 'group', label: 'Commands' });
        list.push(...matchedActions.map(a => ({ ...a, resultType: 'action' })));
      }

      // Filter AI commands
      const matchedAI = aiCommands.filter(a => a.label.toLowerCase().includes(q));
      if (matchedAI.length > 0) {
        list.push({ type: 'group', label: 'Proto AI' });
        list.push(...matchedAI.map(a => ({ ...a, resultType: 'ai-action' })));
      }

      // Filter Projects
      const matchedProjects = posts.filter(p => 
        p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
      );
      if (matchedProjects.length > 0) {
        list.push({ type: 'group', label: 'Projects & Repositories' });
        list.push(...matchedProjects.slice(0, 5).map(p => ({ ...p, resultType: 'project' })));
      }

      // Filter Users
      const matchedUsers = users.filter(u => 
        u.username.toLowerCase().includes(q) || u.bio?.toLowerCase().includes(q)
      );
      if (matchedUsers.length > 0) {
        list.push({ type: 'group', label: 'Engineers' });
        list.push(...matchedUsers.slice(0, 5).map(u => ({ ...u, resultType: 'user' })));
      }
    }
    
    return list;
  }, [query, posts, users, quickActions, aiCommands]);

  const selectableItems = useMemo(() => results.filter(r => r.type !== 'group'), [results]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (selectableItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (selectableItems.length || 1)) % (selectableItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = selectableItems[selectedIndex];
        if (item) {
          handleSelect(item);
        } else if (query) {
          triggerAI(`Help me with: ${query}`);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectableItems, selectedIndex, query, triggerAI, onClose]);

  const handleSelect = (item: any) => {
    if (item.resultType === 'action' || item.resultType === 'ai-action') {
      item.action();
      onClose();
    } else if (item.resultType === 'project') {
      navigate(`/project/${item.id}`);
      onClose();
    } else if (item.resultType === 'user') {
      navigate(`/profile/${item.username}`);
      onClose();
    }
  };

  let itemIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-2xl bg-card/95 backdrop-blur-2xl border border-border/50 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden flex flex-col ring-1 ring-white/10"
          >
            {/* Search Input Area */}
            <div className="p-4 flex items-center gap-3 border-b border-border/50 bg-secondary/10">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-lg font-bold placeholder:text-muted-foreground/50 text-foreground"
              />
              <div className="flex items-center gap-1.5 px-2 py-1 bg-background border border-border/50 rounded-md text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                <Command size={12} /> K
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
              {results.length > 0 ? results.map((item: any, i) => {
                if (item.type === 'group') {
                  return (
                    <div key={`group-${i}`} className="px-3 pt-4 pb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                      {item.label}
                    </div>
                  );
                }

                itemIndex++;
                const isSelected = selectedIndex === itemIndex;

                return (
                  <button
                    key={item.id || item.username || i}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all relative overflow-hidden group ${
                      isSelected ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-secondary/40 text-foreground'
                    }`}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="active-command"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    
                    <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected 
                        ? item.resultType === 'ai-action' ? 'bg-purple-500/20 text-purple-500' : 'bg-primary text-white shadow-[0_0_15px_rgba(79,107,255,0.4)]' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {item.resultType === 'action' || item.resultType === 'ai-action' ? (
                        <SafeIcon icon={item.icon} size={18} />
                      ) : item.resultType === 'project' ? (
                        <SafeIcon icon={item.type === 'Simulation' ? Zap : item.type === 'Code' ? Code2 : Box} size={18} />
                      ) : (
                        <SafeIcon icon={Users} size={18} />
                      )}
                    </div>

                    <div className="relative z-10 flex-1 text-left min-w-0">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
                        {item.label || item.title || item.username}
                      </p>
                      <p className={`text-[10px] uppercase font-bold tracking-widest ${isSelected ? 'text-primary/70' : 'text-muted-foreground/70'}`}>
                        {item.resultType === 'action' ? 'Quick Action' : 
                         item.resultType === 'ai-action' ? 'Proto AI' :
                         item.resultType === 'project' ? `${item.type} • ${item.complexity}` : 
                         `Engineer`}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="relative z-10 flex items-center text-primary/50 gap-2 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Execute</span>
                        <CornerDownLeft size={14} />
                      </div>
                    )}
                  </button>
                );
              }) : (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">No results found for "{query}"</p>
                  <p className="text-xs text-muted-foreground mb-6">Try searching for a different command, project, or engineer.</p>
                  
                  <button 
                    onClick={() => { triggerAI(`Help me with: ${query}`); onClose(); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-sm"
                  >
                    <Sparkles size={16} /> Ask Proto AI instead
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-card/80 border-t border-border/50 flex items-center justify-between px-6 rounded-b-3xl">
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-secondary">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-secondary">↓</kbd> Navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-secondary">↵</kbd> Select</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-secondary">ESC</kbd> Close</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-500/70 font-black text-[9px] uppercase tracking-widest">
                <SafeIcon icon={Bot} size={10} /> Proto AI Integrated
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
