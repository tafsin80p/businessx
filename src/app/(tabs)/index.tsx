import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../../constants/theme';
import { Bell, TrendingUp, Package, Users, MessageSquare } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greetingTitle}>Good morning,</Text>
            <Text style={styles.greetingName}>Mohim 👋</Text>
            <Text style={styles.subtitle}>Here's what's happening today.</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Sales"
            value="৳ 85,450"
            trend="+24%"
            icon={<TrendingUp size={20} color={THEME.colors.primary} />}
            delay={200}
          />
          <MetricCard
            title="Total Orders"
            value="42"
            trend="+32%"
            icon={<Package size={20} color={THEME.colors.success} />}
            delay={300}
          />
        </View>

        {/* Small Metrics */}
        <View style={styles.smallMetricsRow}>
          <SmallMetric title="Pending" value="8" icon={<Package size={16} color={THEME.colors.warning} />} delay={400} />
          <SmallMetric title="Customers" value="36" icon={<Users size={16} color={THEME.colors.accent} />} delay={450} />
          <SmallMetric title="Messages" value="12" icon={<MessageSquare size={16} color={THEME.colors.primary} />} delay={500} />
        </View>

        {/* Chart Area */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Analytics</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Today ▾</Text></TouchableOpacity>
          </View>
          <Card padding="lg" style={styles.chartCard}>
            <Text style={styles.placeholderText}>Chart Placeholder</Text>
          </Card>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          
          <Card style={styles.orderList}>
            <OrderItem id="#10254" total="৳ 1,850" status="Confirmed" time="2m ago" />
            <OrderItem id="#10253" total="৳ 2,450" status="Processing" time="12m ago" />
            <OrderItem id="#10252" total="৳ 1,680" status="Delivered" time="25m ago" isLast />
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MetricCard = ({ title, value, trend, icon, delay }: any) => (
  <Animated.View entering={FadeInDown.delay(delay)} style={styles.metricCardWrapper}>
    <Card padding="md" variant="elevated" style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
        <View style={styles.iconBox}>{icon}</View>
      </View>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        <Text style={styles.metricTrend}>{trend}</Text>
      </View>
    </Card>
  </Animated.View>
);

const SmallMetric = ({ title, value, icon, delay }: any) => (
  <Animated.View entering={FadeInDown.delay(delay)} style={styles.metricCardWrapper}>
    <Card padding="sm" style={styles.smallMetricCard}>
      <View style={styles.smallMetricIcon}>{icon}</View>
      <Text style={styles.smallMetricTitle} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
      <Text style={styles.smallMetricValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    </Card>
  </Animated.View>
);

const OrderItem = ({ id, total, status, time, isLast }: any) => (
  <View style={[styles.orderItem, !isLast && styles.orderItemBorder]}>
    <View style={styles.orderItemLeft}>
      <View style={styles.orderItemIcon}>
        <Package size={20} color={THEME.colors.textSecondary} />
      </View>
      <View>
        <Text style={styles.orderId}>{id}</Text>
        <Text style={styles.orderTime}>{time}</Text>
      </View>
    </View>
    <View style={styles.orderItemRight}>
      <Text style={styles.orderTotal}>{total}</Text>
      <View style={[
        styles.statusBadge, 
        status === 'Confirmed' && { backgroundColor: THEME.colors.successBackground },
        status === 'Processing' && { backgroundColor: THEME.colors.warningBackground },
      ]}>
        <Text style={[
          styles.statusText,
          status === 'Confirmed' && { color: THEME.colors.success },
          status === 'Processing' && { color: THEME.colors.warning },
        ]}>{status}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xxl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.xl,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  greetingTitle: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },
  greetingName: {
    ...THEME.typography.h1,
    marginBottom: 8,
  },
  subtitle: {
    ...THEME.typography.bodySm,
    color: THEME.colors.textMuted,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  avatarText: {
    ...THEME.typography.h3,
    color: THEME.colors.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    marginHorizontal: -THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
  },
  metricCardWrapper: {
    flex: 1,
    marginHorizontal: THEME.spacing.xs,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  metricTitle: {
    ...THEME.typography.bodySm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValueContainer: {
    marginTop: THEME.spacing.sm,
  },
  metricValue: {
    ...THEME.typography.h1,
    marginBottom: THEME.spacing.xs,
  },
  metricTrend: {
    ...THEME.typography.caption,
    color: THEME.colors.success,
  },
  smallMetricsRow: {
    flexDirection: 'row',
    marginHorizontal: -THEME.spacing.xs,
    marginBottom: THEME.spacing.xl,
  },
  smallMetricCard: {
    alignItems: 'center',
  },
  smallMetricIcon: {
    marginBottom: THEME.spacing.xs,
  },
  smallMetricTitle: {
    ...THEME.typography.caption,
    marginBottom: THEME.spacing.xs,
  },
  smallMetricValue: {
    ...THEME.typography.h3,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    ...THEME.typography.h3,
  },
  seeAll: {
    ...THEME.typography.bodySm,
    color: THEME.colors.primary,
  },
  chartCard: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...THEME.typography.caption,
  },
  orderList: {
    padding: 0,
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  orderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemIcon: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  orderId: {
    ...THEME.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderTime: {
    ...THEME.typography.caption,
  },
  orderItemRight: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    ...THEME.typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
