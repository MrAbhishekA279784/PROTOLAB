import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContributionGraphProps {
  data: { date: string; count: number }[];
}

export default function ContributionGraph({ data }: ContributionGraphProps) {
  // Generate last 12 weeks of data (84 days) if not provided
  const weeks = 24;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;
  
  // Create a grid of empty slots
  const gridData = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (totalDays - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const match = data.find(item => item.date === dateStr);
    return {
      date: dateStr,
      count: match ? match.count : 0,
    };
  });

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/5 border border-white/[0.03]";
    if (count < 3) return "bg-cyan-500/20 border border-cyan-500/20";
    if (count < 6) return "bg-cyan-500/40 border border-cyan-500/30";
    if (count < 10) return "bg-cyan-500/70 border border-cyan-500/40";
    return "bg-cyan-400 border border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]";
  };

  return (
    <div className="p-6 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground/80 flex items-center gap-2">
          Activity Graph
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-[10px] text-cyan-400 border border-cyan-500/20 uppercase tracking-widest font-bold">
            Beta
          </span>
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-white/5" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-500/20" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-500/40" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-500/70" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-cyan-400" />
          </div>
          <span>More</span>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex gap-[3px] overflow-x-auto no-scrollbar pb-2">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px] shrink-0">
              {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
                const dayData = gridData[weekIndex * daysPerWeek + dayIndex];
                if (!dayData) return null;
                
                return (
                  <Tooltip key={dayData.date}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        className={cn(
                          "w-[11px] h-[11px] rounded-[2px] transition-all cursor-crosshair",
                          getColor(dayData.count)
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-card/95 border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-2xl">
                      <p className="text-[11px] font-bold text-foreground">
                        {dayData.count} contributions
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(dayData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </TooltipProvider>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Yearly Total</span>
            <span className="text-sm font-bold text-foreground tracking-tight">428 Units</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Longest Streak</span>
            <span className="text-sm font-bold text-cyan-400 tracking-tight">14 Days</span>
          </div>
        </div>
        <button className="text-[11px] font-bold text-muted-foreground hover:text-cyan-400 transition-colors uppercase tracking-widest">
          View Stats
        </button>
      </div>
    </div>
  );
}
