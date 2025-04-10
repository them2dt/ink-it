import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function Page() {
  const [oldPassword, setOldPassword] = useState('');

  const handleContinue = () => {
    router.push('/(change-password)/form');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Change password</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Old password"
          placeholderTextColor="#999"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(main)')}
        >
          <Ionicons name="home" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(main)')}
        >
          <Ionicons name="camera" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, styles.activeNavButton]}
          onPress={() => router.push('/(main)/profile')}
        >
          <Ionicons name="person" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white[100],
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    ...typography.heading1(),
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.white[300],
    borderRadius: 8,
    padding: 16,
    ...typography.bodyMedium(),
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.black[100],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.buttonMedium({ color: colors.white[100] }),
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: colors.white[100],
    borderTopWidth: 1,
    borderTopColor: colors.white[300],
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: colors.accent[100],
  },
});