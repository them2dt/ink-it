import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
interface NavigationProps {
  activeTab?: 'home' | 'camera' | 'profile';
}

export default function Navigation({ activeTab = 'home' }: NavigationProps) {
  const handleNavigation = (route: "/" | "/(main)" | "/(main)/profile") => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.navButton, activeTab === 'home' && styles.activeNavButton]}
        onPress={() => handleNavigation('/(main)')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? colors.white[100] : colors.accent[400]} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, activeTab === 'camera' && styles.activeNavButton]}
        onPress={() => handleNavigation('/(main)')}
      >
        <Ionicons 
          name="camera" 
          size={24} 
          color={activeTab === 'camera' ? colors.white[100] : colors.accent[400]} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, activeTab === 'profile' && styles.activeNavButton]}
        onPress={() => handleNavigation('/(main)/profile')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={activeTab === 'profile' ? colors.white[100] : colors.accent[400]} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: colors.white[100],
    borderTopWidth: 1,
    borderTopColor: colors.accent[400],
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
