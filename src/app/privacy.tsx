import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.date}>Last updated: October 2026</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.text}>
            When you use BusinessX, we may collect information such as your name, email address, and Facebook Page data (including messages and engagements) to provide our services. We only collect data necessary to operate the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the collected information to:{"\n"}
            - Provide and maintain our Service{"\n"}
            - Manage your Facebook pages as requested{"\n"}
            - Notify you about changes to our Service{"\n"}
            - Provide customer support
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. Data Protection</Text>
          <Text style={styles.text}>
            The security of your data is important to us. We strive to use commercially acceptable means to protect your Personal Information. Your Facebook access tokens are stored securely and never shared with third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Data Deletion Request</Text>
          <Text style={styles.text}>
            If you wish to delete your account or any data associated with your Facebook profile, you can disconnect your account from our app settings or contact us directly. We will remove all associated tokens and cached data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: THEME.spacing.xl,
  },
  title: {
    ...THEME.typography.h1,
    marginBottom: THEME.spacing.xs,
  },
  date: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.xl,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  heading: {
    ...THEME.typography.h3,
    marginBottom: THEME.spacing.sm,
  },
  text: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    lineHeight: 24,
  },
});
