import Button from '@/components/Button';
import InitialsAvatar from '@/components/InitialsAvatar';
import SettingsModal from '@/components/SettingsModal';
import { useAuth } from '@/contexts/AuthContext';
import { useBalance } from '@/contexts/BalanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { Bell, Mail, PencilLine, Phone, User, Building2, Gift, CircleHelp as HelpCircle, Languages, Link2, Lock, LogOut, MessageSquare, Moon, Shield, FileSliders as Sliders, FileText as Terms, ChevronRight, Eye, Fingerprint, Clock, DollarSign } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ModalType = 'account-statement' | 'help-center' | 'language' | 'logout' | 
                 'notifications' | 'security' | 'support' | 'terms' | 'two-factor' | 
                 'referral' | 'delete-account' | null;

export default function SettingsScreen() {
  const { session } = useAuth();
  const { showBalances, toggleBalances } = useBalance();
  const { theme, setTheme, colors } = useTheme();
  const firstName = session?.user?.user_metadata?.first_name || '';
  const lastName = session?.user?.user_metadata?.last_name || '';
  const email = session?.user?.email || '';

  const [biometrics, setBiometrics] = useState(true);
  const [vaultAlerts, setVaultAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [expiryReminders, setExpiryReminders] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleViewProfile = () => router.push('/profile');
  const handleViewLinkedAccounts = () => router.push('/linked-accounts');
  const handleViewReferral = () => router.push('/referral');
  const handleChangePassword = () => router.push('/change-password');
  const handleTwoFactorAuth = () => router.push('/two-factor-auth');
  const handleTransactionLimits = () => router.push('/transaction-limits');
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => setTheme(newTheme);

  const settingItems = [
    // Preferences
    {
      section: 'Preferences',
      items: [
        {
          icon: Eye,
          iconBg: '#EFF6FF',
          iconColor: '#3B82F6',
          label: 'Show Dashboard Balances',
          description: 'Hide or display wallet and vault balances on your dashboard',
          type: 'switch',
          value: showBalances,
          onToggle: toggleBalances,
        },
        {
          icon: Fingerprint,
          iconBg: '#F0FDF4',
          iconColor: '#22C55E',
          label: 'Enable Biometrics',
          description: 'Use biometrics to sign in or approve vault actions',
          type: 'switch',
          value: biometrics,
          onToggle: setBiometrics,
        },
      ],
    },
    // Account Management
    {
      section: 'Account Management',
      items: [
        {
          icon: Terms,
          iconBg: colors.backgroundTertiary,
          iconColor: colors.textSecondary,
          label: 'Generate Account Statement',
          description: 'PDF/CSV export, custom range',
          type: 'modal',
          modalType: 'account-statement' as ModalType,
        },
        {
          icon: Building2,
          iconBg: '#F0F9FF',
          iconColor: '#0EA5E9',
          label: 'Linked Bank Accounts',
          description: 'Manage, verify, add/remove',
          type: 'navigation',
          onPress: handleViewLinkedAccounts,
        },
        {
          icon: DollarSign,
          iconBg: '#FEF3C7',
          iconColor: '#D97706',
          label: 'Transaction Limits',
          description: 'Set daily and per-transaction limits',
          type: 'navigation',
          onPress: handleTransactionLimits,
        },
        {
          icon: Gift,
          iconBg: '#FDF2F8',
          iconColor: '#EC4899',
          label: 'Referral Program',
          description: 'Your code & bonuses',
          type: 'navigation',
          onPress: handleViewReferral,
        },
      ],
    },
    // Security
    {
      section: 'Security',
      items: [
        {
          icon: Lock,
          iconBg: '#FEE2E2',
          iconColor: '#EF4444',
          label: 'Change Password',
          type: 'navigation',
          onPress: handleChangePassword,
        },
        {
          icon: Shield,
          iconBg: '#F0FDF4',
          iconColor: '#22C55E',
          label: 'Two-Factor Authentication',
          type: 'navigation',
          onPress: handleTwoFactorAuth,
        },
      ],
    },
    // Notifications
    {
      section: 'Notifications',
      items: [
        {
          icon: Bell,
          iconBg: '#FEF9C3',
          iconColor: '#CA8A04',
          label: 'Vault Payout Alerts',
          type: 'switch',
          value: vaultAlerts,
          onToggle: setVaultAlerts,
        },
        {
          icon: Shield,
          iconBg: '#EFF6FF',
          iconColor: '#3B82F6',
          label: 'New Login Notifications',
          type: 'switch',
          value: loginAlerts,
          onToggle: setLoginAlerts,
        },
        {
          icon: Clock,
          iconBg: '#F5F3FF',
          iconColor: '#8B5CF6',
          label: 'Plan Expiry Reminders',
          type: 'switch',
          value: expiryReminders,
          onToggle: setExpiryReminders,
        },
        {
          icon: Sliders,
          iconBg: colors.backgroundTertiary,
          iconColor: colors.textSecondary,
          label: 'Customize Notifications',
          type: 'modal',
          modalType: 'notifications' as ModalType,
        },
      ],
    },
    // App & Support
    {
      section: 'App & Support',
      items: [
        {
          icon: HelpCircle,
          iconBg: '#FFF7ED',
          iconColor: '#F97316',
          label: 'Help Center',
          type: 'modal',
          modalType: 'help-center' as ModalType,
        },
        {
          icon: MessageSquare,
          iconBg: '#EFF6FF',
          iconColor: '#3B82F6',
          label: 'Contact Support',
          type: 'modal',
          modalType: 'support' as ModalType,
        },
        {
          icon: Languages,
          iconBg: '#F0FDF4',
          iconColor: '#22C55E',
          label: 'Language Preference',
          type: 'modal',
          modalType: 'language' as ModalType,
        },
        {
          icon: Terms,
          iconBg: colors.backgroundTertiary,
          iconColor: colors.textSecondary,
          label: 'Terms & Privacy',
          type: 'modal',
          modalType: 'terms' as ModalType,
        },
      ],
    },
  ];

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileSection}>
          <Pressable style={styles.profileInfo} onPress={handleViewProfile}>
            <InitialsAvatar 
              firstName={firstName} 
              lastName={lastName} 
              size={48}
              fontSize={20}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{firstName} {lastName}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {settingItems.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            
            {section.items.map((item, index) => (
              <View key={index}>
                {item.type === 'switch' ? (
                  <View style={styles.settingItem}>
                    <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
                      <item.icon size={20} color={item.iconColor} />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {item.description && (
                        <Text style={styles.settingDescription}>{item.description}</Text>
                      )}
                    </View>
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.borderSecondary, true: '#93C5FD' }}
                      thumbColor={item.value ? '#3B82F6' : colors.backgroundTertiary}
                    />
                  </View>
                ) : (
                  <Pressable 
                    style={styles.settingItem}
                    onPress={() => {
                      if (item.type === 'modal') {
                        setActiveModal(item.modalType);
                      } else if (item.onPress) {
                        item.onPress();
                      }
                    }}
                  >
                    <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
                      <item.icon size={20} color={item.iconColor} />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {item.description && (
                        <Text style={styles.settingDescription}>{item.description}</Text>
                      )}
                    </View>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </Pressable>
                )}
              </View>
            ))}

            {section.section === 'App & Support' && (
              <View style={styles.settingItem}>
                <View style={[styles.settingIcon, { backgroundColor: colors.backgroundTertiary }]}>
                  <Moon size={20} color={colors.textSecondary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Theme</Text>
                  <Text style={styles.settingDescription}>
                    {theme === 'system' ? 'Follow system' : theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </Text>
                </View>
                <View style={styles.themeSelector}>
                  {(['light', 'dark', 'system'] as const).map((themeOption) => (
                    <Pressable
                      key={themeOption}
                      style={[styles.themeOption, theme === themeOption && styles.activeThemeOption]}
                      onPress={() => handleThemeChange(themeOption)}
                    >
                      <Text style={[styles.themeOptionText, theme === themeOption && styles.activeThemeOptionText]}>
                        {themeOption === 'system' ? 'Auto' : themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}

        <View style={styles.footer}>
          <Pressable 
            style={styles.logoutButton}
            onPress={() => setActiveModal('logout')}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>

          <Pressable 
            style={styles.deleteAccount}
            onPress={() => setActiveModal('delete-account')}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </Pressable>
        </View>
      </ScrollView>

      <SettingsModal
        isVisible={activeModal !== null}
        onClose={() => setActiveModal(null)}
        type={activeModal || 'help-center'}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  profileSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  themeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 8,
    padding: 2,
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  activeThemeOption: {
    backgroundColor: colors.primary,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeThemeOptionText: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    gap: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteAccount: {
    alignItems: 'center',
  },
  deleteText: {
    color: colors.textTertiary,
    fontSize: 14,
  },
});