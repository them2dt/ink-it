import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function Privacy() {
  const handleBack = () => {
    router.back();
  };

  const handleAccept = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={28} color={colors.black[100]} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.paragraph}>
          At Ink-It, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our application.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Account Information:</Text> Email address and authentication data when you create an account.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>User Content:</Text> Images you upload to be processed into tattoo designs.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Usage Data:</Text> Information about how you use the app and the designs you generate.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Device Information:</Text> Basic device details necessary for the app to function properly.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:
        </Text>
        <Text style={styles.listItem}>• Provide and improve our services</Text>
        <Text style={styles.listItem}>• Process your images into tattoo designs</Text>
        <Text style={styles.listItem}>• Manage your account and subscription</Text>
        <Text style={styles.listItem}>• Respond to your inquiries</Text>
        <Text style={styles.listItem}>• Analyze usage patterns to enhance user experience</Text>

        <Text style={styles.sectionTitle}>3. Local Storage of Images</Text>
        <Text style={styles.paragraph}>
          Images you upload and the resulting tattoo designs are stored locally on your device. We do not store these images on our servers. Only references to these files are stored in our database to manage your account.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information to third parties. We may share your data with:
        </Text>
        <Text style={styles.listItem}>• Service providers that help us deliver our services (such as OpenAI for image processing)</Text>
        <Text style={styles.listItem}>• Legal authorities when required by law</Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
        </Text>
        <Text style={styles.listItem}>• Access your personal data</Text>
        <Text style={styles.listItem}>• Request correction of inaccurate data</Text>
        <Text style={styles.listItem}>• Request deletion of your data</Text>
        <Text style={styles.listItem}>• Withdraw consent at any time</Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our services are not intended for users under the age of 13. We do not knowingly collect information from children under 13.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at privacy@ink-it.com.
        </Text>
      </ScrollView>

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
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    ...typography.heading1({ color: colors.black[100] }),
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lastUpdated: {
    ...typography.bodySmall({ color: colors.black[100] }),
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    ...typography.heading3({ color: colors.black[100] }),
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    ...typography.bodyMedium({ color: colors.black[100] }),
    marginBottom: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  listItem: {
    ...typography.bodyMedium({ color: colors.black[100] }),
    marginBottom: 8,
    lineHeight: 24,
    paddingLeft: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.white[300],
  },
  acceptButton: {
    backgroundColor: colors.black[100],
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    ...typography.buttonMedium({ color: colors.white[100] }),
  },
}); 