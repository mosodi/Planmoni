import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

interface ScreenLayoutProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: ReactNode;
  headerElement?: ReactNode;
  scrollable?: boolean;
  children: ReactNode;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
}

export default function ScreenLayout({
  title,
  showBackButton = false,
  onBackPress,
  rightElement,
  headerElement,
  scrollable = true,
  children,
  contentStyle,
  headerStyle,
}: ScreenLayoutProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const renderHeader = () => {
    if (!title && !showBackButton && !rightElement && !headerElement) {
      return null;
    }

    if (headerElement) {
      return <View style={[styles.header, headerStyle]}>{headerElement}</View>;
    }

    return (
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <Pressable onPress={handleBackPress} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          )}
          {title && <Text style={styles.headerTitle}>{title}</Text>}
        </View>
        {rightElement && <View style={styles.headerRight}>{rightElement}</View>}
      </View>
    );
  };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {renderContent()}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    marginLeft: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});