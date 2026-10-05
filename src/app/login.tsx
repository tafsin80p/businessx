import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { THEME } from '../constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: FB_APP_ID,
    scopes: ['public_profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      handleFacebookSuccess(access_token);
    }
  }, [response]);

  const handleFacebookSuccess = async (token: string) => {
    setLoading(true);
    try {
      // Fetch user profile from Facebook
      const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
      const data = await res.json();
      
      // Log them in using our authStore
      await login(
        { id: data.id, name: data.name || 'Facebook User', email: data.email || `${data.id}@facebook.com` },
        token // Using FB token as session token for now
      );
      
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error', 'Failed to login with Facebook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.title}>FlowCommerce</Text>
          <Text style={styles.subtitle}>Log in to manage your business</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.actionContainer}>
          <Button
            title="Continue with Facebook"
            size="lg"
            fullWidth
            onPress={() => promptAsync()}
            loading={loading}
            disabled={!request}
            style={styles.fbButton}
            icon={<FontAwesome5 name="facebook" size={20} color="#FFF" style={{ marginRight: 10 }} />}
          />
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
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
    padding: THEME.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xxl * 1.5,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.lg,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    fontStyle: 'italic',
  },
  title: {
    ...THEME.typography.h1,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
  },
  actionContainer: {
    alignItems: 'center',
  },
  fbButton: {
    backgroundColor: '#1877F2',
    marginBottom: THEME.spacing.lg,
  },
  termsText: {
    ...THEME.typography.caption,
    textAlign: 'center',
    color: THEME.colors.textMuted,
    paddingHorizontal: THEME.spacing.lg,
    lineHeight: 18,
  },
});
