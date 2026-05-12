export interface AnalyticsDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface RepositoryAnalytics {
  id: string;
  name: string;
  stars: number;
  forks: number;
  views: number;
  clones: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnPage: number;
  commitActivity: AnalyticsDataPoint[];
  starHistory: AnalyticsDataPoint[];
  forkHistory: AnalyticsDataPoint[];
  viewHistory: AnalyticsDataPoint[];
  languageBreakdown: { name: string; value: number; color: string }[];
}

export interface UserGrowthData {
  date: string;
  users: number;
  activeUsers: number;
  newUsers: number;
}

export interface ContributionHeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface EngagementMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: AnalyticsDataPoint[];
}

export interface ActivityItem {
  id: string;
  type: 'star' | 'fork' | 'view' | 'comment' | 'share' | 'ai_generate' | 'simulation_run' | 'pcb_design' | 'code_submit';
  userId: string;
  username: string;
  userAvatar: string;
  targetName: string;
  targetType: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface TopRepository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  views: number;
  language: string;
  languageColor: string;
}

export interface TopContributor {
  id: string;
  username: string;
  avatar: string;
  contributions: number;
  projects: number;
  streak: number;
}

export interface RealtimeStats {
  activeUsers: number;
  simulationsRunning: number;
  projectsCreated: number;
  aiQueriesToday: number;
  storeVisitors: number;
  totalStars: number;
  totalForks: number;
  totalViews: number;
}

export interface SimulationUsageMetric {
  hour: string;
  simulations: number;
  components: number;
  wires: number;
}

export interface StoreTrafficData {
  category: string;
  visitors: number;
  conversions: number;
  revenue: number;
}

export interface AIUsageMetric {
  date: string;
  queries: number;
  tokens: number;
  cost: number;
}

const generateDateRange = (days: number, baseValue: number, variance: number): AnalyticsDataPoint[] => {
  const data: AnalyticsDataPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, baseValue + Math.floor(Math.random() * variance) - variance / 2),
    });
  }
  return data;
};

const generateTrend = (days: number, baseValue: number, growing: boolean = true): AnalyticsDataPoint[] => {
  const data: AnalyticsDataPoint[] = [];
  const now = new Date();
  let current = baseValue;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() * 10 - 4) * (growing ? 1 : -1);
    current = Math.max(0, current + change);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(current),
    });
  }
  return data;
};

export const mockRealtimeStats: RealtimeStats = {
  activeUsers: 247,
  simulationsRunning: 89,
  projectsCreated: 1247,
  aiQueriesToday: 3421,
  storeVisitors: 1834,
  totalStars: 12847,
  totalForks: 3892,
  totalViews: 198432,
};

export const mockUserGrowth: UserGrowthData[] = generateDateRange(30, 150, 40).map((d, i) => ({
  date: d.date,
  users: d.value + 500,
  activeUsers: Math.floor(d.value * 0.7) + 300,
  newUsers: Math.floor(d.value * 0.2) + 20,
}));

export const mockContributionHeatmap: ContributionHeatmapDay[] = (() => {
  const data: ContributionHeatmapDay[] = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const count = Math.floor(Math.random() * 20);
    data.push({
      date: date.toISOString().split('T')[0],
      count,
      level: count === 0 ? 0 : count < 3 ? 1 : count < 7 ? 2 : count < 12 ? 3 : 4,
    });
  }
  return data;
})();

export const mockTopRepositories: TopRepository[] = [
  { id: '1', name: 'Arduino-LED-Blinker', owner: 'abhishek_m', description: 'Simple LED blinker with timing control', stars: 234, forks: 45, views: 1823, language: 'Arduino', languageColor: '#00979D' },
  { id: '2', name: 'ESP32-WiFi-Scanner', owner: 'techie_sid', description: 'WiFi network scanner using ESP32', stars: 189, forks: 38, views: 1456, language: 'C++', languageColor: '#f34b7d' },
  { id: '3', name: 'PCB-RGB-Controller', owner: 'mech_pro', description: 'RGB LED controller with PWM', stars: 156, forks: 29, views: 1203, language: 'Arduino', languageColor: '#00979D' },
  { id: '4', name: 'Smart-Irrigation', owner: 'green_tech', description: 'Automated plant watering system', stars: 134, forks: 24, views: 987, language: 'C++', languageColor: '#f34b7d' },
  { id: '5', name: 'Weather-Station', owner: 'climate_dev', description: 'DHT22 based weather monitoring', stars: 112, forks: 19, views: 845, language: 'Arduino', languageColor: '#00979D' },
];

export const mockTopContributors: TopContributor[] = [
  { id: '1', username: 'abhishek_m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abhishek', contributions: 487, projects: 23, streak: 42 },
  { id: '2', username: 'techie_sid', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sid', contributions: 356, projects: 18, streak: 28 },
  { id: '3', username: 'mech_pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mech', contributions: 298, projects: 15, streak: 21 },
  { id: '4', username: 'green_tech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=green', contributions: 234, projects: 12, streak: 15 },
  { id: '5', username: 'climate_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=climate', contributions: 187, projects: 9, streak: 12 },
];

export const mockEngagementMetrics: EngagementMetric[] = [
  {
    id: 'stars',
    label: 'Stars',
    value: 12847,
    change: 12.5,
    trend: generateTrend(14, 12000, true),
  },
  {
    id: 'forks',
    label: 'Forks',
    value: 3892,
    change: 8.3,
    trend: generateTrend(14, 3500, true),
  },
  {
    id: 'views',
    label: 'Views',
    value: 198432,
    change: 23.1,
    trend: generateTrend(14, 180000, true),
  },
  {
    id: 'comments',
    label: 'Comments',
    value: 3421,
    change: -2.4,
    trend: generateTrend(14, 3500, false),
  },
];

export const mockRecentActivity: ActivityItem[] = [
  { id: '1', type: 'star', userId: '101', username: 'newbie_coder', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newbie', targetName: 'Arduino-LED-Blinker', targetType: 'Simulation', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
  { id: '2', type: 'simulation_run', userId: '102', username: 'tech_sid', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sid', targetName: 'ESP32-WiFi-Scanner', targetType: 'Simulation', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
  { id: '3', type: 'ai_generate', userId: '103', username: 'ai_maker', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai', targetName: 'PCB-Layout-Generator', targetType: 'AI', timestamp: new Date(Date.now() - 8 * 60 * 1000) },
  { id: '4', type: 'fork', userId: '104', username: 'fork_king', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fork', targetName: 'Smart-Irrigation', targetType: 'Project', timestamp: new Date(Date.now() - 12 * 60 * 1000) },
  { id: '5', type: 'pcb_design', userId: '105', username: 'pcb_master', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pcb', targetName: 'RGB-Controller-v2', targetType: 'PCB', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
  { id: '6', type: 'code_submit', userId: '106', username: 'code_ninja', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja', targetName: 'Weather-Station', targetType: 'Code', timestamp: new Date(Date.now() - 20 * 60 * 1000) },
  { id: '7', type: 'view', userId: '107', username: 'curious_dev', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=curious', targetName: 'PCB-RGB-Controller', targetType: 'Project', timestamp: new Date(Date.now() - 25 * 60 * 1000) },
  { id: '8', type: 'comment', userId: '108', username: 'helpful_hacker', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=helpful', targetName: 'ESP32-WiFi-Scanner', targetType: 'Discussion', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
];

export const mockSimulationUsage: SimulationUsageMetric[] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  simulations: Math.floor(Math.random() * 50) + 20,
  components: Math.floor(Math.random() * 200) + 80,
  wires: Math.floor(Math.random() * 150) + 50,
}));

export const mockStoreTraffic: StoreTrafficData[] = [
  { category: 'Microcontrollers', visitors: 4521, conversions: 234, revenue: 12450 },
  { category: 'Sensors', visitors: 3892, conversions: 189, revenue: 8930 },
  { category: 'Modules', visitors: 3156, conversions: 156, revenue: 7620 },
  { category: 'Passive Components', visitors: 2890, conversions: 278, revenue: 4560 },
  { category: 'Motors & Actuators', visitors: 1845, conversions: 87, revenue: 9870 },
  { category: 'Power Supplies', visitors: 1234, conversions: 45, revenue: 6780 },
];

export const mockAIUsage: AIUsageMetric[] = generateDateRange(14, 3000, true).map(d => ({
  date: d.date,
  queries: d.value,
  tokens: d.value * 150 + Math.floor(Math.random() * 10000),
  cost: d.value * 0.002 + Math.random() * 2,
}));

export const mockLanguageBreakdown = [
  { name: 'Arduino', value: 38, color: '#00979D' },
  { name: 'C++', value: 29, color: '#f34b7d' },
  { name: 'Python', value: 15, color: '#3572A5' },
  { name: 'JavaScript', value: 12, color: '#f1e05a' },
  { name: 'Other', value: 6, color: '#6e7681' },
];

export const mockWeeklyActivity = [
  { day: 'Mon', activity: 78 },
  { day: 'Tue', activity: 85 },
  { day: 'Wed', activity: 92 },
  { day: 'Thu', activity: 88 },
  { day: 'Fri', activity: 95 },
  { day: 'Sat', activity: 65 },
  { day: 'Sun', activity: 52 },
];