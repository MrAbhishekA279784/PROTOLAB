import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, Trash2, ExternalLink, Star, 
  MessageSquare, UserPlus, Zap, Settings, Inbox,
  Info, Clock, Share2, AlertCircle
} from 'lucide-react';
import { useStore, AppNotification, NotificationType } from '@/store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { SafeIcon } from '@/components/ui/safe-icon';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useStore();
  const navigate = useNavigate();

  const handleAction = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.link) navigate(notif.link);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-4 w-[420px] bg-card/95 backdrop-blur-2xl border border-border shadow-2xl rounded-[2.5rem] overflow-hidden z-[1000]"
    >
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/20">
        <div>
          <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            Inbox
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent activity & alerts</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllNotificationsRead}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary transition-all"
            title="Mark all as read"
          >
            <Check size={16} />
          </button>
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
        <AnimatePresence initial={false}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificationItem 
                key={notif.id} 
                notif={notif} 
                onAction={() => handleAction(notif)}
                onDelete={() => deleteNotification(notif.id)}
              />
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
                <Inbox size={32} className="text-muted-foreground/30" />
              </div>
              <div>
                <p className="text-sm font-black text-foreground">All clear!</p>
                <p className="text-xs text-muted-foreground">You're caught up with all activity.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-secondary/10 border-t border-border/50">
        <button 
          onClick={() => { navigate('/notifications'); onClose(); }}
          className="w-full py-3 bg-secondary/50 hover:bg-secondary text-[11px] font-black uppercase tracking-widest text-foreground rounded-2xl transition-all"
        >
          View All Notifications
        </button>
      </div>
    </motion.div>
  );
};

const NotificationItem = ({ notif, onAction, onDelete }: { 
  notif: AppNotification, 
  onAction: () => void, 
  onDelete: () => void 
}) => {
  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'Follow': return { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'Star': return { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'Comment': 
      case 'Reply': return { icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'ProjectShared':
      case 'CollaboratorJoined': return { icon: Share2, color: 'text-primary', bg: 'bg-primary/10' };
      case 'AISuggestion': return { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      case 'ProjectUpdate': return { icon: Clock, color: 'text-cyan-500', bg: 'bg-cyan-500/10' };
      default: return { icon: Info, color: 'text-muted-foreground', bg: 'bg-secondary' };
    }
  };

  const { icon: Icon, color, bg } = getIcon(notif.type);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group p-4 flex gap-4 hover:bg-secondary/40 transition-all border-b border-border/30 relative ${!notif.read ? 'bg-primary/5' : ''}`}
    >
      <div className={`shrink-0 w-12 h-12 rounded-2xl ${bg} flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
        <SafeIcon icon={Icon} size={20} fill={notif.type === 'Star' ? 'currentColor' : 'none'} />
      </div>

      <div className="flex-1 space-y-1 min-w-0" onClick={onAction}>
        <p className={`text-[13px] leading-snug cursor-pointer group-hover:text-primary transition-colors ${!notif.read ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
          {notif.message}
        </p>
        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatDistanceToNow(new Date(notif.timestamp))} ago
          </span>
          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
        </div>
      </div>

      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};
