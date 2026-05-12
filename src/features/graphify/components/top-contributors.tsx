import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame, FolderOpen, TrendingUp } from 'lucide-react';

interface TopContributor {
  id: string;
  username: string;
  avatar: string;
  contributions: number;
  projects: number;
  streak: number;
}

interface TopContributorsProps {
  contributors: TopContributor[];
  className?: string;
}

export function TopContributors({ contributors, className }: TopContributorsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('space-y-4', className)}
    >
      {contributors.map((contributor, index) => (
        <motion.div
          key={contributor.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-card/50 hover:bg-card border border-border/50 transition-all"
        >
          <div className="relative">
            <img
              src={contributor.avatar}
              alt={contributor.username}
              className="w-12 h-12 rounded-full ring-2 ring-cyan-500/20"
            />
            <div
              className={cn(
                'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                index === 0 ? 'bg-yellow-500 text-yellow-950' :
                index === 1 ? 'bg-gray-400 text-gray-950' :
                index === 2 ? 'bg-amber-600 text-amber-950' :
                'bg-secondary text-foreground'
              )}
            >
              {index + 1}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">@{contributor.username}</h4>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-green-400" />
                {contributor.contributions.toLocaleString()} contributions
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <FolderOpen className="w-3 h-3 text-blue-400" />
                {contributor.projects} projects
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-bold">{contributor.streak}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}