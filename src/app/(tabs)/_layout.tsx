import { Tabs } from 'react-native-router-flux'; // wait, it's expo-router
import { Tabs as ExpoTabs } from 'expo-router';
import React from 'react';
import { THEME } from '../../constants/theme';
import { Home, Inbox, ShoppingBag, Package, Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <ExpoTabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: THEME.colors.surface,
          borderTopColor: THEME.colors.border,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: THEME.colors.border,
          height: 65 + (Platform.OS === 'ios' ? insets.bottom : 10),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          paddingTop: 12,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textMuted,
        tabBarLabelStyle: {
          ...THEME.typography.caption,
          marginTop: 4,
        },
      }}
    >
      <ExpoTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Inbox size={24} color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
        }}
      />
    </ExpoTabs>
  );
}
