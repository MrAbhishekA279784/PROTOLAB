import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionHeatmapProps {
  data: HeatmapDay[];
  className?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ContributionHeatmap({ data, className }: ContributionHeatmapProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const weeks: HeatmapDay[][] = [];
    let currentWeek: HeatmapDay[] = [];
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    data.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push(day);

      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ month: MONTHS[month], weekIndex: weeks.length });
        lastMonth = month;
      }

      if (index === data.length - 1 && currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
    });

    return { weeks, monthLabels };
  }, [data]);

  const levelColors = [
    'bg-[#161b22]',
    'bg-[#0e4429]',
    'bg-[#006d32]',
    'bg-[#26a641]',
    'bg-[#39d353]',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn('w-full overflow-x-auto', className)}
    >
      <div className="flex gap-1">
        <div className="flex flex-col gap-[3px] mr-2">
          {DAYS.map((day, i) => (
            <div key={day} className="h-[13px] flex items-center">
              {i % 2 === 1 && <span className="text-[9px] text-muted-foreground">{day}</span>}
            </div>
          ))}
        </div>
        <div>
          <div className="flex gap-[3px] mb-1">
            {monthLabels.map((label, i) => (
              <div
                key={`${label.month}-${i}`}
                className="text-[10px] text-muted-foreground"
                style={{ marginLeft: i === 0 ? 0 : `${(label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 16 - 10}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                  const day = week.find((d) => new Date(d.date).getDay() === dayIndex);
                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        'w-[13px] h-[13px] rounded-sm',
                        day ? levelColors[day.level] : 'bg-transparent'
                      )}
                      title={day ? `${day.date}: ${day.count} contributions` : ''}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {levelColors.map((color, i) => (
          <div key={i} className={cn('w-[11px] h-[11px] rounded-sm', color)} />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </motion.div>
  );
}