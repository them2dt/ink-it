import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Share, Alert, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function ResultPage() {
  const { tattooUri } = useLocalSearchParams<{ tattooUri: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Request permission to save to device media library
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBack = () => {
    // Go back to edit page
    router.push('/edit' as any);
  };

  const handleSave = async () => {
    try {
      if (!tattooUri) {
        Alert.alert('Error', 'No tattoo image to save');
        return;
      }

      if (!hasPermission) {
        Alert.alert(
          'Permission Required', 
          'Please grant permission to save images to your gallery',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings', 
              onPress: () => MediaLibrary.requestPermissionsAsync() 
            }
          ]
        );
        return;
      }

      // Save the image to the device's media library
      await MediaLibrary.saveToLibraryAsync(tattooUri);
      
      // Show success state
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image to gallery');
    }
  };

  const handleShare = async () => {
    try {
      if (!tattooUri) {
        Alert.alert('Error', 'No tattoo image to share');
        return;
      }

      await Share.share({
        title: 'Check out my tattoo design!',
        message: 'Check out my new tattoo design created with Ink it!',
        url: tattooUri,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const handleRetry = () => {
    // Go back to edit page to try another style
    router.push('/edit' as any);
  };

  const handleTakeNewPhoto = () => {
    // Go back to the main camera screen
    router.push('/' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={24} color={colors.accent[100]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Tattoo</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Result Image */}
      <View style={styles.imageContainer}>
        {tattooUri ? (
          <Image 
            source={{ uri: tattooUri }} 
            style={styles.resultImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={60} color={colors.accent[200]} />
            <Text style={styles.noImageText}>Image not available</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleRetry}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="refresh" size={24} color={colors.accent[100]} />
          </View>
          <Text style={styles.actionText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleTakeNewPhoto}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={24} color={colors.accent[100]} />
          </View>
          <Text style={styles.actionText}>New Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleSave}
        >
          <View style={[styles.iconContainer, isSaved && styles.activeIcon]}>
            <Ionicons 
              name={isSaved ? "checkmark-circle" : "save"} 
              size={24} 
              color={colors.accent[100]} 
            />
          </View>
          <Text style={styles.actionText}>
            {isSaved ? 'Saved!' : 'Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleShare}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="share-social" size={24} color={colors.accent[100]} />
          </View>
          <Text style={styles.actionText}>Share</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white[100],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.heading3({ color: colors.black[100] }),
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white[100],
  },
  resultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80%',
    backgroundColor: colors.white[200],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white[300],
  },
  noImageText: {
    ...typography.bodyMedium({ color: colors.black[200] }),
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.white[100],
    borderTopWidth: 1,
    borderTopColor: colors.white[300],
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    minWidth: 70,
    marginHorizontal: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeIcon: {
    backgroundColor: colors.accent[300],
  },
  actionText: {
    ...typography.bodySmall({ color: colors.black[100] }),
  },
}); 