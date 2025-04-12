import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
  const handleLogout = () => {
    // Handle logout logic here
    router.push('/(auth)');
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
        <Text style={styles.title}>Log out</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Are you sure you want to log out?
        </Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
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
  logoutButton: {
    backgroundColor: colors.white[100],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...typography.buttonMedium({ color: colors.accent[100] }),
  },
});