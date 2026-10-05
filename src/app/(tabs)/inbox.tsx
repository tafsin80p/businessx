import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { THEME } from '../../constants/theme';
import { Search, Edit, MoreVertical } from 'lucide-react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';

const MOCK_CHATS = [
  { id: '1', name: 'Rafsan Ahmed', message: 'Hi, is the black t-shirt available...', time: '2m', unread: 2, platform: 'messenger', online: true },
  { id: '2', name: 'Sadia Islam', message: 'Can I get a discount if I order 2?', time: '8m', unread: 0, platform: 'whatsapp', online: false },
  { id: '3', name: 'Tanvir Hasan', message: 'Where is my order? #10253', time: '12m', unread: 1, platform: 'instagram', online: true },
  { id: '4', name: 'Nusrat Jahan', message: 'Thank you! ❤️', time: '18m', unread: 0, platform: 'messenger', online: false },
  { id: '5', name: 'Rifat Ahmed', message: 'Do you have this in XL?', time: '25m', unread: 0, platform: 'whatsapp', online: false },
  { id: '6', name: 'Mahfuza Akter', message: 'I just placed an order. Can you confirm?', time: '32m', unread: 1, platform: 'instagram', online: true },
  { id: '7', name: 'Kamrul Islam', message: 'Please cancel my order', time: '1h', unread: 0, platform: 'messenger', online: false },
  { id: '8', name: 'Sumaiya', message: 'How long for delivery to Sylhet?', time: '2h', unread: 0, platform: 'whatsapp', online: false },
];

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'WhatsApp', 'Messenger', 'Instagram'];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity style={styles.headerAction}>
          <MoreVertical size={24} color={THEME.colors.text} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={THEME.colors.textMuted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={THEME.colors.textMuted}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(400)} style={styles.listContainer}>
        <FlashList
          data={MOCK_CHATS}
          keyExtractor={(item) => item.id}
          estimatedItemSize={76}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInRight.delay(400 + index * 50)}>
              <TouchableOpacity style={[styles.chatItem, item.unread > 0 && styles.chatItemUnread]}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, item.unread > 0 && styles.avatarUnread]}>
                    <Text style={[styles.avatarText, item.unread > 0 && styles.avatarTextUnread]}>{item.name.charAt(0)}</Text>
                  </View>
                  {item.online && <View style={styles.onlineBadge} />}
                  <View style={[styles.platformIcon, { backgroundColor: getPlatformColor(item.platform) }]}>
                    {getPlatformIcon(item.platform)}
                  </View>
                </View>
                
                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={[styles.chatName, item.unread > 0 && styles.chatNameUnread]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>{item.time}</Text>
                  </View>
                  <View style={styles.chatFooter}>
                    <Text style={[styles.chatMessage, item.unread > 0 && styles.chatMessageUnread]} numberOfLines={2}>
                      {item.message}
                    </Text>
                    {item.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      </Animated.View>

      <TouchableOpacity style={styles.fab}>
        <Edit size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function getPlatformColor(platform: string) {
  switch (platform) {
    case 'whatsapp': return '#25D366';
    case 'messenger': return '#00B2FF';
    case 'instagram': return '#E1306C';
    default: return THEME.colors.surfaceHighlight;
  }
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case 'whatsapp': return <FontAwesome5 name="whatsapp" size={12} color="#FFF" />;
    case 'messenger': return <FontAwesome5 name="facebook-messenger" size={11} color="#FFF" />;
    case 'instagram': return <FontAwesome5 name="instagram" size={12} color="#FFF" />;
    default: return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  headerTitle: {
    ...THEME.typography.h2,
  },
  headerAction: {
    padding: THEME.spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
  },
  activeTab: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.textSecondary,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.round, // Make it pill-shaped
    paddingHorizontal: THEME.spacing.md,
    height: 48, // Slightly taller
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
    color: THEME.colors.text,
    ...THEME.typography.body,
  },
  listContainer: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
  chatItemUnread: {
    backgroundColor: THEME.colors.surfaceHighlight + '40', // Slight highlight for unread
  },
  avatarContainer: {
    position: 'relative',
    marginRight: THEME.spacing.md,
  },
  avatar: {
    width: 52, // Slightly larger
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUnread: {
    backgroundColor: THEME.colors.primary + '20',
  },
  avatarText: {
    ...THEME.typography.h3,
    color: THEME.colors.text,
  },
  avatarTextUnread: {
    color: THEME.colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: THEME.colors.success,
    borderWidth: 2,
    borderColor: THEME.colors.background,
  },
  platformIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.background,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  chatName: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  chatNameUnread: {
    color: THEME.colors.text,
    fontWeight: '700',
  },
  chatTime: {
    ...THEME.typography.caption,
  },
  chatTimeUnread: {
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    ...THEME.typography.bodySm,
    color: THEME.colors.textMuted,
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  chatMessageUnread: {
    color: THEME.colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: THEME.colors.primary,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: THEME.spacing.lg,
    right: THEME.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.md,
  },
});
