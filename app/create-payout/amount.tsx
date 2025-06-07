import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Info } from 'lucide-react-native';
import { BaseScreen, Header, Button } from '@/components';
import { useTheme } from '@/hooks';

export default function AmountScreen() {
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [availableBalance] = useState('15,750,000');

  const handleContinue = () => {
    router.push({ pathname: '/create-payout/schedule', params: { totalAmount: amount } });
  };

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (value: string) => {
    setAmount(formatAmount(value));
  };

  const styles = createStyles(colors);

  return (
    <BaseScreen>
      <Header title="New Payout plan" showBack />
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '20%' }]} />
        </View>
        <Text style={styles.stepText}>Step 1 of 5</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What is the total amount for this payout?</Text>
        <Text style={styles.description}>You won't be able to spend from this until your payout date.</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
          />
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>₦{availableBalance}</Text>
            <Pressable style={styles.maxButton} onPress={() => setAmount(availableBalance)}>
              <Text style={styles.maxButtonText}>Max</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.notice}>
          <Info size={20} color={colors.primary} />
          <Text style={styles.noticeText}>
            This amount will be secured in your vault and cannot be accessed until your scheduled payout dates.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} style={styles.continueButton} disabled={!amount} />
      </View>
    </BaseScreen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  progressContainer: { padding: 20, backgroundColor: colors.surface },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#1E3A8A', borderRadius: 2 },
  stepText: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '600', color: colors.text, marginBottom: 8 },
  description: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },
  amountContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundTertiary, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  currencySymbol: { fontSize: 24, fontWeight: '600', color: colors.textSecondary, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: '600', color: colors.text },
  balanceContainer: { marginBottom: 24 },
  balanceLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceAmount: { fontSize: 16, fontWeight: '600', color: colors.text },
  maxButton: { backgroundColor: '#1E3A8A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  maxButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, borderLeftColor: colors.primary, padding: 16, borderRadius: 12 },
  noticeText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  continueButton: { backgroundColor: '#1E3A8A' },
});