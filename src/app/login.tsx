import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { THEME } from '../constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      // 1. Create deep link to return back to Expo Go
      const returnUrl = Linking.createURL('login');
      
      // 2. Vercel Proxy URL
      const proxyUrl = 'https://businessxapp.vercel.app/api/auth-proxy';
      
      // 3. Build Facebook Auth URL
      const FB_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1575530317643123';
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${proxyUrl}&response_type=token&scope=public_profile,email&state=${encodeURIComponent(returnUrl)}`;
      
      // 4. Open the browser
      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);
      
      if (result.type === 'success' && result.url) {
        // Parse token from returned URL
        let token = null;
        if (result.url.includes('access_token=')) {
          token = result.url.split('access_token=')[1].split('&')[0];
        }
        
        if (!token) throw new Error('No access token returned');

        // Fetch user profile
        const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
        const data = await res.json();
        
        if (data.error) throw new Error(data.error.message);
        
        await login(
          { id: data.id, name: data.name || 'Facebook User', email: data.email || `${data.id}@facebook.com` },
          token
        );
        
        router.replace('/(tabs)');
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Failed to login with Facebook');
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
            onPress={handleFacebookLogin}
            loading={loading}
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
