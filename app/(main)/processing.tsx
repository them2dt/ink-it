import { View, Text, StyleSheet, SafeAreaView, Animated, Easing, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useEffect, useRef, useState } from 'react';
import { generateTattooFromImage } from '@/services/imageProcessing';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import ErrorDialog from '@/components/ErrorDialog';

export default function ProcessingPage() {
  const { photoUri, styleId } = useLocalSearchParams<{ photoUri: string, styleId: string }>();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("Analyzing your image");
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Rotate animation for the loading icon
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Start the loading spinner rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 15000, // Longer duration to match actual processing time
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Update processing step messages
    const steps = [
      { step: "Analyzing your image", time: 0 },
      { step: "Interpreting visual elements", time: 3000 },
      { step: "Adapting to tattoo style", time: 6000 },
      { step: "Generating artwork", time: 9000 },
      { step: "Finalizing your design", time: 12000 }
    ];

    // Set up timers for the step messages
    const timers = steps.map(({ step, time }) => 
      setTimeout(() => setProcessingStep(step), time)
    );

    // Process the image
    const generateTattoo = async () => {
      try {
        const result = await generateTattooFromImage({
          userId: user?.id || '',
          imageUrl: photoUri,
          style: styleId || 'minimalist', // Use the selected style or default to minimalist
        });

        if (result.success && result.tattooUrl) {
          // Navigate to results page with the generated tattoo URI
          setTimeout(() => {
            router.replace({
              pathname: '/result',
              params: { tattooUri: result.tattooUrl }
            });
          }, 500); // Short delay to ensure animations look smooth
        } else {
          // Only set error if we have an actual error message
          if (result.error) {
            setError(result.error);
            setIsErrorVisible(true);
          }
        }
      } catch (err) {
        console.error('Error generating tattoo:', err);
        setError(err instanceof Error ? err.message : 'Error generating tattoo');
        setIsErrorVisible(true);
      }
    };

    generateTattoo();

    return () => {
      // Clean up timers
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [photoUri, styleId, user]);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Get progress as a percentage to display in text
  const progressText = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const handleErrorClose = () => {
    setIsErrorVisible(false);
    router.back();
  };

  const handleTryAgain = () => {
    setIsErrorVisible(false);
    // Restart the processing
    router.replace('/edit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.title}>Creating your tattoo...</Text>
        
        {/* Loading spinner */}
        <Animated.View style={[styles.spinnerContainer, { transform: [{ rotate: rotateInterpolate }] }]}>
          <Ionicons name="sync" size={70} color={colors.white[100]} />
        </Animated.View>
        
        {/* Current processing step */}
        <Text style={styles.stepText}>{processingStep}</Text>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width }
            ]} 
          />
        </View>
      </Animated.View>

      {/* Error Dialog */}
      <ErrorDialog
        visible={isErrorVisible}
        title="Processing Error"
        message={error || "An error occurred while generating your tattoo."}
        primaryButtonText="Go Back"
        secondaryButtonText="Try Again"
        onPrimaryButtonPress={handleErrorClose}
        onSecondaryButtonPress={handleTryAgain}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  title: {
    ...typography.heading3({ color: colors.white[100] }),
    marginBottom: 40,
    textAlign: 'center',
  },
  spinnerContainer: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  stepText: {
    ...typography.bodyLarge({ color: colors.white[100] }),
    marginBottom: 30,
    textAlign: 'center',
  },
  progressContainer: {
    height: 10,
    width: '100%',
    backgroundColor: colors.accent[200],
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.white[100],
    borderRadius: 10,
  },
  progressText: {
    ...typography.bodyMedium({ color: colors.white[100] }),
    marginBottom: 40,
  },
  message: {
    ...typography.bodyMedium({ color: colors.white[200] }),
    textAlign: 'center',
  },
  errorMessage: {
    ...typography.bodyMedium({ color: colors.white[200] }),
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: colors.white[100],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.buttonMedium({ color: colors.accent[100] }),
  },
}); 