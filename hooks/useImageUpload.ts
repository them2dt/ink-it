import { useState } from 'react';
import { uploadImage, processImageToTattoo } from '@/services/imageProcessing';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { ImageUploadRequest } from '@/types/api.types';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tattooUrl, setTattooUrl] = useState<string | null>(null);

  // Request permissions for camera and media library
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
      const libraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return {
        cameraGranted: cameraResult.granted,
        libraryGranted: libraryResult.granted
      };
    }
    return { cameraGranted: true, libraryGranted: true };
  };

  // Take a photo using the camera
  const takePhoto = async (userId: string) => {
    setError(null);
    
    try {
      // Request permissions
      const { cameraGranted } = await requestPermissions();
      if (!cameraGranted) {
        setError('Camera permission is required');
        return null;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        // Upload the image
        const imageToUpload: ImageUploadRequest = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'camera_image.jpg',
        };
        return await handleImageUpload(userId, imageToUpload);
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error taking photo');
      return null;
    }
  };
  
  // Pick an image from the library
  const pickImage = async (userId: string) => {
    setError(null);
    
    try {
      // Request permissions
      const { libraryGranted } = await requestPermissions();
      if (!libraryGranted) {
        setError('Media library permission is required');
        return null;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        // Get file extension
        const uri = result.assets[0].uri;
        const fileExt = uri.split('.').pop() || 'jpg';
        
        // Upload the image
        const imageToUpload: ImageUploadRequest = {
          uri,
          type: `image/${fileExt}`,
          name: `upload_image.${fileExt}`,
        };
        return await handleImageUpload(userId, imageToUpload);
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error picking image');
      return null;
    }
  };
  
  // Handle the image upload
  const handleImageUpload = async (userId: string, imageFile: ImageUploadRequest) => {
    setUploading(true);
    setError(null);
    
    try {
      // Upload the image
      const uploadedImageUrl = await uploadImage(userId, imageFile);
      setImageUrl(uploadedImageUrl);
      return uploadedImageUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  // Process an image into a tattoo
  const processImage = async (userId: string, imageUrl: string) => {
    setProcessing(true);
    setError(null);
    
    try {
      const result = await processImageToTattoo({
        userId,
        imageUrl,
      });
      
      if (result.success && result.tattooUrl) {
        setTattooUrl(result.tattooUrl);
        return result.tattooUrl;
      } else {
        setError(result.error || 'Unknown error processing image');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing image');
      return null;
    } finally {
      setProcessing(false);
    }
  };
  
  return {
    uploading,
    processing,
    error,
    imageUrl,
    tattooUrl,
    takePhoto,
    pickImage,
    processImage,
    reset: () => {
      setImageUrl(null);
      setTattooUrl(null);
      setError(null);
    },
  };
} 