import { Stack } from 'expo-router';

export default function LogOutLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Log Out' }} />
    </Stack>
  );
}