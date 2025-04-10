import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Share } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useState } from 'react';

export default function ResultPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleBack = () => {
    // Go back to edit page
    router.push('/edit' as any);
  };

  const handleSave = () => {
    // In a real app, implement image saving to gallery
    console.log('Saving image to gallery');
    setIsSaved(true);
    
    // Show success message briefly
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleShare = async () => {
    try {
      // In a real app, get the actual image URL
      await Share.share({
        message: 'Check out my new tattoo design created with Ink it!',
        // url: 'file://path-to-image', // This would be the actual image
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Tattoo</Text>
      </View>

      {/* Result Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('@/assets/images/placeholder.png')} 
          style={styles.resultImage}
          resizeMode="contain"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleRetry}>
          <Ionicons name="refresh" size={24} color={colors.white[100]} />
          <Text style={styles.actionText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleTakeNewPhoto}>
          <Ionicons name="camera" size={24} color={colors.white[100]} />
          <Text style={styles.actionText}>New Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, isSaved && styles.activeButton]} 
          onPress={handleSave}
        >
          <Ionicons 
            name={isSaved ? "checkmark-circle" : "save"} 
            size={24} 
            color={isSaved ? colors.white[100] : colors.white[100]} 
          />
          <Text 
            style={[styles.actionText, isSaved && styles.activeButtonText]}
          >
            {isSaved ? 'Saved!' : 'Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social" size={24} color={colors.white[100]} />
          <Text style={styles.actionText}>Share</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.accent[100],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.heading3({ color: colors.white[100] }),
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: colors.accent[100],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    minWidth: 70,
    marginHorizontal: 2,
  },
  activeButton: {
    backgroundColor: colors.white[100],
  },
  actionText: {
    ...typography.bodySmall({ color: colors.white[100] }),
    marginTop: 8,
  },
  activeButtonText: {
    color: colors.white[100],
  },
}); 