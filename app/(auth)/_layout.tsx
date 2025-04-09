import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade'  }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="process" />
      <Stack.Screen name="done" />
      
    </Stack>
  );
}