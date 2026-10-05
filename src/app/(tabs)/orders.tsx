import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { THEME } from '../../constants/theme';
import { Search, Package, MoreHorizontal } from 'lucide-react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { Card } from '../../components/ui/Card';

const MOCK_ORDERS = [
  { id: '#10254', customer: 'Rafsan Ahmed', product: 'Black Oversized T-Shirt, Size: M', amount: '৳ 1,850', status: 'Confirmed', time: '2m ago' },
  { id: '#10253', customer: 'Sadia Islam', product: 'White T-Shirt, Size: S', amount: '৳ 2,450', status: 'Processing', time: '12m ago' },
  { id: '#10252', customer: 'Tanvir Hasan', product: 'Hoodie, Size: L', amount: '৳ 1,680', status: 'Delivered', time: '25m ago' },
  { id: '#10251', customer: 'Nusrat Jahan', product: 'Cargo Pants, Size: 32', amount: '৳ 3,200', status: 'Pending', time: '45m ago' },
  { id: '#10250', customer: 'Rifat Ahmed', product: 'Black Oversized T-Shirt, Size: XL', amount: '৳ 1,150', status: 'Delivered', time: '1h ago' },
];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered'];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.tabsContainer}>
        <FlashList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={80}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.tab, activeTab === item && styles.activeTab]}
              onPress={() => setActiveTab(item)}
            >
              <Text style={[styles.tabText, activeTab === item && styles.activeTabText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={THEME.colors.textMuted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search order ID or customer..."
            placeholderTextColor={THEME.colors.textMuted}
          />
        </View>
      </Animated.View>

      <View style={styles.listContainer}>
        <FlashList
          data={MOCK_ORDERS}
          keyExtractor={(item) => item.id}
          estimatedItemSize={140}
          contentContainerStyle={{ padding: THEME.spacing.md }}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInRight.delay(400 + index * 50)}>
              <OrderCard item={item} />
            </Animated.View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const OrderCard = ({ item }: { item: any }) => (
  <Card padding="md" style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <View style={styles.orderIdContainer}>
        <Package size={16} color={THEME.colors.primary} />
        <Text style={styles.orderId}>{item.id}</Text>
      </View>
      <Text style={styles.orderAmount}>{item.amount}</Text>
    </View>
    
    <View style={styles.orderContent}>
      <View style={styles.customerAvatar}>
        <Text style={styles.customerInitials}>{item.customer.charAt(0)}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.product}</Text>
      </View>
    </View>
    
    <View style={styles.orderFooter}>
      <View style={[
        styles.statusBadge,
        item.status === 'Confirmed' && { backgroundColor: THEME.colors.successBackground },
        item.status === 'Processing' && { backgroundColor: THEME.colors.warningBackground },
        item.status === 'Pending' && { backgroundColor: THEME.colors.surfaceHighlight },
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'Confirmed' && { color: THEME.colors.success },
          item.status === 'Processing' && { color: THEME.colors.warning },
          item.status === 'Pending' && { color: THEME.colors.textSecondary },
        ]}>
          {item.status}
        </Text>
      </View>
      
      <View style={styles.footerRight}>
        <Text style={styles.timeText}>{item.time}</Text>
        <TouchableOpacity style={styles.moreAction}>
          <MoreHorizontal size={20} color={THEME.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  </Card>
);

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
  tabsContainer: {
    height: 40,
    marginBottom: THEME.spacing.sm,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    height: 32,
    justifyContent: 'center',
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
    borderRadius: THEME.radius.md,
    paddingHorizontal: THEME.spacing.md,
    height: 44,
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
  orderCard: {
    marginBottom: THEME.spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    ...THEME.typography.h3,
    marginLeft: THEME.spacing.sm,
  },
  orderAmount: {
    ...THEME.typography.h3,
    color: THEME.colors.primary,
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  customerInitials: {
    ...THEME.typography.body,
    fontWeight: '600',
  },
  orderDetails: {
    flex: 1,
  },
  customerName: {
    ...THEME.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  productName: {
    ...THEME.typography.caption,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: THEME.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
  },
  statusText: {
    ...THEME.typography.caption,
    fontWeight: '600',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...THEME.typography.caption,
    marginRight: THEME.spacing.md,
  },
  moreAction: {
    padding: 4,
  },
});
