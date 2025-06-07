import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/styles/common';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  iconColor?: string;
  iconBackground?: string;
  rightElement?: ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
}

export default function ListItem({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBackground,
  rightElement,
  showChevron = false,
  onPress,
  style,
  disabled = false,
}: ListItemProps) {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  const styles = createStyles(colors);

  const content = (
    <View style={[commonStyles.cardBase, styles.container, style]}>
      {Icon && (
        <View style={[
          commonStyles.iconContainer,
          { backgroundColor: iconBackground || colors.backgroundTertiary }
        ]}>
          <Icon size={20} color={iconColor || colors.textSecondary} />
        </View>
      )}
      
      <View style={commonStyles.flex1}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {rightElement}
      {showChevron && !rightElement && (
        <ChevronRight size={20} color={colors.textTertiary} />
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  pressable: {
    borderRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});