import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import React from 'react';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const { isDark } = useTheme();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />

        {/* App Screens */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="add-funds" />
        <Stack.Screen name="all-payouts" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="create-payout" />
        {/* <Stack.Screen name="deposit-flow/amount" />
        <Stack.Screen name="deposit-flow/payment-methods" /> */}
        <Stack.Screen name="linked-accounts" />
        <Stack.Screen name="pause-confirmation" />
        <Stack.Screen name="referral" />
        <Stack.Screen name="transaction-limits" />
        <Stack.Screen name="transactions" />
        <Stack.Screen name="two-factor-auth" />
        <Stack.Screen name="view-payout" />

        {/* Deposit Flow Screens */}
        <Stack.Screen name="deposit-flow/amount" />
        <Stack.Screen name="deposit-flow/authorization" />
        <Stack.Screen name="deposit-flow/payment-methods" />
        <Stack.Screen name="deposit-flow/success" />

        {/* Error fallback */}
        <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
      </Stack>

      {/* <Stack screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="(tabs)\" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="add-funds" options={{ headerShown: false }} />
            <Stack.Screen name="all-payouts" options={{ headerShown: false }} />
            <Stack.Screen name="change-password" options={{ headerShown: false }} />
            <Stack.Screen name="create-payout" options={{ headerShown: false }} />
            <Stack.Screen name="deposit-flow" options={{ headerShown: false }} />
            <Stack.Screen name="linked-accounts" options={{ headerShown: false }} />
            <Stack.Screen name="pause-confirmation" options={{ headerShown: false }} />
            <Stack.Screen name="referral" options={{ headerShown: false }} />
            <Stack.Screen name="transaction-limits" options={{ headerShown: false }} />
            <Stack.Screen name="transactions" options={{ headerShown: false }} />
            <Stack.Screen name="two-factor-auth" options={{ headerShown: false }} />
            <Stack.Screen name="view-payout" options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
      </Stack> */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <BalanceProvider>
          <RootLayoutNav />
        </BalanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}