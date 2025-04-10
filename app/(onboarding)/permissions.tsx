import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function Page() {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [photoLibraryPermission, setPhotoLibraryPermission] = useState(false);

  const requestCameraPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  }, []);

  const requestPhotoLibraryPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPhotoLibraryPermission(status === 'granted');
  }, []);

  const handleContinue = () => {
    if (cameraPermission && photoLibraryPermission) {
      router.push("/(auth)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enable Permissions</Text>
        <Text style={styles.subtitle}>
          We need a few permissions to make the magic happen
        </Text>
        
        <TouchableOpacity 
          style={styles.permissionItem}
          onPress={requestCameraPermission}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={cameraPermission ? "checkmark" : "close"} 
              size={24} 
              color={cameraPermission ? colors.accent[100] : colors.red[100]} 
            />
          </View>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Camera Access</Text>
            <Text style={styles.permissionDescription}>Required to take photos for transformation</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.permissionItem}
          onPress={requestPhotoLibraryPermission}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={photoLibraryPermission ? "checkmark" : "close"} 
              size={24} 
              color={photoLibraryPermission ? colors.accent[100] : colors.red[100]} 
            />
          </View>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Photo Library Access</Text>
            <Text style={styles.permissionDescription}>Required to select existing photos</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          (!cameraPermission || !photoLibraryPermission) && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={!cameraPermission || !photoLibraryPermission}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent[100], // Bright yellow/purple background
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    ...typography.heading1({ color: colors.white[100] }),
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    ...typography.bodyLarge({ color: colors.white[100] }),
    textAlign: 'center',
    marginBottom: 60,
  },
  permissionItem: {
    flexDirection: 'row',
    backgroundColor: colors.white[100],
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    ...typography.heading4({ color: colors.black[100] }),
    marginBottom: 5,
  },
  permissionDescription: {
    ...typography.bodyMedium({ color: colors.black[500] }),
  },
  button: {
    backgroundColor: colors.black[100],
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.black[500],
  },
  buttonText: {
    ...typography.buttonLarge({ color: colors.white[100] }),
  },
}); 