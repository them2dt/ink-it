import { Stack } from 'expo-router';

export default function ChangePasswordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none'  }}>
      <Stack.Screen name="index" options={{ title: 'Change Password' }} />
      <Stack.Screen name="input" options={{ title: 'Enter New Password' }} />
      <Stack.Screen name="confirm" options={{ title: 'Confirm Password' }} />
    </Stack>
  );
}