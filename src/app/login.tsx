import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { THEME } from '../constants/theme';
import { Mail, Lock } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import Constants from 'expo-constants';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('hello@businessx.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Get computer's IP address dynamically for physical devices
      const hostUri = Constants?.expoConfig?.hostUri;
      const host = hostUri ? hostUri.split(':')[0] : '192.168.0.108';
      const apiUrl = `http://${host}:8081/api/auth/login`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed');
      } else {
        await login(data.user, data.token);
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.form}>
          <Input
            placeholder="Email or Phone"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={THEME.colors.textMuted} />}
          />
          
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={THEME.colors.textMuted} />}
          />
          
          <Text style={styles.forgotPassword}>Forgot password?</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Button
            title="Log In"
            size="lg"
            fullWidth
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.socialContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <Button
              title="Google"
              variant="outline"
              fullWidth
              style={styles.socialButton}
            />
            <View style={{ width: THEME.spacing.md }} />
            <Button
              title="Facebook"
              variant="outline"
              fullWidth
              style={styles.socialButton}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.signupText}>Sign Up</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: THEME.spacing.lg,
    paddingTop: THEME.spacing.xxl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl * 1.5,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.lg,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    fontStyle: 'italic',
  },
  title: {
    ...THEME.typography.h2,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
  },
  form: {
    marginBottom: THEME.spacing.xl,
  },
  forgotPassword: {
    ...THEME.typography.bodySm,
    color: THEME.colors.primary,
    textAlign: 'right',
    marginTop: -THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  errorText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.error || '#ef4444',
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  loginButton: {
    marginTop: THEME.spacing.md,
  },
  socialContainer: {
    marginBottom: THEME.spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.border,
  },
  dividerText: {
    ...THEME.typography.caption,
    paddingHorizontal: THEME.spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: THEME.spacing.xl,
  },
  footerText: {
    ...THEME.typography.bodySm,
  },
  signupText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
});
