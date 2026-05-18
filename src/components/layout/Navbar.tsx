import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Bell, Settings, User, LogOut, 
  Search, Menu, X, Zap, Star, Shield, 
  ShoppingBag, Users, MessageSquare, Plus,
  Sun, Moon
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AuthButtons } from '@/components/auth/auth-modals';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { CommandPalette } from '@/features/search/components/CommandPalette';
import { SafeIcon } from '@/components/ui/safe-icon';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentUser, notifications, theme, setTheme } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-[100] transition-all">
      <div className="flex items-center gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(79,107,255,0.5)] transition-all">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter text-foreground group-hover:text-primary transition-colors">
              ProtoLab
            </span>
          </Link>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-1 bg-secondary/30 p-1 rounded-xl border border-border/30">
          <NavLink to="/" active={location.pathname === '/'}>Workspace</NavLink>
          <NavLink to="/community" active={location.pathname === '/community'}>Community</NavLink>
          <NavLink to="/store" active={location.pathname === '/store'}>Store</NavLink>
          <NavLink to="/graphify" active={location.pathname === '/graphify'}>Graphify</NavLink>
        </nav>

        {/* Global Search Trigger */}
        <button 
          onClick={() => setShowSearch(true)}
          className="hidden md:flex items-center gap-3 px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all w-64 group"
        >
          <Search size={16} className="group-hover:text-primary transition-colors" />
          <span className="text-xs font-bold flex-1 text-left">Search projects...</span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-background border border-border rounded text-[9px] font-black opacity-50">
            <Command size={8} /> K
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Global Actions */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/30 rounded-xl border border-border/30">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="w-px h-4 bg-border/50 mx-1" />

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-all relative ${showNotifications ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[9px] font-black text-white rounded-full flex items-center justify-center border-2 border-card shadow-lg"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-border/50 mx-2 hidden sm:block" />

        <AuthButtons />

        {currentUser && (
          <Link to={`/profile/${currentUser.username}`}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 border-2 border-background shadow-lg flex items-center justify-center overflow-hidden"
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[14px] font-black text-white uppercase">{currentUser.username[0]}</span>
              )}
            </motion.div>
          </Link>
        )}
      </div>

      <CommandPalette isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </header>
  );
};

const NavLink = ({ to, active, children }: { to: string, active: boolean, children: React.ReactNode }) => (
  <Link 
    to={to} 
    className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
      active 
      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
    }`}
  >
    {children}
  </Link>
);
