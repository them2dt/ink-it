import { View, Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useEffect, useRef } from 'react';

export default function ProcessingPage() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000, // 3 seconds to complete
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Navigate to results page after "processing" is complete
    const timer = setTimeout(() => {
      router.replace('/result' as any);
    }, 3500); // A bit longer than the animation to ensure it completes

    return () => clearTimeout(timer);
  }, []);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Get progress as a percentage to display in text
  const progressText = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.title}>Creating your tattoo...</Text>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width }
            ]} 
          />
        </View>
        
        <Animated.Text style={styles.progressText}>
          {progressText}
        </Animated.Text>
        
        <Text style={styles.message}>
          Transforming your image with AI magic
        </Text>
      </Animated.View>
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
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white[100],
    marginBottom: 40,
    textAlign: 'center',
  },
  progressContainer: {
    height: 10,
    width: '100%',
    backgroundColor: colors.white[200],
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
    fontSize: 16,
    color: colors.white[100],
    marginBottom: 40,
  },
  message: {
    fontSize: 16,
    color: colors.white[200],
    textAlign: 'center',
    fontWeight: '500',
  },
}); 