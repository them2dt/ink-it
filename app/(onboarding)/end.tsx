import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>And it's done!</Text>
        
        <Image 
          source={require('@/assets/images/onboarding_3.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push("/(onboarding)/permissions")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A11BE', // Bright yellow background
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    ...typography.heading1({ color: colors.white[100] }),
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.black[100],
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.buttonLarge({ color: colors.white[100] }),
  },
});