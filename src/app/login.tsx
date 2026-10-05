import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { THEME } from '../constants/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        setLoading(false);
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Failed to get access token');
      }

      // Fetch profile directly (or we can fallback to Graph API)
      const profile = await Profile.getCurrentProfile();
      let name = profile?.name;
      let email = profile?.email;

      // Sometimes Profile doesn't return email, so we do Graph API just in case
      if (!name) {
        const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${data.accessToken}`);
        const graphData = await res.json();
        name = graphData.name;
        email = graphData.email;
      }
      
      await login(
        { 
          id: profile?.userID || data.userID, 
          name: name || 'Facebook User', 
          email: email || `${data.userID}@facebook.com` 
        },
        data.accessToken.toString()
      );
      
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Failed to login with Facebook');
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
