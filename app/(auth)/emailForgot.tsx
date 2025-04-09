import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/constants/colors';
export default function Page() {
  const [email, setEmail] = useState('');

  const handleSendEmail = () => {
    router.push('/(auth)/emailForgotDone');
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

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSendEmail}
        >
          <Text style={styles.buttonText}>Send E-Mail</Text>
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
});