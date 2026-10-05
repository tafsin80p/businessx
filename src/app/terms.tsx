import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.date}>Last updated: October 2026</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using BusinessX, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. Facebook Integration</Text>
          <Text style={styles.text}>
            Our service integrates with Facebook to help manage your business pages. By connecting your Facebook account, you grant us permission to read messages, manage conversations, and analyze page engagement on your behalf. We will never post content without your explicit consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. User Responsibilities</Text>
          <Text style={styles.text}>
            You must provide accurate information when creating an account. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Termination</Text>
          <Text style={styles.text}>
            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
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
