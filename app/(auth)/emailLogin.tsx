import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
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

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/(auth)/emailForgot')}
        >
          <Text style={styles.linkText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.replace('/(auth)/emailRegister')}
        >
          <Text style={styles.linkText}>Create an account!</Text>
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
    ...typography.bodyMedium(),
  },
  button: {
    backgroundColor: colors.black[100],
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    ...typography.buttonMedium({ color: colors.white[100] }),
  },
  linkText: {
    ...typography.bodySmall({ color: colors.accent[1000] }),
    textAlign: 'center',
    marginTop: 8,
  },
});