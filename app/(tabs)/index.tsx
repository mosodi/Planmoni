import React, { useState, useEffect } from 'react';
import ScreenLayout from '@/components/ScreenLayout';
import Card from '@/components/Card';
import TransactionModal from '@/components/TransactionModal';
import InitialsAvatar from '@/components/InitialsAvatar';
import StatusTag from '@/components/StatusTag';
import InfoBox from '@/components/InfoBox';
import DetailRow from '@/components/DetailRow';
import ListItem from '@/components/ListItem';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowDown, 
  ArrowDownRight, 
  ArrowRight, 
  ArrowUpRight, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Lock, 
  Plus, 
  Send, 
  Wallet,
  TrendingUp,
  Clock
} from 'lucide-react-native';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { useBalance } from '@/contexts/BalanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePayoutPlans } from '@/hooks/usePayoutPlans';
import { formatCurrency, formatDate, getGreeting, getDaySuffix, calculateProgress } from '@/utils/formatters';
import { createCommonStyles } from '@/styles/common';

export default function HomeScreen() {
  const { showBalances, toggleBalances, balance, lockedBalance } = useBalance();
  const { session } = useAuth();
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  const { payoutPlans, isLoading: payoutPlansLoading } = usePayoutPlans();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstName = session?.user?.user_metadata?.first_name || 'User';
  const lastName = session?.user?.user_metadata?.last_name || '';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrentDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${month} ${year}`;
  };

  const handleAddFunds = () => router.push('/add-funds');
  const handleCreatePayout = () => router.push('/create-payout/amount');
  const handleViewPayout = (id?: string) => {
    if (id) {
      router.push({ pathname: '/view-payout', params: { id } });
    } else {
      router.push('/view-payout');
    }
  };
  const handleViewAllPayouts = () => router.push('/all-payouts');

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction({
      amount: transaction.amount,
      status: transaction.type === 'Monthly Payout' ? 'Completed' : 
             transaction.type === 'Vault Deposit' ? 'Processing' :
             transaction.type === 'Rent Payment' ? 'Scheduled' : 'Failed',
      date: transaction.date,
      time: transaction.time,
      type: transaction.type,
      source: transaction.type.includes('Payout') ? 'Monthly Salary Vault' :
             transaction.type === 'Vault Deposit' ? 'GTBank (****1234)' : 'Available Balance',
      destination: transaction.type.includes('Payout') ? 'GTBank (****1234)' :
                  transaction.type === 'Vault Deposit' ? 'Emergency Fund Vault' : 'Rent Vault',
      transactionId: `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      planRef: transaction.type.includes('Payout') ? 'PLAN-MNTH-0039' : '',
      paymentMethod: 'Bank Transfer',
      initiatedBy: transaction.type.includes('scheduled') ? 'Auto-scheduler' : 'You',
      processingTime: transaction.type.includes('Payout') ? 'Instant' : '2-3 business days',
    });
    setIsTransactionModalVisible(true);
  };

  const activePlans = payoutPlans.filter(plan => plan.status === 'active').slice(0, 3);
  const nextPayout = activePlans.find(plan => plan.next_payout_date);

  const totalPaidOut = payoutPlans.reduce((sum, plan) => 
    sum + (plan.completed_payouts * plan.payout_amount), 0
  );
  
  const pendingPayouts = payoutPlans
    .filter(plan => plan.status === 'active')
    .reduce((sum, plan) => 
      sum + ((plan.duration - plan.completed_payouts) * plan.payout_amount), 0
    );

  const completionRate = payoutPlans.length > 0 
    ? Math.round((payoutPlans.filter(plan => plan.status === 'completed').length / payoutPlans.length) * 100)
    : 0;

  const transactions = [
    {
      type: 'Monthly Payout',
      date: 'Dec 1, 2024',
      time: '9:15 AM',
      amount: '+₦500,000.00',
      positive: true,
      icon: ArrowUpRight,
    },
    {
      type: 'Vault Deposit',
      date: 'Nov 28, 2024',
      time: '3:00 PM',
      amount: '-₦3,000,000.00',
      positive: false,
      icon: ArrowDownRight,
    },
    {
      type: 'Rent Payment',
      date: 'Nov 25, 2024',
      time: '3:00 PM',
      amount: '-₦750,000.00',
      positive: false,
      icon: ArrowDown,
    },
    {
      type: 'Investment Return',
      date: 'Nov 22, 2024',
      time: '11:30 AM',
      amount: '+₦1,200,000.00',
      positive: true,
      icon: ArrowUpRight,
    },
  ];

  const styles = createStyles(colors);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <InitialsAvatar 
          firstName={firstName} 
          lastName={lastName} 
          size={48}
          fontSize={18}
        />
        <Text style={styles.date}>{formatCurrentDate(currentDate)}</Text>
      </View>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hi, {firstName}.</Text>
        <Text style={styles.subGreeting}>{getGreeting()}, let's plan some payments</Text>
      </View>
    </View>
  );

  const renderBalanceCard = () => (
    <Card style={styles.balanceCard}>
      <View style={styles.balanceLabelContainer}>
        <Text style={styles.balanceLabel}>Available Wallet Balance</Text>
        <Pressable 
          onPress={toggleBalances}
          style={styles.eyeIconButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          {showBalances ? (
            <EyeOff size={16} color={colors.textSecondary} />
          ) : (
            <Eye size={16} color={colors.textSecondary} />
          )}
        </Pressable>
      </View>
      <Text style={styles.balanceAmount}>{formatCurrency(balance, showBalances)}</Text>
      
      <View style={styles.lockedSection}>
        <View style={styles.lockedLabelContainer}>
          <Lock size={16} color={colors.textSecondary} />
          <Text style={styles.lockedLabel}>Locked for payouts</Text>
        </View>
        <Text style={styles.lockedAmount}>{formatCurrency(lockedBalance, showBalances)}</Text>
      </View>
      
      <View style={styles.buttonGroup}>
        <Pressable style={[commonStyles.buttonBase, commonStyles.primaryButton, styles.createButton]} onPress={handleCreatePayout}>
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Plan</Text>
        </Pressable>
        <Pressable style={[commonStyles.buttonBase, commonStyles.secondaryButton, styles.addFundsButton]} onPress={handleAddFunds}>
          <Wallet size={20} color={colors.text} />
          <Text style={styles.addFundsText}>Add Funds</Text>
        </Pressable>
      </View>
    </Card>
  );

  const renderSummaryCard = () => (
    <Card style={styles.summaryCard}>
      <View style={commonStyles.cardHeader}>
        <Text style={commonStyles.sectionTitle}>Current Month's Summary</Text>
        <Calendar size={20} color={colors.textSecondary} />
      </View>
      
      <View style={styles.summaryItems}>
        <DetailRow label="Total Paid Out" value={formatCurrency(totalPaidOut, showBalances)} />
        <DetailRow label="Pending payouts" value={formatCurrency(pendingPayouts, showBalances)} />
        <DetailRow label="Completion Rate" value={`${completionRate}%`} />
      </View>
      
      {isSummaryExpanded && (
        <View style={styles.expandedContent}>
          <DetailRow label="Active Plans" value={activePlans.length.toString()} />
          <DetailRow label="Total Plans" value={payoutPlans.length.toString()} />
          <DetailRow label="Last payout date" value={payoutPlans.length > 0 ? 'June 2, 2025' : 'No payouts yet'} />
        </View>
      )}
      
      <Pressable 
        style={styles.seeMoreButton} 
        onPress={() => setIsSummaryExpanded(!isSummaryExpanded)}
      >
        <Text style={styles.seeMoreText}>
          {isSummaryExpanded ? 'Show less' : 'See more'}
        </Text>
        {isSummaryExpanded ? (
          <ChevronUp size={16} color={colors.primary} />
        ) : (
          <ChevronDown size={16} color={colors.primary} />
        )}
      </Pressable>
    </Card>
  );

  const renderNextPayoutCard = () => {
    if (!nextPayout) return null;

    return (
      <Card style={styles.payoutCard}>
        <View style={commonStyles.cardHeader}>
          <Text style={styles.payoutTitle}>Next Payout</Text>
          <StatusTag status={nextPayout.status as any} />
        </View>
        <Text style={styles.payoutAmount}>{formatCurrency(nextPayout.payout_amount, showBalances)}</Text>
        <Text style={styles.payoutDate}>
          {nextPayout.next_payout_date 
            ? `${new Date(nextPayout.next_payout_date).toLocaleDateString()} • ${Math.ceil((new Date(nextPayout.next_payout_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`
            : 'Date not set'
          }
        </Text>
        <View style={styles.payoutActions}>
          <Pressable style={[commonStyles.buttonBase, commonStyles.secondaryButton, styles.viewButton]} onPress={() => handleViewPayout(nextPayout.id)}>
            <Text style={styles.viewButtonText}>View</Text>
            <ChevronRight size={20} color={colors.text} />
          </Pressable>
        </View>
      </Card>
    );
  };

  const renderPayoutPlans = () => (
    <View style={styles.section}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, commonStyles.marginBottom16]}>
        <Text style={commonStyles.sectionTitle}>Your payouts</Text>
        <Pressable onPress={handleViewAllPayouts}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      
      {payoutPlansLoading ? (
        <InfoBox type="info" message="Loading your payout plans..." />
      ) : activePlans.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.payoutPlansContainer}
        >
          {activePlans.map((plan) => {
            const progress = calculateProgress(plan.completed_payouts, plan.duration);
            const completedAmount = plan.completed_payouts * plan.payout_amount;
            
            return (
              <Card key={plan.id} style={styles.payoutPlanCard}>
                <View style={commonStyles.cardHeader}>
                  <Text style={styles.planType}>{plan.name}</Text>
                  <StatusTag status={plan.status as any} size="small" />
                </View>
                <Text style={styles.planAmount}>{formatCurrency(plan.total_amount, showBalances)}</Text>
                <View style={styles.planDetails}>
                  <Text style={styles.planFrequency}>
                    {plan.frequency.charAt(0).toUpperCase() + plan.frequency.slice(1)}
                  </Text>
                  <Text style={styles.planDot}>•</Text>
                  <Text style={styles.planValue}>{formatCurrency(plan.payout_amount, showBalances)}</Text>
                </View>
                <View style={[commonStyles.progressBar, commonStyles.marginBottom8]}>
                  <View style={[commonStyles.progressFill, { width: `${progress}%` }]} />
                </View>
                <View style={styles.planProgress}>
                  <Text style={styles.progressText}>
                    {formatCurrency(completedAmount, showBalances)}/{formatCurrency(plan.total_amount, showBalances)}
                  </Text>
                  <Text style={styles.progressCount}>
                    {plan.completed_payouts}/{plan.duration}
                  </Text>
                </View>
                <Text style={styles.nextPayoutDate}>
                  Next payout: {plan.next_payout_date 
                    ? new Date(plan.next_payout_date).toLocaleDateString()
                    : 'Not scheduled'
                  }
                </Text>
                <Pressable 
                  style={[commonStyles.buttonBase, commonStyles.secondaryButton, styles.planViewButton]}
                  onPress={() => handleViewPayout(plan.id)}
                >
                  <Text style={styles.planViewButtonText}>View</Text>
                  <ChevronRight size={16} color={colors.primary} />
                </Pressable>
              </Card>
            );
          })}
          <Pressable 
            style={styles.addPayoutCard}
            onPress={handleCreatePayout}
          >
            <Plus size={24} color={colors.primary} />
            <Text style={styles.addPayoutText}>Create New Payout</Text>
            <Text style={styles.addPayoutDescription}>
              Set up a new automated payout plan
            </Text>
          </Pressable>
        </ScrollView>
      ) : (
        <InfoBox 
          type="info" 
          title="No active payout plans"
          message={
            <View style={styles.emptyPayoutsContainer}>
              <Text style={styles.emptyPayoutsDescription}>
                Create your first payout plan to start automating your financial goals
              </Text>
              <Pressable style={[commonStyles.buttonBase, commonStyles.primaryButton, styles.createFirstPayoutButton]} onPress={handleCreatePayout}>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.createFirstPayoutText}>Create Your First Plan</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );

  const renderTransactions = () => (
    <View style={styles.section}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, commonStyles.marginBottom16]}>
        <Text style={commonStyles.sectionTitle}>Recent Transactions</Text>
        <Pressable onPress={() => router.push('/transactions')}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      
      {transactions.map((transaction, index) => (
        <ListItem
          key={index}
          title={transaction.type}
          subtitle={transaction.date}
          icon={transaction.icon}
          iconColor={transaction.positive ? '#22C55E' : '#EF4444'}
          iconBackground={transaction.positive ? '#DCFCE7' : '#FEE2E2'}
          rightElement={
            <Text style={[
              styles.transactionAmount,
              { color: transaction.positive ? '#22C55E' : '#EF4444' }
            ]}>
              {formatCurrency(parseFloat(transaction.amount.replace(/[₦,+]/g, '')), showBalances)}
            </Text>
          }
          onPress={() => handleTransactionPress(transaction)}
        />
      ))}
      
      <Pressable 
        style={styles.viewAllTransactionsButton}
        onPress={() => router.push('/transactions')}
      >
        <Text style={styles.viewAllTransactionsText}>View All Transactions</Text>
        <ChevronRight size={20} color={colors.primary} />
      </Pressable>
    </View>
  );

  return (
    <ScreenLayout 
      headerElement={renderHeader()}
      contentStyle={styles.content}
    >
      {renderBalanceCard()}
      {renderSummaryCard()}
      {renderNextPayoutCard()}
      {renderPayoutPlans()}
      {renderTransactions()}

      {selectedTransaction && (
        <TransactionModal
          isVisible={isTransactionModalVisible}
          onClose={() => setIsTransactionModalVisible(false)}
          transaction={selectedTransaction}
        />
      )}
    </ScreenLayout>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingContainer: {
    marginLeft: 0,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceCard: {
    marginBottom: 24,
    paddingVertical: 1,
    paddingHorizontal: 1,
  },
  balanceLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eyeIconButton: {
    padding: 8,
    margin: -8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  lockedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 16,
  },
  lockedLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockedLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lockedAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  createButton: {
    flex: 1,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addFundsButton: {
    flex: 1,
  },
  addFundsText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  summaryItems: {
    paddingHorizontal: 1,
    gap: 16,
  },
  expandedContent: {
    paddingHorizontal: 1,
    paddingTop: 16,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
  },
  seeMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  payoutCard: {
    marginBottom: 24,
    padding: 1,
  },
  payoutTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  payoutAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  payoutDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  payoutActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
  },
  viewButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  payoutPlansContainer: {
    paddingRight: 1,
  },
  payoutPlanCard: {
    width: 300,
    marginRight: 16,
    padding: 1,
    marginBottom: 10,
  },
  planType: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  planDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  planFrequency: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planDot: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  nextPayoutDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  planViewButton: {
    paddingVertical: 12,
  },
  planViewButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  addPayoutCard: {
    width: 300,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPayoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  addPayoutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyPayoutsContainer: {
    alignItems: 'center',
    gap: 16,
  },
  emptyPayoutsDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  createFirstPayoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  createFirstPayoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllTransactionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  viewAllTransactionsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});