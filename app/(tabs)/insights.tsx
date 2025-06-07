import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { TrendingUp, TrendingDown, Users, ArrowUpRight, ArrowDownRight, Wallet, Clock, Calendar, Send, RefreshCw } from 'lucide-react-native';
import Card from '@/components/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useInsights } from '@/hooks/useInsights';
import { useBalance } from '@/contexts/BalanceContext';
import { formatCurrency } from '@/utils/formatters';

export default function InsightsScreen() {
  const { colors } = useTheme();
  const { showBalances } = useBalance();
  const { metrics, trends, vaultPerformance, isLoading, error, refreshInsights } = useInsights();

  const getMetricValue = (type: string) => {
    const metric = metrics.find(m => m.metric_type === type);
    return metric?.metric_value || 0;
  };

  const getTrendValue = (type: string) => {
    const trend = trends.find(t => t.trend_type === type);
    return trend || null;
  };

  const formatTrendValue = (value: number, type: string) => {
    if (type === 'monthly_growth' || type === 'upcoming_payouts') {
      return formatCurrency(value, showBalances);
    }
    return formatCurrency(value, showBalances);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const monthlyGrowth = getTrendValue('monthly_growth');
  const averagePayout = getTrendValue('average_payout');
  const upcomingPayouts = getTrendValue('upcoming_payouts');

  const metricsData = [
    {
      title: 'Payouts',
      value: formatCurrency(getMetricValue('payouts'), showBalances),
      change: monthlyGrowth ? formatPercentage(monthlyGrowth.percentage_change) : '+0%',
      positive: monthlyGrowth ? monthlyGrowth.percentage_change >= 0 : true,
      icon: Send,
      description: 'Total payouts this month',
    },
    {
      title: 'Deposits',
      value: formatCurrency(getMetricValue('deposits'), showBalances),
      change: '+18.2%', // This could be calculated from historical data
      positive: true,
      icon: Wallet,
      description: 'Total deposits this month',
    },
    {
      title: 'Active',
      value: getMetricValue('active_plans').toString(),
      change: '+2',
      positive: true,
      icon: Clock,
      description: 'Currently active payouts',
    },
    {
      title: 'Txns',
      value: getMetricValue('transactions').toString(),
      change: '+2.4%',
      positive: true,
      icon: TrendingUp,
      description: 'Total payout transactions',
    },
  ];

  const trendsData = [
    {
      title: 'Monthly Growth',
      value: monthlyGrowth ? formatPercentage(monthlyGrowth.percentage_change) : '+0%',
      description: 'Compared to last month',
      positive: monthlyGrowth ? monthlyGrowth.percentage_change >= 0 : true,
      details: [
        { 
          label: 'Last Month', 
          value: monthlyGrowth ? formatCurrency(monthlyGrowth.previous_value, showBalances) : formatCurrency(0, showBalances)
        },
        { 
          label: 'This Month', 
          value: monthlyGrowth ? formatCurrency(monthlyGrowth.current_value, showBalances) : formatCurrency(0, showBalances)
        },
      ],
    },
    {
      title: 'Average Payout',
      value: averagePayout ? formatCurrency(averagePayout.current_value, showBalances) : formatCurrency(0, showBalances),
      description: averagePayout && averagePayout.percentage_change !== 0 
        ? `${formatCurrency(Math.abs(averagePayout.current_value - averagePayout.previous_value), showBalances)} ${averagePayout.percentage_change >= 0 ? 'more' : 'less'} than usual`
        : 'No change from previous period',
      positive: averagePayout ? averagePayout.percentage_change >= 0 : true,
      details: [
        { 
          label: 'Previous Avg', 
          value: averagePayout ? formatCurrency(averagePayout.previous_value, showBalances) : formatCurrency(0, showBalances)
        },
        { 
          label: 'Current Avg', 
          value: averagePayout ? formatCurrency(averagePayout.current_value, showBalances) : formatCurrency(0, showBalances)
        },
      ],
    },
    {
      title: 'Upcoming Payouts',
      value: upcomingPayouts ? formatCurrency(upcomingPayouts.current_value, showBalances) : formatCurrency(0, showBalances),
      description: 'Next 30 days',
      positive: true,
      details: [
        { label: 'This Week', value: formatCurrency(0, showBalances) }, // Could be calculated
        { label: 'Next Week', value: formatCurrency(0, showBalances) }, // Could be calculated
      ],
    },
  ];

  const styles = createStyles(colors);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <Pressable style={styles.refreshButton} onPress={refreshInsights}>
            <RefreshCw size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <Pressable style={styles.refreshButton} onPress={refreshInsights}>
            <RefreshCw size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={refreshInsights}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <Pressable style={styles.refreshButton} onPress={refreshInsights}>
          <RefreshCw size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.contentPadding}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {metricsData.map((metric, index) => (
              <Card key={index} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>{metric.title}</Text>
                  <View style={[
                    styles.metricIcon,
                    { backgroundColor: metric.positive ? '#DCFCE7' : '#FEE2E2' }
                  ]}>
                    <metric.icon
                      size={20}
                      color={metric.positive ? '#22C55E' : '#EF4444'}
                    />
                  </View>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <View style={styles.metricChange}>
                  {metric.positive ? (
                    <ArrowUpRight size={16} color="#22C55E" />
                  ) : (
                    <ArrowDownRight size={16} color="#EF4444" />
                  )}
                  <Text
                    style={[
                      styles.metricChangeText,
                      { color: metric.positive ? '#22C55E' : '#EF4444' },
                    ]}>
                    {metric.change}
                  </Text>
                </View>
                <Text style={styles.metricDescription}>{metric.description}</Text>
              </Card>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Trends</Text>
            {trendsData.map((trend, index) => (
              <Card key={index} style={styles.trendCard}>
                <View style={styles.trendContent}>
                  <View>
                    <Text style={styles.trendTitle}>{trend.title}</Text>
                    <Text style={styles.trendDescription}>{trend.description}</Text>
                    <View style={styles.trendDetails}>
                      {trend.details.map((detail, i) => (
                        <View key={i} style={styles.detailItem}>
                          <Text style={styles.detailLabel}>{detail.label}</Text>
                          <Text style={styles.detailValue}>{detail.value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={[
                    styles.trendValue,
                    { backgroundColor: trend.positive ? '#F0FDF4' : '#FEF2F2' }
                  ]}>
                    <Text style={[
                      styles.trendValueText,
                      { color: trend.positive ? '#22C55E' : '#EF4444' }
                    ]}>
                      {trend.value}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vault Performance</Text>
            {vaultPerformance.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active vaults found</Text>
                <Text style={styles.emptySubtext}>Create a payout plan to see vault performance data</Text>
              </Card>
            ) : (
              vaultPerformance.map((vault) => (
                <Card key={vault.id} style={styles.vaultCard}>
                  <View style={styles.vaultHeader}>
                    <Text style={styles.vaultTitle}>{vault.payout_plans?.name || 'Unnamed Vault'}</Text>
                    <View style={[
                      styles.vaultStatus,
                      { backgroundColor: vault.status === 'active' ? '#DCFCE7' : '#FEF3C7' }
                    ]}>
                      <Text style={[
                        styles.vaultStatusText,
                        { color: vault.status === 'active' ? '#22C55E' : '#D97706' }
                      ]}>{vault.status.charAt(0).toUpperCase() + vault.status.slice(1)}</Text>
                    </View>
                  </View>
                  <View style={styles.vaultStats}>
                    <View style={styles.vaultStat}>
                      <Text style={styles.vaultStatLabel}>Total</Text>
                      <Text style={styles.vaultStatValue}>{formatCurrency(vault.total_amount, showBalances)}</Text>
                    </View>
                    <View style={styles.vaultStat}>
                      <Text style={styles.vaultStatLabel}>Progress</Text>
                      <Text style={styles.vaultStatValue}>{vault.progress_percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.vaultStat}>
                      <Text style={styles.vaultStatLabel}>Next Payout</Text>
                      <Text style={styles.vaultStatValue}>
                        {vault.next_payout_date 
                          ? new Date(vault.next_payout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'N/A'
                        }
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(vault.progress_percentage, 100)}%` }
                      ]} 
                    />
                  </View>
                </Card>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '48%',
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  metricChangeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  trendCard: {
    marginBottom: 12,
  },
  trendContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  trendDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  trendDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  trendValue: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trendValueText: {
    fontSize: 16,
    fontWeight: '600',
  },
  vaultCard: {
    marginBottom: 12,
    padding: 16,
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vaultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  vaultStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vaultStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  vaultStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  vaultStat: {
    alignItems: 'center',
  },
  vaultStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  vaultStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});