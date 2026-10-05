import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { THEME } from '../../constants/theme';
import { Search, Plus } from 'lucide-react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Black Oversized T-Shirt', variants: 'M, L, XL', price: '৳ 850', stock: 24 },
  { id: '2', name: 'White T-Shirt', variants: 'S, M, L, XL', price: '৳ 750', stock: 18 },
  { id: '3', name: 'Hoodie', variants: 'M, L, XXL', price: '৳ 1,550', stock: 12 },
  { id: '4', name: 'Cargo Pants', variants: '30, 32, 34', price: '৳ 1,250', stock: 8 },
  { id: '5', name: 'Denim Jacket', variants: 'M, L', price: '৳ 2,100', stock: 5 },
];

export default function ProductsScreen() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Published', 'Out of Stock'];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.headerAddButton}>
          <Plus size={24} color={THEME.colors.primary} />
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
            placeholder="Search products..."
            placeholderTextColor={THEME.colors.textMuted}
          />
        </View>
      </Animated.View>

      <View style={styles.listContainer}>
        <FlashList
          data={MOCK_PRODUCTS}
          keyExtractor={(item) => item.id}
          estimatedItemSize={100}
          contentContainerStyle={{ padding: THEME.spacing.md }}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInRight.delay(400 + index * 50)}>
              <ProductCard item={item} />
            </Animated.View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const ProductCard = ({ item }: { item: any }) => (
  <Card padding="md" style={styles.productCard}>
    <View style={styles.productImagePlaceholder}>
      <Text style={styles.imagePlaceholderText}>Img</Text>
    </View>
    <View style={styles.productDetails}>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.productVariants}>{item.variants}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </View>
    <View style={styles.productStock}>
      <Text style={styles.stockLabel}>Stock:</Text>
      <View style={[styles.stockBadge, item.stock < 10 && styles.lowStockBadge]}>
        <Text style={[styles.stockText, item.stock < 10 && styles.lowStockText]}>{item.stock}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  headerTitle: {
    ...THEME.typography.h2,
  },
  headerAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
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
  productCard: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
    alignItems: 'center',
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  imagePlaceholderText: {
    ...THEME.typography.caption,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    ...THEME.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  productVariants: {
    ...THEME.typography.caption,
    marginBottom: 4,
  },
  productPrice: {
    ...THEME.typography.bodySm,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  productStock: {
    alignItems: 'center',
  },
  stockLabel: {
    ...THEME.typography.caption,
    marginBottom: 4,
  },
  stockBadge: {
    backgroundColor: THEME.colors.surfaceHighlight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowStockBadge: {
    backgroundColor: THEME.colors.warningBackground,
  },
  stockText: {
    ...THEME.typography.bodySm,
    fontWeight: '600',
  },
  lowStockText: {
    color: THEME.colors.warning,
  },
});
