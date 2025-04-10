import React, { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular.otf'),
          'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium.otf'),
          'Satoshi-Light': require('@/assets/fonts/Satoshi-Light.otf'),
          'Satoshi-Bold': require('@/assets/fonts/Satoshi-Bold.otf'),
          'Satoshi-Black': require('@/assets/fonts/Satoshi-Black.otf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
        <Stack.Screen 
          name="(main)" 
          options={{ 
            gestureEnabled: false,
            headerShown: false,
            animation: 'none'
          }} 
        />
        <Stack.Screen name="(change-password)" />
        <Stack.Screen name="(reset)" />
        <Stack.Screen name="(log-out)" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}