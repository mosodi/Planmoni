import Button from '@/components/Button';
import ScreenLayout from '@/components/ScreenLayout';
import InfoBox from '@/components/InfoBox';
import { router } from 'expo-router';
import { Copy } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/styles/common';

export default function AddFundsScreen() {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);

  const handleCopyAccountNumber = () => {
    // Implement copy functionality
  };

  const handleMoreDepositMethods = () => {
    router.push('/deposit-flow/payment-methods');
  };

  const styles = createStyles(colors);

  return (
    <ScreenLayout 
      title="Add Funds" 
      showBackButton 
      contentStyle={styles.content}
    >
      <Text style={commonStyles.title}>Add funds via <Text style={styles.highlight}>Bank Transfer</Text></Text>
      <Text style={commonStyles.description}>
        Money Transfers sent to this bank account number will automatically top up your Planmoni available wallet.
      </Text>

      <View style={[commonStyles.cardBase, styles.accountDetailsCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>9PBS Account Details</Text>
          <Text style={commonStyles.description}>Use these details to receive funds directly</Text>
        </View>

        <View style={styles.fieldsContainer}>
          <View style={styles.field}>
            <Text style={commonStyles.label}>Account Number</Text>
            <View style={styles.accountNumberContainer}>
              <Text style={styles.accountNumber}>9002893892</Text>
              <Pressable onPress={handleCopyAccountNumber} style={styles.copyButton}>
                <Copy size={20} color={colors.primary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={commonStyles.label}>Bank Name</Text>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValue}>9Payment Service Bank (9PSB)</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={commonStyles.label}>Account Name</Text>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValue}>John Doe Planmoni</Text>
            </View>
          </View>
        </View>
      </View>

      <InfoBox
        type="info"
        title="Security Notice"
        message="Funds will be added to your secure wallet and can be used for transactions or investments. Processing time is typically instant to 5 minutes."
      />

      <View style={commonStyles.footer}>
        <Button 
          title="Done"
          onPress={() => router.back()}
          style={[commonStyles.buttonBase, commonStyles.primaryButton]}
        />
        <Pressable onPress={handleMoreDepositMethods} style={styles.moreMethodsButton}>
          <Text style={styles.moreMethodsText}>More deposit methods</Text>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  highlight: {
    color: colors.primary,
  },
  accountDetailsCard: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundTertiary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  fieldsContainer: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 12,
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 1,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldValueContainer: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 12,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  moreMethodsButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  moreMethodsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});