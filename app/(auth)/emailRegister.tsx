import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/constants/colors';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    router.push('/processEmail');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By creating an account, you're accepting our terms{'\n'}and services.
        </Text>

        <TouchableOpacity 
          onPress={() => router.replace('/(auth)/emailLogin')}
        >
          <Text style={styles.linkText}>Already have an account? Sign in!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent[100],
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 16,
  },
  input: {
    backgroundColor: colors.white[100],
    borderRadius: 30,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.black[100],
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.white[100],
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    color: colors.accent[1000],
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  linkText: {
    color: colors.accent[1000],
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});