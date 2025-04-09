import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right'  }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="slide_1" />
      <Stack.Screen name="end" />
    </Stack>
  );
}