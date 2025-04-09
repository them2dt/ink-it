import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none'  }}>
      <Stack.Screen
        name="index"
      />
      <Stack.Screen
        name="profile"
      />
    </Stack>
  );
}