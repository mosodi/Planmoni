import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
import { router } from 'expo-router';
import { Bell, Mail, User, Shield, LogOut, ChevronRight, Eye, Fingerprint, Moon } from 'lucide-react-native';
import { BaseScreen, Header, Button, InitialsAvatar, SettingsModal } from '@/components';
import { useAuth, useBalance, useTheme } from '@/hooks';

type ModalType = 'help-center' | 'language' | 'logout' | 'notifications' | 'security' | 'support' | 'terms' | null;

export default function SettingsScreen() {
  const { session, signOut } = useAuth();
  const { showBalances, toggleBalances } = useBalance();
  const { theme, setTheme, colors } = useTheme();
  const [biometrics, setBiometrics] = useState(true);
  const [vaultAlerts, setVaultAlerts] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const firstName = session?.user?.user_metadata?.first_name || '';
  const lastName = session?.user?.user_metadata?.last_name || '';
  const email = session?.user?.email || '';

  const settingItems = [
    {
      section: 'Preferences',
      items: [
        {
          icon: Eye,
          label: 'Show Dashboard Balances',
          type: 'switch',
          value: showBalances,
          onToggle: toggleBalances,
        },
        {
          icon: Fingerprint,
          label: 'Enable Biometrics',
          type: 'switch',
          value: biometrics,
          onToggle: setBiometrics,
        },
      ],
    },
    {
      section: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          type: 'navigation',
          onPress: () => router.push('/profile'),
        },
        {
          icon: Shield,
          label: 'Security Settings',
          type: 'modal',
          modalType: 'security' as ModalType,
        },
      ],
    },
    {
      section: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Vault Payout Alerts',
          type: 'switch',
          value: vaultAlerts,
          onToggle: setVaultAlerts,
        },
      ],
    },
    {
      section: 'Support',
      items: [
        {
          icon: Mail,
          label: 'Contact Support',
          type: 'modal',
          modalType: 'support' as ModalType,
        },
      ],
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const styles = createStyles(colors);

  return (
    <BaseScreen>
      <Header title="Settings" />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileSection}>
          <Pressable style={styles.profileInfo} onPress={() => router.push('/profile')}>
            <InitialsAvatar firstName={firstName} lastName={lastName} size={48} fontSize={20} />
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
                    <View style={styles.settingIcon}>
                      <item.icon size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
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
                    <View style={styles.settingIcon}>
                      <item.icon size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </Pressable>
                )}
              </View>
            ))}

            {section.section === 'Support' && (
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
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
                      onPress={() => setTheme(themeOption)}
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
          <Button title="Log Out" onPress={() => setActiveModal('logout')} style={styles.logoutButton} icon={LogOut} />
        </View>
      </ScrollView>

      <SettingsModal
        isVisible={activeModal !== null}
        onClose={() => setActiveModal(null)}
        type={activeModal || 'help-center'}
      />
    </BaseScreen>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  content: { flex: 1 },
  contentContainer: { paddingBottom: 24 },
  profileSection: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  profileText: { flex: 1, marginLeft: 12 },
  profileName: { fontSize: 18, fontWeight: '600', color: colors.text },
  profileEmail: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  verifiedBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start' },
  verifiedText: { fontSize: 12, color: '#22C55E', fontWeight: '500' },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 12, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8 },
  settingIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12, backgroundColor: colors.backgroundTertiary },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '500', color: colors.text },
  settingDescription: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  themeSelector: { flexDirection: 'row', backgroundColor: colors.backgroundTertiary, borderRadius: 8, padding: 2 },
  themeOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, minWidth: 50, alignItems: 'center' },
  activeThemeOption: { backgroundColor: colors.primary },
  themeOptionText: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  activeThemeOptionText: { color: '#FFFFFF' },
  footer: { padding: 16 },
  logoutButton: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#EF4444' },
});