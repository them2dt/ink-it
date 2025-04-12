import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { colors } from '@/constants/colors';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '@/lib/supabase';
import { typography } from '@/constants/typography';

export default function Page() {
  useEffect(() => {
    handleAppleSignIn();
  }, []);

  const handleAppleSignIn = async () => {
    try {
      // Authenticate with Apple
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Sign in with Supabase using the Apple identity token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken as string,
      });

      if (error) {
        throw error;
      }

      // If successful, navigate to main app
      router.replace('/(main)');
    } catch (error) {
      console.error('Apple authentication error:', error);
      
      // Show an error message and navigate back to the auth screen
      Alert.alert(
        'Authentication Failed',
        'Failed to sign in with Apple. Please try again.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent[1000]} />
      <Text style={styles.title}>Signing in with Apple...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent[100],
    gap: 20,
  },
  title: {
    ...typography.bodyLarge({ color: colors.accent[1000] }),
  },
});