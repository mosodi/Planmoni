import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Animated } from 'react-native';
import { router } from 'expo-router';
import { ArrowUpRight, ArrowDownRight, Calendar, ChevronRight, Eye, EyeOff, Lock, Plus, Send, Wallet } from 'lucide-react-native';
import { Card, Button, StatusTag, InitialsAvatar, TransactionModal } from '@/components';
import { BaseScreen } from '@/components';
import { useBalance, useAuth, useTheme, usePayoutPlans } from '@/hooks';
import { formatCurrency, formatDate, getGreeting, getDaySuffix, calculateProgress } from '@/utils';

export default function HomeScreen() {
  const { showBalances, toggleBalances, balance, lockedBalance } = useBalance();
  const { session } = useAuth();
  const { colors } = useTheme();
  const { payoutPlans, isLoading: payoutPlansLoading } = usePayoutPlans();
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstName = session?.user?.user_metadata?.first_name || 'User';
  const lastName = session?.user?.user_metadata?.last_name || '';

  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrentDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${month} ${year}`;
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
  ];

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction({
      amount: transaction.amount,
      status: transaction.type === 'Monthly Payout' ? 'Completed' : 'Processing',
      date: transaction.date,
      time: transaction.time,
      type: transaction.type,
      source: transaction.type.includes('Payout') ? 'Monthly Salary Vault' : 'GTBank (****1234)',
      destination: transaction.type.includes('Payout') ? 'GTBank (****1234)' : 'Emergency Fund Vault',
      transactionId: `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      planRef: transaction.type.includes('Payout') ? 'PLAN-MNTH-0039' : '',
      paymentMethod: 'Bank Transfer',
      initiatedBy: 'Auto-scheduler',
      processingTime: 'Instant',
    });
    setIsTransactionModalVisible(true);
  };

  const styles = createStyles(colors);

  return (
    <BaseScreen scrollable>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <InitialsAvatar firstName={firstName} lastName={lastName} size={48} fontSize={18} />
          <Text style={styles.date}>{formatCurrentDate(currentDate)}</Text>
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hi, {firstName}.</Text>
          <Text style={styles.subGreeting}>{getGreeting()}, let's plan some payments</Text>
        </View>
      </View>

      <Card style={styles.balanceCard}>
        <View style={styles.balanceLabelContainer}>
          <Text style={styles.balanceLabel}>Available Wallet Balance</Text>
          <Pressable onPress={toggleBalances} style={styles.eyeIconButton}>
            {showBalances ? <EyeOff size={16} color={colors.textSecondary} /> : <Eye size={16} color={colors.textSecondary} />}
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
          <Button title="Plan" onPress={() => router.push('/create-payout/amount')} style={styles.createButton} icon={Send} />
          <Button title="Add Funds" onPress={() => router.push('/add-funds')} style={styles.addFundsButton} icon={Wallet} />
        </View>
      </Card>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Current Month's Summary</Text>
          <Calendar size={20} color={colors.textSecondary} />
        </View>
        <View style={styles.summaryItems}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Paid Out</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPaidOut, showBalances)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pending payouts</Text>
            <Text style={styles.summaryValue}>{formatCurrency(pendingPayouts, showBalances)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Completion Rate</Text>
            <Text style={styles.summaryValue}>{completionRate}%</Text>
          </View>
        </View>
      </Card>

      {nextPayout && (
        <Card style={styles.payoutCard}>
          <View style={styles.payoutHeader}>
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
          <Pressable style={styles.viewButton} onPress={() => router.push({ pathname: '/view-payout', params: { id: nextPayout.id } })}>
            <Text style={styles.viewButtonText}>View</Text>
            <ChevronRight size={20} color={colors.text} />
          </Pressable>
        </Card>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable onPress={() => router.push('/transactions')}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        {transactions.map((transaction, index) => (
          <Pressable key={index} onPress={() => handleTransactionPress(transaction)}>
            <Card style={styles.transactionCard}>
              <View style={styles.transaction}>
                <View style={[styles.transactionIcon, { backgroundColor: transaction.positive ? '#DCFCE7' : '#FEE2E2' }]}>
                  <transaction.icon size={20} color={transaction.positive ? '#22C55E' : '#EF4444'} />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.type}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text style={[styles.transactionAmount, { color: transaction.positive ? '#22C55E' : '#EF4444' }]}>
                  {formatCurrency(parseFloat(transaction.amount.replace(/[₦,+]/g, '')), showBalances)}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      {selectedTransaction && (
        <TransactionModal
          isVisible={isTransactionModalVisible}
          onClose={() => setIsTransactionModalVisible(false)}
          transaction={selectedTransaction}
        />
      )}
    </BaseScreen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  header: { marginBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greetingContainer: { marginLeft: 0 },
  greeting: { fontSize: 24, fontWeight: '600', color: colors.text, marginBottom: 4 },
  subGreeting: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, lineHeight: 18 },
  date: { fontSize: 14, color: colors.textSecondary },
  balanceCard: { backgroundColor: colors.card, marginBottom: 24, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  balanceLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  balanceLabel: { fontSize: 14, color: colors.textSecondary },
  eyeIconButton: { padding: 8, margin: -8 },
  balanceAmount: { fontSize: 32, fontWeight: '700', color: colors.text, marginBottom: 16 },
  lockedSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 16 },
  lockedLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lockedLabel: { fontSize: 14, color: colors.textSecondary },
  lockedAmount: { fontSize: 14, fontWeight: '600', color: colors.text },
  buttonGroup: { flexDirection: 'row', gap: 12 },
  createButton: { flex: 1, backgroundColor: colors.primary },
  addFundsButton: { flex: 1, backgroundColor: colors.backgroundTertiary, borderWidth: 1, borderColor: colors.border },
  summaryCard: { marginBottom: 24, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  summaryItems: { gap: 16 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  payoutCard: { marginBottom: 24, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  payoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  payoutTitle: { fontSize: 14, color: colors.textSecondary },
  payoutAmount: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8 },
  payoutDate: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  viewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.backgroundTertiary, borderWidth: 1, borderColor: colors.border, paddingVertical: 14, borderRadius: 8, gap: 8 },
  viewButtonText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  viewAllText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  transactionCard: { marginBottom: 12, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  transaction: { flexDirection: 'row', alignItems: 'center' },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 4 },
  transactionDate: { fontSize: 12, color: colors.textSecondary },
  transactionAmount: { fontSize: 14, fontWeight: '600' },
});