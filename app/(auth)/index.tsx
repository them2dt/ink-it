import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);
  
  useEffect(() => {
    // Check if Apple Authentication is available on this device
    AppleAuthentication.isAvailableAsync().then(available => {
      setIsAppleAuthAvailable(available);
    });
  }, []);

  const navigateToTerms = () => {
    router.push('/(auth)/terms');
  };

  const navigateToPrivacy = () => {
    router.push('/(auth)/privacy');
  };

  const handleAppleSignIn = () => {
    router.push("/(auth)/processApple");
  };

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          <Text style={styles.subtitleDefault}>Image to tattoo,{'\n'}</Text>
          <Text style={styles.subtitleHighlight}>in 30 seconds.</Text>
        </Text>
      </View>

      <View style={styles.curvedBackground}>
        <View style={styles.buttonContainer}>
          {isAppleAuthAvailable ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={30}
              style={styles.appleAuthButton}
              onPress={handleAppleSignIn}
            />
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.appleButton]}
              onPress={handleAppleSignIn}
            >
              <Text style={styles.buttonText}>continue with apple</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.button, styles.gmailButton]}
            onPress={() => router.push("/(auth)/processGmail")}
          >
            <Text style={styles.buttonText}>continue with gmail</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By creating an account, you're accepting our{' '}
            <Text style={styles.link} onPress={navigateToTerms}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.link} onPress={navigateToPrivacy}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A11BE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
  },
  title: {
    ...typography.heading1({ color: colors.white[100] }),
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.heading1(),
    textAlign: 'center',
  },
  subtitleDefault: {
    color: colors.accent[400],
  },
  subtitleHighlight: {
    color: colors.white[100],
  },
  curvedBackground: {
    backgroundColor: colors.white[100],
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  appleAuthButton: {
    height: 50,
    width: '100%',
  },
  appleButton: {
    backgroundColor: colors.black[100],
  },
  gmailButton: {
    backgroundColor: colors.accent[100],
  },
  buttonText: {
    ...typography.buttonMedium({ color: colors.black[100] }),
  },
  disclaimer: {
    ...typography.bodySmall({ color: colors.accent[1000] }),
    textAlign: 'center',
    marginTop: 8,
  },
  link: {
    ...typography.bodySmall({ color: colors.accent[1000] }),
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});