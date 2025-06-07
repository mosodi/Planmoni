import { View, Text, StyleSheet } from 'react-native';
import { Check, Clock, AlertTriangle, X } from 'lucide-react-native';

interface StatusTagProps {
  status: 'active' | 'paused' | 'completed' | 'failed' | 'pending';
  size?: 'small' | 'medium';
}

export default function StatusTag({ status, size = 'medium' }: StatusTagProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: Check,
          text: 'Active',
          backgroundColor: '#DCFCE7',
          color: '#22C55E',
        };
      case 'completed':
        return {
          icon: Check,
          text: 'Completed',
          backgroundColor: '#DCFCE7',
          color: '#22C55E',
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          backgroundColor: '#FEF3C7',
          color: '#D97706',
        };
      case 'paused':
        return {
          icon: X,
          text: 'Paused',
          backgroundColor: '#FEE2E2',
          color: '#EF4444',
        };
      case 'failed':
        return {
          icon: AlertTriangle,
          text: 'Failed',
          backgroundColor: '#FEE2E2',
          color: '#EF4444',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.container,
      { backgroundColor: config.backgroundColor },
      isSmall && styles.smallContainer
    ]}>
      <Icon size={isSmall ? 12 : 16} color={config.color} />
      <Text style={[
        styles.text,
        { color: config.color },
        isSmall && styles.smallText
      ]}>
        {config.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  smallText: {
    fontSize: 10,
  },
});