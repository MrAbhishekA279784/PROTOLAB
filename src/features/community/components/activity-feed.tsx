import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Star, MessageSquare, UserPlus, 
  Share2, Clock, GitFork, ExternalLink, 
  Activity, TrendingUp, Cpu
} from 'lucide-react';
import { SafeIcon } from '@/components/ui/safe-icon';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  user: { name: string, avatar?: string };
  type: 'project_created' | 'starred' | 'forked' | 'commented' | 'joined';
  target: string;
  timestamp: Date;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', user: { name: 'Sarah Chen' }, type: 'project_created', target: 'Low Power ESP32 Gateway', timestamp: new Date(Date.now() - 300000) },
  { id: '2', user: { name: 'Alex Riviera' }, type: 'starred', target: '6-DOF Robotic Arm', timestamp: new Date(Date.now() - 1200000) },
  { id: '3', user: { name: 'Marcus Eng' }, type: 'commented', target: 'Drone ESC v2.0', timestamp: new Date(Date.now() - 3600000) },
  { id: '4', user: { name: 'Elena Volt' }, type: 'forked', target: 'Smart Irrigation System', timestamp: new Date(Date.now() - 7200000) },
  { id: '5', user: { name: 'Devin Hard' }, type: 'joined', target: 'Tesla Coil Simulation', timestamp: new Date(Date.now() - 14400000) },
];

export const LiveActivityFeed: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <Activity size={14} /> Live Community Feed
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITY.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-5 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 flex gap-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-lg">
              {activity.user.name[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[13px] font-bold text-foreground truncate">
                  {activity.user.name}
                </p>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {formatDistanceToNow(activity.timestamp)} ago
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-snug">
                {getActionLabel(activity.type)} <span className="text-primary font-bold hover:underline cursor-pointer">{activity.target}</span>
              </p>
            </div>

            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <button className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-white transition-all">
                <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 mt-8 border-t border-border/50 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <TrendingUp size={14} /> Trending Projects
        </h3>
        
        <div className="space-y-3">
          {[
            { name: 'Tesla Coil Sim', stars: 420, type: 'Simulation' },
            { name: 'DIY Oscilloscope', stars: 128, type: 'PCB Design' },
            { name: 'ESP32 MQTT Hub', stars: 89, type: 'Code' }
          ].map((project, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/30 hover:border-primary/50 transition-all group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-card border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Star size={14} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground">{project.name}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{project.type}</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                +{project.stars}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getActionLabel(type: string) {
  switch(type) {
    case 'project_created': return 'launched a new project:';
    case 'starred': return 'starred the repository:';
    case 'forked': return 'forked the project:';
    case 'commented': return 'left a comment on:';
    case 'joined': return 'joined the workspace:';
    default: return 'is working on:';
  }
}
