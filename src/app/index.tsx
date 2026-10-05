import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { THEME } from '../constants/theme';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.appName}>FlowCommerce</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>
            Manage. Sell. Grow.
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.subtitle}>
            All your social channels, orders, customers and deliveries in one place.
          </Animated.Text>
        </View>

        <Animated.View entering={SlideInDown.delay(700).springify()} style={styles.actionContainer}>
          <Button
            title="Get Started"
            size="lg"
            fullWidth
            onPress={() => router.push('/login')}
          />
          <Button
            title="I already have an account"
            variant="ghost"
            size="md"
            fullWidth
            style={{ marginTop: THEME.spacing.sm }}
            onPress={() => router.push('/login')}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: THEME.spacing.xxl * 2,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    fontStyle: 'italic',
  },
  appName: {
    ...THEME.typography.h2,
    color: '#FFF',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xxl * 2,
  },
  title: {
    ...THEME.typography.h1,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.md,
    lineHeight: 24,
  },
  actionContainer: {
    paddingBottom: THEME.spacing.xl,
  },
});
