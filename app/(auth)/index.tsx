import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.titleDefault}>Image to tattoo,{'\n'}</Text>
          <Text style={styles.titleHighlight}>in 30 seconds.</Text>
        </Text>
      </View>

      <View style={styles.curvedBackground}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.appleButton]}
            onPress={() => router.push("/(auth)/processApple")}
          >
            <Text style={styles.buttonText}>continue with apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.gmailButton]}
            onPress={() => router.push("/(auth)/processGmail")}
          >
            <Text style={styles.buttonText}>continue with gmail</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.emailButton]}
            onPress={() => router.push("/(auth)/emailLogin")}
          >
            <Text style={[styles.buttonText, styles.emailButtonText]}>continue with email</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By creating an account, you're accepting our{'\n'}terms and services.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent[100], // Bright yellow background
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    ...typography.heading1(),
    textAlign: 'center',
  },
  titleDefault: {
    color: colors.accent[400],
  },
  titleHighlight: {
    color: colors.white[100],
  },
  curvedBackground: {
    backgroundColor: colors.white[100],
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: colors.accent[100],
  },
  gmailButton: {
    backgroundColor: colors.accent[100],
  },
  emailButton: {
    backgroundColor: colors.black[100],
  },
  buttonText: {
    ...typography.buttonMedium({ color: colors.black[100] }),
  },
  emailButtonText: {
    color: colors.white[100],
  },
  disclaimer: {
    ...typography.caption({ color: colors.black[600] }),
    marginTop: 12,
    textAlign: 'center',
  },
});