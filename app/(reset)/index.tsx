import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
  const handleReset = () => {
    router.push('/(main)');
  };

  const handleBack = () => {
    router.push('/(main)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={28} color={colors.white[100]} />
        </TouchableOpacity>
        <Text style={styles.title}>Reset profile</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Are you sure you want to reset your profile? This will delete all your data and cannot be undone.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  backButton: {
    marginRight: 10,
  },
  title: {
    ...typography.heading1({ color: colors.white[100] }),
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    ...typography.bodyMedium({ color: colors.white[100] }),
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.white[100],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.buttonMedium({ color: colors.accent[100] }),
  },
});