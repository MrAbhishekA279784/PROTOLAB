import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './animated-counter';
import {
  Users, Cpu, FolderOpen, Bot, ShoppingCart, Star, GitFork, Eye,
  TrendingUp, TrendingDown, Minus,
  type LucideIcon
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  change?: number;
  icon: LucideIcon;
  color?: string;
  formatValue?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
}

const colorMap: Record<string, { bg: string; icon: string; glow: string }> = {
  cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(0,212,255,0.3)]' },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
  yellow: { bg: 'bg-yellow-500/10', icon: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]' },
  green: { bg: 'bg-green-500/10', icon: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' },
  pink: { bg: 'bg-pink-500/10', icon: 'text-pink-400', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]' },
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
  orange: { bg: 'bg-orange-500/10', icon: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
};

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'cyan',
  formatValue,
  prefix = '',
  suffix = '',
  className,
  delay = 0,
}: StatsCardProps) {
  const colors = colorMap[color] || colorMap.cyan;

  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return '';
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6',
        'hover:bg-card/80 transition-all duration-300',
        'group',
        className
      )}
    >
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500', colors.glow)} />

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <AnimatedCounter
              value={value}
              formatter={formatValue || ((v) => v.toLocaleString())}
              prefix={prefix}
              suffix={suffix}
              className="text-3xl font-bold text-foreground"
            />
          </div>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1.5 text-sm', getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colors.bg, colors.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="absolute -bottom-1 -right-1 w-20 h-20 rounded-full blur-3xl opacity-20" style={{ backgroundColor: color === 'cyan' ? '#00d4ff' : color === 'purple' ? '#a855f7' : '#22c55e' }} />
    </motion.div>
  );
}

interface QuickStatsGridProps {
  stats: {
    activeUsers: number;
    simulationsRunning: number;
    projectsCreated: number;
    aiQueriesToday: number;
    storeVisitors: number;
    totalStars: number;
  };
  className?: string;
}

export function QuickStatsGrid({ stats, className }: QuickStatsGridProps) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4', className)}>
      <StatsCard
        title="Active Users"
        value={stats.activeUsers}
        icon={Users}
        color="cyan"
        delay={0}
      />
      <StatsCard
        title="Simulations"
        value={stats.simulationsRunning}
        icon={Cpu}
        color="purple"
        delay={1}
      />
      <StatsCard
        title="Projects"
        value={stats.projectsCreated}
        icon={FolderOpen}
        color="green"
        delay={2}
      />
      <StatsCard
        title="AI Queries"
        value={stats.aiQueriesToday}
        icon={Bot}
        color="yellow"
        delay={3}
      />
      <StatsCard
        title="Store Visitors"
        value={stats.storeVisitors}
        icon={ShoppingCart}
        color="pink"
        delay={4}
      />
      <StatsCard
        title="Total Stars"
        value={stats.totalStars}
        icon={Star}
        color="blue"
        delay={5}
      />
    </div>
  );
}