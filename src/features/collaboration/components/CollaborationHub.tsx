import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Share2, Shield, X, Bell, ExternalLink, ShieldCheck } from 'lucide-react';
import { useStore, Presence, CollaboratorRole } from '@/store/useStore';
import { SafeIcon } from '@/components/ui/safe-icon';

export const CollaborationHub: React.FC = () => {
  const { 
    currentUser, 
    currentSessionId, 
    activeSessions, 
    updatePresence, 
    notifications,
    markNotificationRead 
  } = useStore();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Handle global mouse move for cursor presence
  useEffect(() => {
    if (!currentSessionId || !currentUser) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle presence updates
      updatePresence({
        cursor: { x: e.clientX, y: e.clientY }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentSessionId, currentUser, updatePresence]);

  const activeSession = currentSessionId ? activeSessions[currentSessionId] : null;
  const activeUsers = activeSession?.activeUsers || [];
  const otherUsers = activeUsers.filter(u => u.userId !== currentUser?.id);

  return (
    <div className="fixed top-12 right-4 z-50 flex items-center gap-3">
      {/* Notifications Button */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifs(!showNotifs)}
          className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-lg active:scale-90"
        >
          <SafeIcon icon={Bell} size={18} />
          {notifications.some(n => !n.read) && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-12 right-0 w-80 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Notifications</span>
                <button onClick={() => setShowNotifs(false)} className="text-muted-foreground hover:text-foreground">
                  <SafeIcon icon={X} size={14} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground text-[11px]">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-4 border-b border-border/50 cursor-pointer transition-colors ${n.read ? 'opacity-60' : 'bg-primary/5'}`}
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <SafeIcon icon={Bell} size={14} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[12px] text-foreground leading-tight mb-1">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(n.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collaboration Session Header */}
      {currentSessionId && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 bg-card/80 backdrop-blur-md border border-border/50 rounded-full pl-2 pr-4 py-1.5 shadow-lg"
        >
          <div className="flex -space-x-2 mr-3">
            {activeUsers.slice(0, 3).map(u => (
              <div 
                key={u.userId}
                className="w-7 h-7 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-black uppercase text-primary"
                title={u.username}
              >
                {u.username.substring(0, 2)}
              </div>
            ))}
            {activeUsers.length > 3 && (
              <div className="w-7 h-7 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all active:scale-95 shadow-md"
          >
            <SafeIcon icon={UserPlus} size={12} strokeWidth={3} />
            Invite
          </button>
        </motion.div>
      )}

      {/* Live Cursors Layer */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {otherUsers.map(u => u.cursor && (
          <motion.div
            key={u.userId}
            initial={false}
            animate={{ x: u.cursor.x, y: u.cursor.y }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute"
          >
            <div className="relative">
              <SafeIcon icon={Users} size={14} className="text-primary fill-primary" />
              <div className="absolute top-4 left-2 px-2 py-0.5 bg-primary rounded-full shadow-lg border border-white/20 whitespace-nowrap">
                <span className="text-[9px] font-black uppercase text-white">{u.username}</span>
                {u.isTyping && <span className="ml-1 animate-pulse">...</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <InviteModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
        projectId={currentSessionId || ''} 
      />
    </div>
  );
};

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, projectId }) => {
  const { users, currentUser, addCollaborator, posts } = useStore();
  const [search, setSearch] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('Editor');

  const project = posts.find(p => p.id === projectId);
  const collaborators = project?.collaborators || [];

  const filteredUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    u.username.toLowerCase().includes(search.toLowerCase()) &&
    !collaborators.some(c => c.userId === u.id)
  );

  const copyLink = () => {
    const url = `${window.location.origin}/workspace/${projectId}`;
    navigator.clipboard.writeText(url);
    alert('Invite link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">Share Workspace</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">Project Collaboration</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <SafeIcon icon={X} size={16} />
                </button>
              </div>

              <div className="flex gap-2 mb-6 p-1 bg-secondary/50 rounded-2xl border border-border/50">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/workspace/${projectId}`}
                  className="flex-1 bg-transparent px-4 py-2 text-[12px] text-muted-foreground font-mono outline-none"
                />
                <button 
                  onClick={copyLink}
                  className="px-4 py-2 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                >
                  <SafeIcon icon={Share2} size={12} />
                  Copy
                </button>
              </div>

              <div className="mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Invite Collaborators</label>
                <div className="relative mb-3">
                  <input 
                    type="text" 
                    placeholder="Search by username..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-all pl-10"
                  />
                  <Users className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex gap-2 mb-4">
                  {(['Viewer', 'Editor'] as CollaboratorRole[]).map(role => (
                    <button 
                      key={role}
                      onClick={() => setInviteRole(role)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        inviteRole === role 
                        ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                        : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <SafeIcon icon={role === 'Viewer' ? Shield : ShieldCheck} size={10} className="inline mr-2" />
                      {role}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-6">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/30 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[13px] font-bold text-foreground">{user.username}</span>
                      </div>
                      <button 
                        onClick={() => addCollaborator(projectId, user.id, inviteRole)}
                        className="px-3 py-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all active:scale-95"
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-6">
                  <div>
                    <h4 className="text-[12px] font-black uppercase tracking-widest text-foreground">Project Visibility</h4>
                    <p className="text-[10px] text-muted-foreground">Who can see this project in the community</p>
                  </div>
                  <button 
                    onClick={() => {
                      // Mock visibility toggle logic
                      useStore.getState().addNotification('System', `Project visibility set to ${project?.visibility === 'Public' ? 'Private' : 'Public'}`);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      project?.visibility === 'Public' 
                      ? 'bg-success/10 border-success text-success' 
                      : 'bg-secondary border-border text-muted-foreground'
                    }`}
                  >
                    {project?.visibility || 'Private'}
                  </button>
                </div>

                <button 
                  onClick={() => {
                    useStore.getState().addNotification('ProjectShared', `Project "${project?.title}" has been shared to the Community Hub!`);
                    copyLink();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-primary to-cyan-500 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 mb-6"
                >
                  <SafeIcon icon={ExternalLink} size={14} />
                  Share to Community
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-3">Active Collaborators</label>
                <div className="space-y-2">
                  {collaborators.map(c => {
                    const user = users.find(u => u.id === c.userId);
                    return (
                      <div key={c.userId} className="flex items-center justify-between p-3 border border-border/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black text-muted-foreground">
                            {user?.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-foreground">{user?.username}</p>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{c.role}</p>
                          </div>
                        </div>
                        {c.role !== 'Owner' && (
                          <button className="text-muted-foreground hover:text-red-500 transition-colors">
                            <SafeIcon icon={X} size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
