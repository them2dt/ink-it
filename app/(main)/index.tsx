import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useState, useRef, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function Page() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  // Request media library permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status === 'granted');
    })();
  }, []);

  if (!permission) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          router.push({
            pathname: '/edit',
            params: { photoUri: photo.uri }
          });
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const handleGallery = async () => {
    if (!galleryPermission) {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your photos',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings', 
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              setGalleryPermission(status === 'granted');
            } 
          }
        ]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        router.push({
          pathname: '/edit',
          params: { photoUri: selectedImage.uri }
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const handleAIGeneration = () => {
    console.log('Open AI generation');
  };

  const handleProfile = () => {
    router.push('/(main)/profile');
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with app name and profile button */}
      <View style={styles.header}>
        <Text style={styles.appName}>Ink it!</Text>
        <TouchableOpacity onPress={handleProfile} style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color={colors.accent[100]} />
        </TouchableOpacity>
      </View>

      {/* Camera preview */}
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <View style={styles.flipButtonInner}>
              <Ionicons name="camera-reverse" size={24} color={colors.accent[100]} />
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Gallery button */}
        <TouchableOpacity style={styles.sideButton} onPress={handleGallery}>
          <View style={styles.iconContainer}>
            <Ionicons name="images" size={24} color={colors.accent[100]} />
          </View>
        </TouchableOpacity>
        
        {/* Capture button */}
        <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        {/* AI button */}
        <TouchableOpacity style={styles.sideButton} onPress={handleAIGeneration}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={24} color={colors.accent[100]} />
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white[100],
  },
  appName: {
    ...typography.heading3({ color: colors.accent[100] }),
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  flipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: colors.black[100],
  },
  permissionButton: {
    backgroundColor: colors.accent[100],
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  permissionButtonText: {
    color: colors.white[100],
    fontSize: 16,
    fontWeight: '500',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.white[100],
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.accent[100],
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent[100],
    borderWidth: 4,
    borderColor: colors.white[100],
  },
});