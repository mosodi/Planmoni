import Card from '@/components/Card';
import { router } from 'expo-router';
import { TriangleAlert as AlertTriangle, Check, ChevronLeft, ChevronRight, Clock, Plus, Calendar as CalendarIcon, Bell } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useEvents } from '@/hooks/useEvents';
import { useBalance } from '@/contexts/BalanceContext';

type ViewType = 'month' | 'week' | 'list';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarScreen() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const { events, isLoading, markEventAsRead } = useEvents();
  const { showBalances } = useBalance();
  const [activeView, setActiveView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const cellSize = useMemo(() => {
    const padding = 32;
    const gap = 8;
    const numCells = 7;
    const availableWidth = width - padding;
    const cellWidth = (availableWidth - (gap * (numCells - 1))) / numCells;
    return Math.max(40, Math.min(cellWidth, 60));
  }, [width]);

  const weekCellSize = useMemo(() => {
    const padding = 32;
    const gap = 8;
    const numCells = 7;
    const availableWidth = width - padding;
    const cellWidth = (availableWidth - (gap * (numCells - 1))) / numCells;
    return Math.max(48, Math.min(cellWidth, 80));
  }, [width]);

  // Transform events into calendar format
  const calendarEvents = useMemo(() => {
    return events.map(event => {
      const eventDate = new Date(event.created_at);
      const dateString = `${MONTHS[eventDate.getMonth()]} ${eventDate.getDate()}, ${eventDate.getFullYear()}`;
      
      return {
        id: event.id,
        title: event.title,
        amount: event.payout_plans?.payout_amount 
          ? (showBalances ? `₦${event.payout_plans.payout_amount.toLocaleString()}` : '••••••••')
          : event.transactions?.amount 
            ? (showBalances ? `₦${event.transactions.amount.toLocaleString()}` : '••••••••')
            : '',
        time: eventDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        type: getEventType(event.type),
        description: event.description || '',
        vault: event.payout_plans?.name,
        date: dateString,
        status: event.status,
        rawEvent: event,
      };
    });
  }, [events, showBalances]);

  function getEventType(type: string): 'completed' | 'pending' | 'scheduled' | 'failed' | 'expiring' {
    switch (type) {
      case 'payout_completed':
        return 'completed';
      case 'payout_scheduled':
        return 'scheduled';
      case 'disbursement_failed':
        return 'failed';
      case 'security_alert':
        return 'expiring';
      default:
        return 'pending';
    }
  }

  const handleCreatePayout = () => {
    router.push('/create-payout/amount');
  };

  const getEventIcon = (type: 'completed' | 'pending' | 'scheduled' | 'failed' | 'expiring') => {
    switch (type) {
      case 'completed':
        return <Check size={20} color="#22C55E" />;
      case 'pending':
      case 'scheduled':
        return <Clock size={20} color="#3B82F6" />;
      case 'failed':
      case 'expiring':
        return <AlertTriangle size={20} color="#EF4444" />;
    }
  };

  const getEventColor = (type: 'completed' | 'pending' | 'scheduled' | 'failed' | 'expiring') => {
    switch (type) {
      case 'completed':
        return '#22C55E';
      case 'pending':
      case 'scheduled':
        return '#3B82F6';
      case 'failed':
      case 'expiring':
        return '#EF4444';
    }
  };

  const getEventBackground = (type: 'completed' | 'pending' | 'scheduled' | 'failed' | 'expiring') => {
    switch (type) {
      case 'completed':
        return '#F0FDF4';
      case 'pending':
      case 'scheduled':
        return '#F0F9FF';
      case 'failed':
      case 'expiring':
        return '#FEF2F2';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    const dateString = formatDate(date);
    return calendarEvents.filter(event => event.date === dateString);
  };

  const handleEventPress = async (event: any) => {
    // Mark event as read if it's unread
    if (event.status === 'unread') {
      await markEventAsRead(event.id);
    }

    // Navigate to relevant screen based on event type
    if (event.rawEvent.payout_plan_id) {
      router.push({
        pathname: '/view-payout',
        params: { id: event.rawEvent.payout_plan_id }
      });
    } else if (event.rawEvent.transaction_id) {
      router.push('/transactions');
    }
  };

  const styles = createStyles(colors);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOffset = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));

    return (
      <View>
        <View style={styles.monthHeader}>
          <Text style={styles.monthTitle}>
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <View style={styles.monthNavigation}>
            <Pressable style={styles.navigationButton} onPress={handlePrevMonth}>
              <ChevronLeft size={20} color={colors.textSecondary} />
            </Pressable>
            <Pressable style={styles.navigationButton} onPress={handleNextMonth}>
              <ChevronRight size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.calendar}>
          <View style={styles.weekDays}>
            {DAYS.map(day => (
              <View key={day} style={[styles.weekDayCell, { width: cellSize }]}>
                <Text style={styles.weekDay}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array.from({ length: firstDayOffset }).map((_, index) => (
              <View key={`empty-${index}`} style={[styles.dayCell, { width: cellSize, height: cellSize }]} />
            ))}
            
            {days.map(date => {
              const dayEvents = getEventsForDate(date);
              const isSelectedDay = isSelected(date);
              const isTodayDate = isToday(date);

              return (
                <Pressable
                  key={date.getTime()}
                  style={[
                    styles.dayCell,
                    { width: cellSize, height: cellSize },
                    isSelectedDay && styles.selectedDay,
                    isTodayDate && styles.todayDay,
                  ]}
                  onPress={() => handleDateSelect(date)}>
                  <Text style={[
                    styles.dayNumber,
                    isSelectedDay && styles.selectedDayText,
                    isTodayDate && styles.todayDayText,
                  ]}>{date.getDate()}</Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventDots}>
                      {dayEvents.slice(0, 2).map((event, index) => (
                        <View
                          key={index}
                          style={[
                            styles.eventDot,
                            { backgroundColor: getEventColor(event.type) },
                            event.status === 'unread' && styles.unreadEventDot,
                          ]}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <Text style={styles.moreEventsText}>+{dayEvents.length - 2}</Text>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.selectedDateEvents}>
          <View style={styles.selectedDateHeader}>
            <Text style={styles.selectedDateTitle}>{formatDate(selectedDate)}</Text>
            <View style={styles.eventCount}>
              <Text style={styles.eventCountText}>
                {getEventsForDate(selectedDate).length} events
              </Text>
            </View>
          </View>

          {getEventsForDate(selectedDate).map(event => (
            <Pressable key={event.id} onPress={() => handleEventPress(event)}>
              <Card style={[
                styles.eventCard, 
                { backgroundColor: getEventBackground(event.type) },
                event.status === 'unread' && styles.unreadEventCard
              ]}>
                <View style={styles.eventContent}>
                  <View style={[styles.eventIcon, { backgroundColor: getEventBackground(event.type) }]}>
                    {getEventIcon(event.type)}
                  </View>
                  <View style={styles.eventDetails}>
                    <View style={styles.eventTitleRow}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      {event.status === 'unread' && (
                        <View style={styles.unreadBadge}>
                          <Bell size={12} color={colors.primary} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.eventDescription}>
                      {event.vault ? `From Vault '${event.vault}'` : event.description} • {event.time}
                    </Text>
                    {event.amount && (
                      <Text style={styles.eventAmount}>{event.amount}</Text>
                    )}
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}

          {getEventsForDate(selectedDate).length === 0 && (
            <View style={styles.noEventsContainer}>
              <CalendarIcon size={48} color={colors.textTertiary} />
              <Text style={styles.noEventsText}>No events for this date</Text>
            </View>
          )}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Event Types</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendText}>Payout completed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>Payout scheduled</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Failed/Alert</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderListView = () => {
    const groupedEvents = calendarEvents.reduce((acc, event) => {
      const date = event.date === formatDate(new Date()) ? 'Today' :
                   event.date === formatDate(new Date(Date.now() + 86400000)) ? 'Tomorrow' :
                   event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, typeof calendarEvents>);

    return (
      <View style={styles.listViewContainer}>
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <View key={date} style={styles.dateGroup}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateTitle}>{date}</Text>
              <View style={styles.eventCount}>
                <Text style={styles.eventCountText}>{dateEvents.length} events</Text>
              </View>
            </View>
            <View style={styles.eventsContainer}>
              {dateEvents.map((event) => (
                <Pressable key={event.id} onPress={() => handleEventPress(event)}>
                  <Card style={[
                    styles.eventCard, 
                    { backgroundColor: getEventBackground(event.type) },
                    event.status === 'unread' && styles.unreadEventCard
                  ]}>
                    <View style={styles.eventContent}>
                      <View style={[styles.eventIcon, { backgroundColor: getEventBackground(event.type) }]}>
                        {getEventIcon(event.type)}
                      </View>
                      <View style={styles.eventDetails}>
                        <View style={styles.eventTitleRow}>
                          <Text style={styles.eventTitle}>{event.title}</Text>
                          {event.status === 'unread' && (
                            <View style={styles.unreadBadge}>
                              <Bell size={12} color={colors.primary} />
                            </View>
                          )}
                        </View>
                        <Text style={styles.eventDescription}>{event.description} • {event.time}</Text>
                        {event.amount && (
                          <Text style={styles.eventAmount}>{event.amount}</Text>
                        )}
                      </View>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {calendarEvents.length === 0 && (
          <View style={styles.noEventsContainer}>
            <CalendarIcon size={64} color={colors.textTertiary} />
            <Text style={styles.noEventsTitle}>No events yet</Text>
            <Text style={styles.noEventsSubtext}>Your payout events will appear here</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerActions}>
          <Pressable 
            style={styles.todayButton}
            onPress={() => {
              const today = new Date();
              setCurrentDate(today);
              setSelectedDate(today);
            }}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </Pressable>
          <Pressable style={styles.createButton} onPress={handleCreatePayout}>
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.viewSelector}>
        {(['month', 'list'] as ViewType[]).map((view) => (
          <Pressable
            key={view}
            style={[
              styles.viewOption,
              activeView === view && styles.viewOptionActive,
            ]}
            onPress={() => setActiveView(view)}>
            <Text
              style={[
                styles.viewOptionText,
                activeView === view && styles.viewOptionTextActive,
              ]}>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeView === 'month' && renderMonthView()}
        {activeView === 'list' && renderListView()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.backgroundTertiary,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  createButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
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
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  viewOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewOptionActive: {
    backgroundColor: colors.primary,
  },
  viewOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  viewOptionTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  calendar: {
    paddingHorizontal: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayCell: {
    alignItems: 'center',
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  todayDay: {
    backgroundColor: colors.backgroundTertiary,
  },
  dayNumber: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  todayDayText: {
    color: colors.primary,
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
    alignItems: 'center',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  unreadEventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreEventsText: {
    fontSize: 8,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  monthNavigation: {
    flexDirection: 'row',
    gap: 8,
  },
  navigationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundTertiary,
  },
  selectedDateEvents: {
    padding: 16,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  eventCount: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventCountText: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '500',
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  eventsContainer: {
    paddingHorizontal: 16,
  },
  eventCard: {
    marginBottom: 8,
    borderWidth: 0,
  },
  unreadEventCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  eventDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  eventAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  noEventsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  noEventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  legend: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  listViewContainer: {
    flex: 1,
    paddingTop: 16,
  },
});