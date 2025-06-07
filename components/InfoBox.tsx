import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface InfoBoxProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string | ReactNode;
  icon?: React.ComponentType<any>;
  style?: any;
}

export default function InfoBox({ 
  type = 'info', 
  title, 
  message, 
  icon: CustomIcon,
  style 
}: InfoBoxProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, type);

  const getIcon = () => {
    if (CustomIcon) return CustomIcon;
    
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'error':
        return XCircle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'warning':
        return { 
          bg: colors.warningLight || '#FEF3C7', 
          border: colors.warning || '#D97706',
          icon: colors.warning || '#D97706'
        };
      case 'error':
        return { 
          bg: colors.errorLight || '#FEE2E2', 
          border: colors.error || '#EF4444',
          icon: colors.error || '#EF4444'
        };
      case 'success':
        return { 
          bg: colors.successLight || '#F0FDF4', 
          border: colors.success || '#22C55E',
          icon: colors.success || '#22C55E'
        };
      default:
        return { 
          bg: colors.card, 
          border: colors.primary,
          icon: colors.primary
        };
    }
  };

  const Icon = getIcon();
  const colorConfig = getColors();

  return (
    <View style={[styles.container, { 
      backgroundColor: colorConfig.bg,
      borderLeftColor: colorConfig.border 
    }, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundTertiary }]}>
          <Icon size={20} color={colorConfig.icon} />
        </View>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      <View style={styles.content}>
        {typeof message === 'string' ? (
          <Text style={styles.message}>{message}</Text>
        ) : (
          message
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: any, type: string) => StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    marginLeft: 44, // Align with title text
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});