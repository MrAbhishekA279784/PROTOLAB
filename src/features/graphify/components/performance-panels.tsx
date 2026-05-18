import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguageBreakdown, useWeeklyActivity, useEngagementMetrics } from '../hooks/use-analytics';
import { PieChartComponent } from './pie-chart';
import { BarChartComponent } from './bar-chart';
import { LineChartComponent } from './line-chart';

interface PerformancePanelsProps {
  className?: string;
}

export function PerformancePanels({ className }: PerformancePanelsProps) {
  const { data: languages } = useLanguageBreakdown();
  const { data: weeklyActivity } = useWeeklyActivity();
  const { metrics } = useEngagementMetrics();

  const starTrend = metrics.find(m => m.id === 'stars')?.trend || [];
  const viewTrend = metrics.find(m => m.id === 'views')?.trend || [];

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Language Distribution</h3>
        <PieChartComponent data={languages} height={200} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Activity</h3>
        <BarChartComponent
          data={weeklyActivity}
          nameKey="day"
          dataKey="activity"
          color="#00d4ff"
          height={200}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Stars Growth</h3>
        <LineChartComponent
          data={starTrend}
          color="#fbbf24"
          height={200}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Views Trend</h3>
        <LineChartComponent
          data={viewTrend}
          color="#3b82f6"
          height={200}
        />
      </motion.div>
    </div>
  );
}