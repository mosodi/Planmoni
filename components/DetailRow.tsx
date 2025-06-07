import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/styles/common';

interface DetailRowProps {
  label: string;
  value: string | ReactNode;
  icon?: React.ComponentType<any>;
  onPress?: () => void;
  rightElement?: ReactNode;
  style?: any;
}

export default function DetailRow({ 
  label, 
  value, 
  icon: Icon, 
  onPress, 
  rightElement,
  style 
}: DetailRowProps) {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  const styles = createStyles(colors);

  const content = (
    <View style={[styles.container, style]}>
      {Icon && (
        <View style={[commonStyles.iconContainer, { backgroundColor: colors.backgroundTertiary }]}>
          <Icon size={20} color={colors.textSecondary} />
        </View>
      )}
      <View style={commonStyles.flex1}>
        <Text style={styles.label}>{label}</Text>
        {typeof value === 'string' ? (
          <Text style={styles.value}>{value}</Text>
        ) : (
          value
        )}
      </View>
      {rightElement}
    </View>
  );

  if (onPress) {
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
    paddingVertical: 12,
  },
  pressable: {
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});