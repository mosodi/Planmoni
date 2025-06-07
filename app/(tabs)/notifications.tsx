import { TriangleAlert as AlertTriangle, Calendar, Check, Download, Shield, Smartphone, Wallet } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useEvents } from '@/hooks/useEvents';
import { router } from 'expo-router';

type NotificationType = 'all' | 'payout_completed' | 'payout_scheduled' | 'vault_created' | 'disbursement_failed' | 'security_alert';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { events, isLoading, markEventAsRead, markAllAsRead } = useEvents();
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');

  const filteredEvents = events.filter(event => 
    activeFilter === 'all' || event.type === activeFilter
  );

  const handleEventPress = async (event: any) => {
    // Mark as read if unread
    if (event.status === 'unread') {
      await markEventAsRead(event.id);
    }

    // Navigate to relevant screen
    if (event.payout_plan_id) {
      router.push({
        pathname: '/view-payout',
        params: { id: event.payout_plan_id }
      });
    } else if (event.transaction_id) {
      router.push('/transactions');
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'payout_completed':
        return { icon: Wallet, bg: '#DCFCE7', color: '#22C55E' };
      case 'payout_scheduled':
        return { icon: Calendar, bg: '#EFF6FF', color: '#3B82F6' };
      case 'vault_created':
        return { icon: Shield, bg: '#F0F9FF', color: '#0EA5E9' };
      case 'disbursement_failed':
        return { icon: AlertTriangle, bg: '#FEE2E2', color: '#EF4444' };
      case 'security_alert':
        return { icon: Shield, bg: '#FEF3C7', color: '#D97706' };
      default:
        return { icon: Smartphone, bg: '#F1F5F9', color: '#64748B' };
    }
  };

  const getStatusTag = (type: string) => {
    switch (type) {
      case 'payout_completed':
        return { text: 'Completed', bg: '#DCFCE7', color: '#22C55E' };
      case 'payout_scheduled':
        return { text: 'Scheduled', bg: '#EFF6FF', color: '#3B82F6' };
      case 'disbursement_failed':
        return { text: 'Failed', bg: '#FEE2E2', color: '#EF4444' };
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const styles = createStyles(colors);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContent}
        >
          <Pressable 
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, activeFilter === 'payout_completed' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('payout_completed')}
          >
            <Text style={[styles.filterText, activeFilter === 'payout_completed' && styles.activeFilterText]}>
              Payouts
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, activeFilter === 'vault_created' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('vault_created')}
          >
            <Text style={[styles.filterText, activeFilter === 'vault_created' && styles.activeFilterText]}>
              Vaults
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.filterButton, activeFilter === 'security_alert' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('security_alert')}
          >
            <Text style={[styles.filterText, activeFilter === 'security_alert' && styles.activeFilterText]}>
              Security
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView style={styles.notificationsList}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertTriangle size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              {activeFilter === 'all' 
                ? 'You\'re all caught up! New notifications will appear here.'
                : `No ${activeFilter.replace('_', ' ')} notifications found.`
              }
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => {
            const iconConfig = getEventIcon(event.type);
            const statusTag = getStatusTag(event.type);
            const Icon = iconConfig.icon;

            return (
              <Pressable 
                key={event.id} 
                style={[
                  styles.notification, 
                  event.status === 'unread' && styles.unreadNotification
                ]}
                onPress={() => handleEventPress(event)}
              >
                <View style={[styles.notificationIcon, { backgroundColor: iconConfig.bg }]}>
                  <Icon size={20} color={iconConfig.color} />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationType}>{event.title}</Text>
                    <Text style={styles.notificationTime}>{formatTimeAgo(event.created_at)}</Text>
                  </View>
                  <Text style={styles.notificationMessage}>{event.description}</Text>
                  {statusTag && (
                    <View style={[styles.statusTag, { backgroundColor: statusTag.bg }]}>
                      <Text style={[styles.statusText, { color: statusTag.color }]}>
                        {statusTag.text}
                      </Text>
                    </View>
                  )}
                </View>
                {event.status === 'unread' && <View style={styles.unreadDot} />}
              </Pressable>
            );
          })
        )}
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
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
  filterContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundTertiary,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadNotification: {
    backgroundColor: colors.backgroundSecondary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 24,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadDot: {
    position: 'absolute',
    top: 20,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});