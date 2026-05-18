import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, FolderGit2, Activity, 
  Brain, Zap, BarChart3, PieChart as PieChartIcon, 
  Search, Filter, Maximize2, Download, Share2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { 
  LineChartComponent, 
  AreaChartComponent, 
  BarChartComponent, 
  PieChartComponent, 
  ContributionHeatmap,
  StatsCard,
  QuickStatsGrid,
  TopRepositories,
  TopContributors,
  InsightsGrid,
  PerformancePanels
} from '@/features/graphify/components';

// Mock data for Graphify dashboard
const MOCK_LINE_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
  value: Math.floor(Math.random() * 5000) + 1000
}));

const MOCK_PIE_DATA = [
  { name: 'Simulations', value: 45 },
  { name: 'PCB Layouts', value: 25 },
  { name: 'Code Lab', value: 20 },
  { name: 'Community', value: 10 },
];

const MOCK_HEATMAP_DATA = Array.from({ length: 100 }, (_, i) => ({
  date: new Date(Date.now() - (99 - i) * 86400000).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 10),
  level: Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4
}));

export default function GraphifyPage() {
  const [view, setView] = useState<'analytics' | 'knowledge'>('analytics');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                <Brain size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-white">Graphify Analytics</h1>
            </div>
            <p className="text-slate-400 font-medium">Real-time engineering intelligence and ecosystem insights.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setView('analytics')}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'analytics' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setView('knowledge')}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'knowledge' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Knowledge Graph
            </button>
          </div>
        </div>

        {view === 'analytics' ? (
          <div className="space-y-8">
            {/* Top Stats */}
            <QuickStatsGrid stats={{
              activeUsers: 12450,
              simulationsRunning: 842,
              projectsCreated: 45210,
              aiQueriesToday: 3210,
              storeVisitors: 5620,
              totalStars: 89400
            }} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Chart */}
              <div className="lg:col-span-8 space-y-8">
                <div className="p-8 bg-slate-900/30 border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <TrendingUp size={16} className="text-cyan-400" />
                      Ecosystem Activity
                    </h3>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"><Maximize2 size={14} /></button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"><Download size={14} /></button>
                    </div>
                  </div>
                  <AreaChartComponent data={MOCK_LINE_DATA} height={350} color="#00d4ff" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-900/30 border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Project Distribution</h3>
                    <PieChartComponent data={MOCK_PIE_DATA} height={250} />
                  </div>
                  <div className="p-8 bg-slate-900/30 border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Contribution Velocity</h3>
                    <BarChartComponent data={MOCK_LINE_DATA.slice(-10)} height={250} color="#a855f7" />
                  </div>
                </div>

                <PerformancePanels />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <TopRepositories />
                <TopContributors />
                <div className="p-8 bg-cyan-500/10 border border-cyan-500/20 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Zap size={48} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-2">Pro Insights</h3>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    Ecosystem growth is up 24% this week. Hardware simulations are the primary driver of engagement.
                  </p>
                </div>
              </div>
            </div>

            <ContributionHeatmap data={MOCK_HEATMAP_DATA} />
            <InsightsGrid />
          </div>
        ) : (
          <div className="h-[80vh] w-full bg-slate-900/30 border border-white/5 rounded-[3rem] overflow-hidden relative">
             <iframe 
               src="/graphify-out/graph.html" 
               className="w-full h-full border-none"
               title="Knowledge Graph"
             />
             <div className="absolute top-6 left-6 flex gap-3">
                <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400 shadow-2xl">
                  Interactive Mode
                </div>
                <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-2xl flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
