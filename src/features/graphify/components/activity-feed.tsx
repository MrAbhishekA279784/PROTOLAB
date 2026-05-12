import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Star, GitFork, Eye, MessageSquare, Share2, Bot, Cpu, Code2, CircuitBoard,
  type LucideIcon
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'star' | 'fork' | 'view' | 'comment' | 'share' | 'ai_generate' | 'simulation_run' | 'pcb_design' | 'code_submit';
  userId: string;
  username: string;
  userAvatar: string;
  targetName: string;
  targetType: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
}

const activityIcons: Record<string, LucideIcon> = {
  star: Star,
  fork: GitFork,
  view: Eye,
  comment: MessageSquare,
  share: Share2,
  ai_generate: Bot,
  simulation_run: Cpu,
  pcb_design: CircuitBoard,
  code_submit: Code2,
};

const activityColors: Record<string, string> = {
  star: 'text-yellow-400 bg-yellow-400/10',
  fork: 'text-purple-400 bg-purple-400/10',
  view: 'text-blue-400 bg-blue-400/10',
  comment: 'text-green-400 bg-green-400/10',
  share: 'text-pink-400 bg-pink-400/10',
  ai_generate: 'text-cyan-400 bg-cyan-400/10',
  simulation_run: 'text-orange-400 bg-orange-400/10',
  pcb_design: 'text-emerald-400 bg-emerald-400/10',
  code_submit: 'text-blue-400 bg-blue-400/10',
};

const activityLabels: Record<string, string> = {
  star: 'starred',
  fork: 'forked',
  view: 'viewed',
  comment: 'commented on',
  share: 'shared',
  ai_generate: 'generated with AI',
  simulation_run: 'ran simulation on',
  pcb_design: 'designed PCB for',
  code_submit: 'submitted code to',
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ activities, maxItems = 10, className }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('space-y-3', className)}
    >
      {displayActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type] || Star;
        const colorClass = activityColors[activity.type] || 'text-gray-400 bg-gray-400/10';
        const label = activityLabels[activity.type] || activity.type;

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors"
          >
            <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold text-foreground">{activity.username}</span>
                <span className="text-muted-foreground"> {label} </span>
                <span className="font-medium text-cyan-400">{activity.targetName}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{activity.targetType}</span>
              </div>
            </div>
            <img
              src={activity.userAvatar}
              alt={activity.username}
              className="w-8 h-8 rounded-full"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}