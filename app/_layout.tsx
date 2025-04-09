import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
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
    </>
  );
}