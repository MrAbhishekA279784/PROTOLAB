import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  delay?: number;
}

export function InsightCard({ title, description, icon, trend, className, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={cn(
        'p-5 rounded-2xl border border-border bg-card/50 backdrop-blur-xl',
        'hover:bg-card/80 transition-all duration-300',
        'group',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit">
            {icon}
          </div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          {trend && (
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-sm font-semibold',
                trend.value >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface InsightsGridProps {
  className?: string;
}

export function InsightsGrid({ className }: InsightsGridProps) {
  const insights = [
    {
      title: 'Peak Activity Hours',
      description: 'Most simulations run between 2-4 PM. Consider scheduling resource-intensive tasks during off-peak hours.',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      trend: { value: 12, label: 'vs last week' },
    },
    {
      title: 'AI Adoption Growing',
      description: 'AI-assisted design usage increased 34% this month. PCB auto-routing is the most popular feature.',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      trend: { value: 34, label: 'vs last month' },
    },
    {
      title: 'Community Growth',
      description: 'New contributor signups up 23%. Most active in Arduino and ESP32 project categories.',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      trend: { value: 23, label: 'vs last month' },
    },
    {
      title: 'Store Performance',
      description: 'Conversion rate increased to 4.2%. Passive components are the top-selling category.',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      trend: { value: 8, label: 'vs last month' },
    },
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {insights.map((insight, index) => (
        <InsightCard key={insight.title} {...insight} delay={index} />
      ))}
    </div>
  );
}