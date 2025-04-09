import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export default function Page() {
  const handleTakePhoto = () => {
    // For now, just navigate to the edit page
    router.push('/edit' as any);
  };

  const handleGallery = () => {
    // For now, let's just log this until we create the page
    console.log('Open gallery');
    // Will implement later: router.push('/select-image'); 
  };

  const handleAIGeneration = () => {
    // For now, let's just log this until we create the page
    console.log('Open AI generation');
    // Will implement later: router.push('/generate');
  };

  const handleProfile = () => {
    router.push('/(main)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with app name and profile button */}
      <View style={styles.header}>
        <Text style={styles.appName}>Ink it!</Text>
        <TouchableOpacity onPress={handleProfile} style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color={colors.white[100]} />
        </TouchableOpacity>
      </View>

      {/* Camera preview area (placeholder for now) */}
      <View style={styles.cameraPreview} />

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Gallery button */}
        <TouchableOpacity style={styles.sideButton} onPress={handleGallery}>
          <Ionicons name="images" size={30} color={colors.white[100]} />
        </TouchableOpacity>
        
        {/* Capture button */}
        <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        {/* AI button */}
        <TouchableOpacity style={styles.sideButton} onPress={handleAIGeneration}>
          <Ionicons name="sparkles" size={30} color={colors.white[100]} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white[100],
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: colors.accent[200],
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.accent[1000],
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white[100],
    borderWidth: 4,
    borderColor: colors.accent[1000],
  },
});