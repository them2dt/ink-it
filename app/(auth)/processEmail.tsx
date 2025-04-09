import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { colors } from '@/constants/colors';
export default function Page() {
  useEffect(() => {
    // Simulate authentication process
    const timer = setTimeout(() => {
      router.replace('/(main)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Signing in...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent[100],
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.accent[1000],
  },
});