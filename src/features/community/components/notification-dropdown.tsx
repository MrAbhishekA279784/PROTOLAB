import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  MessageCircle, 
  UserPlus, 
  Star, 
  GitPullRequest, 
  CheckCircle2, 
  MoreHorizontal,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";

export interface Notification {
  id: string;
  type: "follow" | "comment" | "star" | "pr" | "system";
  actor: string;
  actorName: string;
  actorAvatar?: string;
  targetId?: string;
  targetName?: string;
  isRead: boolean;
  createdAt: Date;
  message?: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { profile } = useAuth();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", profile.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [profile]);

  const markAllAsRead = async () => {
    if (!profile || unreadCount === 0) return;
    const batch = writeBatch(db);
    notifications.forEach(n => {
      if (!n.isRead) {
        batch.update(doc(db, "notifications", n.id), { isRead: true });
      }
    });
    await batch.commit();
  };

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { isRead: true });
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "follow": return <UserPlus className="w-4 h-4 text-cyan-500" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-primary" />;
      case "star": return <Star className="w-4 h-4 text-amber-500" />;
      case "pr": return <GitPullRequest className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-secondary group"
      >
        <Bell className={cn("w-4.5 h-4.5", unreadCount > 0 && "animate-wiggle")} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-card border border-white/10 shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-bold text-sm tracking-tight">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        "p-4 flex gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/5 last:border-0",
                        !n.isRead && "bg-primary/[0.02]"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
                          {n.actorAvatar ? (
                            <img src={n.actorAvatar} alt={n.actorName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-muted-foreground">{n.actorName.charAt(0)}</span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-card border border-white/10">
                          {getIcon(n.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] leading-snug">
                          <span className="font-bold text-foreground">@{n.actorName}</span>{" "}
                          <span className="text-muted-foreground">
                            {n.type === "follow" && "started following you"}
                            {n.type === "comment" && `commented on your project ${n.targetName}`}
                            {n.type === "star" && `starred your repository ${n.targetName}`}
                            {n.type === "pr" && `opened a pull request in ${n.targetName}`}
                          </span>
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                           {!n.isRead && <Circle className="w-1.5 h-1.5 fill-primary text-primary" />}
                           <span className="text-[11px] text-muted-foreground/60 font-medium">
                             {n.createdAt?.toDate ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : "just now"}
                           </span>
                        </div>
                      </div>
                      
                      <button className="h-fit p-1 rounded-md text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 px-6 text-center">
                    <div className="w-12 h-12 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                       <Bell className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">We'll let you know when something important happens.</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-white/5 bg-white/[0.01]">
                <button className="w-full py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                  See all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
