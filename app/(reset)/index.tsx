import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function Page() {
  const handleReset = () => {
    // Handle reset logic here
    router.push('/(main)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset profile</Text>
        <Text style={styles.description}>
          Your profile data will be deleted{'\n'}and you will start from 0.
        </Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
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
    marginBottom: 16,
  },
  description: {
    ...typography.bodyMedium({ color: colors.black[100] }),
    marginBottom: 24,
    lineHeight: 24,
  },
  resetButton: {
    backgroundColor: colors.red[100],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
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