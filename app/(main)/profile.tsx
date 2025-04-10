import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '@/constants/typography';

export default function Page() {
  const handleLogout = () => {
    router.push('/(log-out)');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={28} color={colors.black[100]} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => console.log('Manage subscription')}
        >
          <Text style={styles.menuText}>Manage Subscription</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/(reset)')}
        >
          <Text style={styles.menuText}>Reset profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/(change-password)')}
        >
          <Text style={styles.menuText}>Change password</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Text style={styles.menuText}>Log out</Text>
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
    ...typography.heading1({ color: colors.black[100] }),
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    backgroundColor: colors.white[200],
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    ...typography.bodyMedium({ color: colors.black[100] }),
  },
});