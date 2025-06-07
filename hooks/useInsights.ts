import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type UserMetric = {
  id: string;
  metric_type: 'payouts' | 'deposits' | 'active_plans' | 'transactions';
  metric_value: number;
  metric_date: string;
};

export type PerformanceTrend = {
  id: string;
  trend_type: 'monthly_growth' | 'average_payout' | 'upcoming_payouts';
  current_value: number;
  previous_value: number;
  percentage_change: number;
  period_start: string;
  period_end: string;
};

export type VaultPerformance = {
  id: string;
  payout_plan_id: string;
  total_amount: number;
  progress_percentage: number;
  next_payout_date?: string;
  status: string;
  payout_plans?: {
    name: string;
  };
};

export function useInsights() {
  const [metrics, setMetrics] = useState<UserMetric[]>([]);
  const [trends, setTrends] = useState<PerformanceTrend[]>([]);
  const [vaultPerformance, setVaultPerformance] = useState<VaultPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchInsightsData();
    }
  }, [session?.user?.id]);

  const fetchInsightsData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // First, refresh the insights data
      await supabase.rpc('refresh_insights_data', {
        p_user_id: session?.user?.id
      });

      // Fetch user metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('metric_date', new Date().toISOString().split('T')[0])
        .order('metric_type');

      if (metricsError) throw metricsError;

      // Fetch performance trends
      const { data: trendsData, error: trendsError } = await supabase
        .from('performance_trends')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (trendsError) throw trendsError;

      // Fetch vault performance
      const { data: vaultData, error: vaultError } = await supabase
        .from('vault_performance')
        .select(`
          *,
          payout_plans (
            name
          )
        `)
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (vaultError) throw vaultError;

      setMetrics(metricsData || []);
      setTrends(trendsData || []);
      setVaultPerformance(vaultData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insights data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInsights = async () => {
    await fetchInsightsData();
  };

  return {
    metrics,
    trends,
    vaultPerformance,
    isLoading,
    error,
    refreshInsights,
  };
}