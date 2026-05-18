import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, Trash2, Filter, Inbox, Settings, 
  Search, Clock, Zap, Star, MessageSquare, UserPlus,
  Share2, ChevronRight, Activity, TrendingUp
} from 'lucide-react';
import { useStore, AppNotification, NotificationType } from '@/store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { Navbar } from '@/components/layout/Navbar';
import { SafeIcon } from '@/components/ui/safe-icon';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions' | 'updates'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' 
        || (activeTab === 'unread' && !n.read)
        || (activeTab === 'mentions' && n.type === 'Mention')
        || (activeTab === 'updates' && n.type === 'ProjectUpdate');
      return matchesSearch && matchesTab;
    });
  }, [notifications, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2 flex items-center gap-3">
                <Bell className="text-primary" size={28} />
                Notifications
              </h1>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Manage your engineering alerts</p>
            </div>

            <nav className="space-y-1">
              <FilterLink active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={Inbox} count={notifications.length}>All Activity</FilterLink>
              <FilterLink active={activeTab === 'unread'} onClick={() => setActiveTab('unread')} icon={Bell} count={notifications.filter(n => !n.read).length}>Unread</FilterLink>
              <FilterLink active={activeTab === 'mentions'} onClick={() => setActiveTab('mentions')} icon={MessageSquare} count={notifications.filter(n => n.type === 'Mention').length}>Mentions</FilterLink>
              <FilterLink active={activeTab === 'updates'} onClick={() => setActiveTab('updates')} icon={Zap} count={notifications.filter(n => n.type === 'ProjectUpdate').length}>System Updates</FilterLink>
            </nav>

            <div className="pt-8 border-t border-border/50">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Notification Settings</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all text-xs font-bold text-foreground group">
                  Email Alerts <ChevronRight size={14} className="opacity-0 group-hover:opacity-50" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all text-xs font-bold text-foreground group">
                  Push Notifications <ChevronRight size={14} className="opacity-0 group-hover:opacity-50" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Notifications List */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="Filter notifications..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-12 bg-card border border-border/50 rounded-2xl text-sm focus:border-primary outline-none transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { markAllNotificationsRead(); toast.success("Marked all as read"); }}
                  className="px-4 h-11 rounded-2xl bg-secondary hover:bg-secondary/80 text-[11px] font-black uppercase tracking-widest text-foreground transition-all flex items-center gap-2 border border-border/50 shadow-sm"
                >
                  <Check size={16} /> Mark All Read
                </button>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[600px]">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-border/30">
                    {filteredNotifications.map((notif) => (
                      <NotificationRow 
                        key={notif.id} 
                        notif={notif} 
                        onMarkRead={() => markNotificationRead(notif.id)}
                        onDelete={() => deleteNotification(notif.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 text-center">
                    <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
                      <Inbox size={40} className="text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">No notifications here</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">You're all caught up! When something important happens, you'll see it here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FilterLink = ({ active, onClick, icon: Icon, children, count }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      active 
      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`}
  >
    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
      <Icon size={16} />
      {children}
    </div>
    {count > 0 && (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-white text-primary' : 'bg-secondary text-muted-foreground'}`}>
        {count}
      </span>
    )}
  </button>
);

const NotificationRow = ({ notif, onMarkRead, onDelete }: any) => {
  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'Follow': return { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'Star': return { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'Comment': 
      case 'Reply': return { icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'AISuggestion': return { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      case 'ProjectUpdate': return { icon: Clock, color: 'text-cyan-500', bg: 'bg-cyan-500/10' };
      default: return { icon: Share2, color: 'text-primary', bg: 'bg-primary/10' };
    }
  };

  const { icon: Icon, color, bg } = getIcon(notif.type);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-6 flex items-start gap-6 hover:bg-secondary/20 transition-all group ${!notif.read ? 'bg-primary/[0.02]' : ''}`}
    >
      <div className={`shrink-0 w-12 h-12 rounded-2xl ${bg} flex items-center justify-center ${color} shadow-sm`}>
        <SafeIcon icon={Icon} size={22} fill={notif.type === 'Star' ? 'currentColor' : 'none'} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">{notif.type}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{formatDistanceToNow(new Date(notif.timestamp))} ago</span>
        </div>
        <p className={`text-sm leading-relaxed mb-3 ${!notif.read ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
          {notif.message}
        </p>
        <div className="flex items-center gap-3">
          <button onClick={onMarkRead} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Mark as read</button>
          <div className="w-1 h-1 rounded-full bg-border" />
          <button onClick={onDelete} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Delete</button>
        </div>
      </div>

      {!notif.read && <div className="w-2 h-2 rounded-full bg-primary self-center" />}
    </motion.div>
  );
};
