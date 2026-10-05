import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export default function IntegrationsScreen() {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  // For Web: Catch the token when the page reloads after proxy redirect
  useEffect(() => {
    if (Platform.OS === 'web' && window.location.href.includes('access_token=')) {
      const url = window.location.href;
      const token = url.split('access_token=')[1].split('&')[0];
      if (token) {
        fetchFacebookPages(token);
        // Clean URL so it doesn't try to fetch again on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleConnectFacebook = async () => {
    try {
      const returnUrl = Linking.createURL('integrations');
      const proxyUrl = 'https://businessxapp.vercel.app/api/auth-proxy';
      const FB_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1575530317643123';
      
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(proxyUrl)}&response_type=token&scope=pages_show_list,pages_messaging,pages_read_engagement&state=${encodeURIComponent(returnUrl)}`;
      
      if (Platform.OS === 'web') {
        window.location.href = authUrl;
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

      if (result.type === 'success' && result.url) {
        let token = null;
        if (result.url.includes('access_token=')) {
          token = result.url.split('access_token=')[1].split('&')[0];
        }
        
        if (!token) throw new Error('Failed to get access token');
        fetchFacebookPages(token);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to authenticate with Facebook');
    }
  };

  const fetchFacebookPages = async (userToken: string) => {
    setLoadingPages(true);
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${userToken}`);
      const data = await res.json();
      if (data.data) {
        setPages(data.data);
      } else {
        Alert.alert('Error', 'Failed to fetch pages.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error while fetching pages.');
    } finally {
      setLoadingPages(false);
    }
  };

  const connectPage = async (page: any) => {
    setSubscribing(page.id);
    try {
      // Subscribe the Page to our App's Webhook
      const res = await fetch(`https://graph.facebook.com/v18.0/${page.id}/subscribed_apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscribed_fields: ['messages', 'messaging_postbacks'],
          access_token: page.access_token,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', `${page.name} is now connected! Messages will appear in your Inbox.`);
        setPages(pages.map(p => p.id === page.id ? { ...p, isConnected: true } : p));
      } else {
        Alert.alert('Connection Failed', data.error?.message || 'Unknown error');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to connect page.');
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Integrations</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card padding="lg" style={styles.integrationCard}>
          <View style={styles.integrationHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#1877F2' }]}>
              <FontAwesome5 name="facebook-f" size={24} color="#FFF" />
            </View>
            <View style={styles.integrationInfo}>
              <Text style={styles.integrationTitle}>Facebook Messenger</Text>
              <Text style={styles.integrationDesc}>Connect your pages to receive messages directly in your inbox.</Text>
            </View>
          </View>

          {pages.length === 0 ? (
            <Button
              title="Connect with Facebook"
              onPress={handleConnectFacebook}
              style={styles.connectBtn}
            />
          ) : (
            <View style={styles.pagesList}>
              <Text style={styles.pagesListTitle}>Your Pages</Text>
              {pages.map((page) => (
                <View key={page.id} style={styles.pageItem}>
                  <Text style={styles.pageName}>{page.name}</Text>
                  {page.isConnected ? (
                    <View style={styles.connectedBadge}>
                      <CheckCircle2 size={16} color={THEME.colors.success} />
                      <Text style={styles.connectedText}>Connected</Text>
                    </View>
                  ) : (
                    <Button 
                      title="Connect" 
                      size="sm" 
                      variant="outline"
                      onPress={() => connectPage(page)}
                      loading={subscribing === page.id}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
          {loadingPages && <ActivityIndicator style={{ marginTop: THEME.spacing.md }} />}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
  },
  backButton: {
    padding: THEME.spacing.xs,
  },
  headerTitle: {
    ...THEME.typography.h3,
  },
  scrollContent: {
    padding: THEME.spacing.md,
  },
  integrationCard: {
    marginBottom: THEME.spacing.lg,
  },
  integrationHeader: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.lg,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  integrationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  integrationTitle: {
    ...THEME.typography.h3,
    marginBottom: 4,
  },
  integrationDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.textSecondary,
  },
  connectBtn: {
    marginTop: THEME.spacing.sm,
  },
  pagesList: {
    marginTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: THEME.spacing.md,
  },
  pagesListTitle: {
    ...THEME.typography.body,
    fontWeight: '600',
    marginBottom: THEME.spacing.md,
  },
  pageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border + '50',
  },
  pageName: {
    ...THEME.typography.body,
    flex: 1,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedText: {
    ...THEME.typography.caption,
    color: THEME.colors.success,
    fontWeight: '600',
    marginLeft: 4,
  },
});
