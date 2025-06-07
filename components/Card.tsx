import { View, StyleSheet, ViewProps } from 'react-native';
import { ReactNode } from 'react';
import { useTheme } from '@/hooks';

type CardProps = ViewProps & {
  children: ReactNode;
};

export default function Card({ children, style, ...props }: CardProps) {
  const { colors, isDark } = useTheme();
  
  const styles = createStyles(colors, isDark);

  return (
    <View style={[styles.card, style]} {...props}>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    ...(isDark ? {
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    } : {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    }),
  },
  cardBody: { flex: 1 },
});