import { useState, useEffect, useCallback } from 'react';
import {
  mockRealtimeStats,
  mockUserGrowth,
  mockContributionHeatmap,
  mockTopRepositories,
  mockTopContributors,
  mockEngagementMetrics,
  mockRecentActivity,
  mockSimulationUsage,
  mockStoreTraffic,
  mockAIUsage,
  mockLanguageBreakdown,
  mockWeeklyActivity,
  type RealtimeStats,
  type UserGrowthData,
  type ContributionHeatmapDay,
  type TopRepository,
  type TopContributor,
  type EngagementMetric,
  type ActivityItem,
  type SimulationUsageMetric,
  type StoreTrafficData,
  type AIUsageMetric,
} from '../data/analytics-data';

export interface UseRealtimeStatsReturn {
  stats: RealtimeStats;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRealtimeStats(): UseRealtimeStatsReturn {
  const [stats, setStats] = useState<RealtimeStats>(mockRealtimeStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        simulationsRunning: prev.simulationsRunning + Math.floor(Math.random() * 10) - 5,
        aiQueriesToday: prev.aiQueriesToday + Math.floor(Math.random() * 5),
      }));
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { stats, loading, error, refresh };
}

export interface UseUserGrowthReturn {
  data: UserGrowthData[];
  loading: boolean;
}

export function useUserGrowth(days: number = 30): UseUserGrowthReturn {
  const [data, setData] = useState<UserGrowthData[]>(mockUserGrowth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

export interface UseContributionHeatmapReturn {
  data: ContributionHeatmapDay[];
  loading: boolean;
}

export function useContributionHeatmap(): UseContributionHeatmapReturn {
  const [data, setData] = useState<ContributionHeatmapDay[]>(mockContributionHeatmap);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

export interface UseTopRepositoriesReturn {
  repositories: TopRepository[];
  loading: boolean;
  refresh: () => void;
}

export function useTopRepositories(): UseTopRepositoriesReturn {
  const [repositories, setRepositories] = useState<TopRepository[]>(mockTopRepositories);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setRepositories([...mockTopRepositories]);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { repositories, loading, refresh };
}

export interface UseTopContributorsReturn {
  contributors: TopContributor[];
  loading: boolean;
}

export function useTopContributors(): UseTopContributorsReturn {
  const [contributors, setContributors] = useState<TopContributor[]>(mockTopContributors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  return { contributors, loading };
}

export interface UseEngagementMetricsReturn {
  metrics: EngagementMetric[];
  loading: boolean;
}

export function useEngagementMetrics(): UseEngagementMetricsReturn {
  const [metrics, setMetrics] = useState<EngagementMetric[]>(mockEngagementMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  return { metrics, loading };
}

export interface UseRecentActivityReturn {
  activities: ActivityItem[];
  loading: boolean;
  refresh: () => void;
}

export function useRecentActivity(): UseRecentActivityReturn {
  const [activities, setActivities] = useState<ActivityItem[]>(mockRecentActivity);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setActivities([...mockRecentActivity]);
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  return { activities, loading, refresh };
}

export interface UseSimulationUsageReturn {
  data: SimulationUsageMetric[];
  loading: boolean;
}

export function useSimulationUsage(): UseSimulationUsageReturn {
  const [data, setData] = useState<SimulationUsageMetric[]>(mockSimulationUsage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

export interface UseStoreTrafficReturn {
  data: StoreTrafficData[];
  loading: boolean;
}

export function useStoreTraffic(): UseStoreTrafficReturn {
  const [data, setData] = useState<StoreTrafficData[]>(mockStoreTraffic);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

export interface UseAIUsageReturn {
  data: AIUsageMetric[];
  loading: boolean;
}

export function useAIUsage(): UseAIUsageReturn {
  const [data, setData] = useState<AIUsageMetric[]>(mockAIUsage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

export function useLanguageBreakdown() {
  return { data: mockLanguageBreakdown, loading: false };
}

export function useWeeklyActivity() {
  return { data: mockWeeklyActivity, loading: false };
}