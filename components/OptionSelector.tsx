import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/styles/common';

interface Option {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  disabled?: boolean;
}

interface OptionSelectorProps {
  options: Option[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  style?: any;
}

export default function OptionSelector({
  options,
  selectedId,
  onSelect,
  style,
}: OptionSelectorProps) {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const Icon = option.icon;

        return (
          <Pressable
            key={option.id}
            style={[
              styles.option,
              isSelected && styles.selectedOption,
              option.disabled && styles.disabledOption,
            ]}
            onPress={() => !option.disabled && onSelect(option.id)}
            disabled={option.disabled}
          >
            {Icon && (
              <Icon 
                size={20} 
                color={isSelected ? colors.primary : colors.text} 
              />
            )}
            <View style={commonStyles.flex1}>
              <Text style={[
                styles.optionTitle,
                isSelected && styles.selectedOptionText,
                option.disabled && styles.disabledText,
              ]}>
                {option.title}
              </Text>
              {option.subtitle && (
                <Text style={[
                  styles.optionSubtitle,
                  option.disabled && styles.disabledText,
                ]}>
                  {option.subtitle}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.backgroundTertiary,
    borderColor: colors.primary,
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  disabledText: {
    color: colors.textTertiary,
  },
});