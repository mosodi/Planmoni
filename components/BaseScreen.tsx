import { ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks';

interface BaseScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  padding?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export default function BaseScreen({ 
  children, 
  scrollable = false, 
  padding = true,
  edges = ['top']
}: BaseScreenProps) {
  const { colors } = useTheme();
  
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable 
    ? { contentContainerStyle: [styles.content, padding && styles.padding] }
    : { style: [styles.content, padding && styles.padding] };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} edges={edges}>
      <Container {...containerProps}>
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  padding: { padding: 16 },
});