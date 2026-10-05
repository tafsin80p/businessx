import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../../constants/theme';
import { Users, Truck, Zap, BarChart2, Users as TeamIcon, Settings, Bell, Shield, Store, Link as LinkIcon, LogOut } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '../../components/ui/Card';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function MoreScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const MENU_ITEMS = [
    { title: 'Customers', icon: <Users size={24} color={THEME.colors.primary} /> },
    { title: 'Courier', icon: <Truck size={24} color={THEME.colors.primary} /> },
    { title: 'Automation', icon: <Zap size={24} color={THEME.colors.primary} /> },
    { title: 'Reports', icon: <BarChart2 size={24} color={THEME.colors.primary} /> },
    { title: 'Team', icon: <TeamIcon size={24} color={THEME.colors.primary} /> },
    { title: 'Store', icon: <Store size={24} color={THEME.colors.primary} /> },
    { title: 'Integrations', icon: <LinkIcon size={24} color={THEME.colors.primary} />, route: '/integrations' },
    { title: 'Settings', icon: <Settings size={24} color={THEME.colors.primary} /> },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <Text style={styles.headerTitle}>Business Management</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.profileSection}>
          <Card padding="md" style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileRole}>{user?.email || 'user@example.com'}</Text>
            </View>
            <TouchableOpacity style={styles.profileAction}>
              <Text style={styles.profileActionText}>Edit</Text>
            </TouchableOpacity>
          </Card>
        </Animated.View>

        <View style={styles.grid}>
          {MENU_ITEMS.map((item, index) => (
            <Animated.View 
              key={item.title} 
              entering={FadeInDown.delay(300 + index * 50)} 
              style={styles.gridItemWrapper}
            >
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <Card padding="lg" style={styles.menuCard}>
                  <View style={styles.iconContainer}>{item.icon}</View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(700)}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={THEME.colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800)} style={styles.footer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.footerBrand}>FlowCommerce</Text>
          <Text style={styles.footerVersion}>Business Automation Platform v1.0.0</Text>
        </Animated.View>
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
    padding: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  headerTitle: {
    ...THEME.typography.h2,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl * 2,
  },
  profileSection: {
    marginBottom: THEME.spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  avatarText: {
    ...THEME.typography.h3,
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...THEME.typography.h3,
  },
  profileRole: {
    ...THEME.typography.bodySm,
  },
  profileAction: {
    padding: THEME.spacing.sm,
    backgroundColor: THEME.colors.surfaceHighlight,
    borderRadius: THEME.radius.sm,
  },
  profileActionText: {
    ...THEME.typography.caption,
    color: THEME.colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -THEME.spacing.sm / 2,
  },
  gridItemWrapper: {
    width: '33.33%',
    padding: THEME.spacing.sm / 2,
  },
  gridItem: {
    flex: 1,
  },
  menuCard: {
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  iconContainer: {
    marginBottom: THEME.spacing.sm,
  },
  menuTitle: {
    ...THEME.typography.caption,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.error + '15',
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    marginTop: THEME.spacing.xl,
    marginHorizontal: THEME.spacing.sm,
  },
  logoutText: {
    ...THEME.typography.body,
    color: THEME.colors.error,
    fontWeight: '600',
    marginLeft: THEME.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: THEME.spacing.xxl,
    opacity: 0.5,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.sm,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.background,
    fontStyle: 'italic',
  },
  footerBrand: {
    ...THEME.typography.bodySm,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerVersion: {
    ...THEME.typography.caption,
  },
});
