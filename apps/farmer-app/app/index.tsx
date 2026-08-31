import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { REALTIME_CHANNELS, subscribeToChannel } from '@kisancall/shared-types';
import { supabase } from '../src/supabase';

// Design tokens matching Stitch design system
const colors = {
  primary: '#00450d',
  onPrimary: '#ffffff',
  primaryContainer: '#1b5e20',
  onPrimaryContainer: '#90d689',
  secondary: '#006e1c',
  onSecondary: '#ffffff',
  surface: '#f7fbf1',
  surfaceContainer: '#ecefe6',
  surfaceContainerLow: '#f2f5ec',
  onSurface: '#191d17',
  onSurfaceVariant: '#41493e',
  outlineVariant: '#c0c9bb',
  outline: '#717a6d',
  background: '#f7fbf1',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  containerMargin: 16,
  touchTarget: 48,
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, language, signOut } = useAuth();

  const [queuePosition] = useState<number>(14);
  const [etaMinutes] = useState<number>(45);
  const [activeNav, setActiveNav] = useState<string>('home');

  useEffect(() => {
    const farmerId = user?.id || 'FARMER-9876';
    const channelName = REALTIME_CHANNELS.farmerStatus(farmerId);
    const unsubscribe = subscribeToChannel(
      supabase,
      channelName,
      { table: 'bookings', filter: `farmer_id=eq.${farmerId}` },
      (payload) => {
        if (payload.new?.status) {
          console.log('[Realtime Farmer Status Update]', payload.new);
        }
      }
    );
    return () => unsubscribe();
  }, [user]);

  const handleCallKisanCall = () => {
    Alert.alert(
      'KisanCall Voice Assistant',
      'Dialing KisanCall Toll-Free Voice Assistant line: +91 1800-123-456\n\nOur AI Assistant will answer questions in your language.',
      [{ text: 'OK' }]
    );
  };

  const navItems = [
    { key: 'home', icon: 'home', label: 'Home', path: '/' },
    { key: 'status', icon: 'hourglass_empty', label: 'Status', path: '/queue-status' },
    { key: 'price', icon: 'currency_rupee', label: 'Price', path: '/price' },
    { key: 'history', icon: 'history', label: 'History', path: '/call-history' },
    { key: 'profile', icon: 'person', label: 'Profile', path: '/profile' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🌾</Text>
          </View>
          <Text style={styles.logoText}>KisanCall</Text>
        </View>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Namaste, Ram Singh</Text>
          <Text style={styles.welcomeSubtitle}>नमस्ते, राम सिंह</Text>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardTopLeft}>
              <Text style={styles.cardSuperLabel}>Current Status / वर्तमान स्थिति</Text>
              <Text style={styles.statusHeading}>IN QUEUE</Text>
              <Text style={styles.statusHeadingHi}>कतार में</Text>
            </View>
            <View style={styles.statusIconCircle}>
              <Text style={styles.statusIconText}>⏳</Text>
            </View>
          </View>

          {/* Queue Position & Wait Time */}
          <View style={styles.queueRow}>
            <View style={[styles.queueCell, styles.queueCellBorder]}>
              <Text style={styles.queueCellLabel}>Position / कतार संख्या</Text>
              <Text style={styles.queueCellValue}>#{queuePosition}</Text>
            </View>
            <View style={styles.queueCell}>
              <Text style={styles.queueCellLabel}>Wait Time / प्रतीक्षा समय</Text>
              <Text style={styles.queueCellValue}>
                ~{etaMinutes} <Text style={styles.queueCellUnit}>min</Text>
              </Text>
            </View>
          </View>

          {/* Crop Row */}
          <View style={styles.cropRow}>
            <Text style={styles.cropIcon}>🌿</Text>
            <Text style={styles.cropText}>Wheat (गेहूं) - 50 Quintals</Text>
          </View>
        </View>

        {/* Market Price Card */}
        <View style={[styles.card, styles.cardSpacingTop]}>
          <View style={styles.priceCardHeader}>
            <Text style={styles.priceIcon}>₹</Text>
            <Text style={styles.priceCardTitle}>Market Price / बाज़ार भाव</Text>
          </View>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceCropName}>Wheat (गेहूं)</Text>
              <Text style={styles.priceMspLabel}>MSP (न्यूनतम समर्थन मूल्य)</Text>
            </View>
            <View style={styles.priceValueContainer}>
              <Text style={styles.priceValue}>₹2,275</Text>
              <Text style={styles.priceUnit}>per Quintal / प्रति क्विंटल</Text>
            </View>
          </View>
        </View>

        {/* Bottom padding for FAB + nav */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* FAB - Call KisanCall */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleCallKisanCall} activeOpacity={0.85}>
          <Text style={styles.fabIcon}>🎤</Text>
          <View>
            <Text style={styles.fabText}>Call KisanCall</Text>
            <Text style={styles.fabText}>किसान कॉल करें</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const isActive = activeNav === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => {
                setActiveNav(item.key);
                if (item.path !== '/') router.push(item.path as any);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.navIcon, isActive && styles.navIconActive]}>
                {item.key === 'home' ? '🏠' :
                 item.key === 'status' ? '⏱' :
                 item.key === 'price' ? '₹' :
                 item.key === 'history' ? '📋' : '👤'}
              </Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Header
  header: {
    height: 64,
    paddingHorizontal: spacing.containerMargin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { fontSize: 20, color: '#fff' },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 16 },

  // Scroll
  scrollView: { flex: 1, backgroundColor: colors.surface },
  scrollContent: {
    paddingHorizontal: spacing.containerMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Welcome
  welcomeSection: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 36,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },

  // Cards
  card: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  cardSpacingTop: {
    marginTop: spacing.sm,
  },

  // Status Card
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTopLeft: { gap: spacing.xs },
  cardSuperLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statusHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 28,
  },
  statusHeadingHi: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 28,
  },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconText: { fontSize: 22 },

  // Queue Row
  queueRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
  },
  queueCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  queueCellBorder: {
    borderRightWidth: 1,
    borderRightColor: colors.outlineVariant + '50',
  },
  queueCellLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  queueCellValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 36,
  },
  queueCellUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
  },

  // Crop Row
  cropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  cropIcon: { fontSize: 20, color: colors.secondary },
  cropText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 20,
  },

  // Price Card
  priceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '50',
  },
  priceIcon: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '600',
  },
  priceCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  priceCropName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    lineHeight: 20,
  },
  priceMspLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.onSurfaceVariant,
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  priceValueContainer: { alignItems: 'flex-end', gap: spacing.xs },
  priceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 36,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    textAlign: 'right',
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 96,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.containerMargin,
    zIndex: 40,
  },
  fab: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  fabIcon: { fontSize: 32 },
  fabText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onPrimary,
    lineHeight: 28,
  },

  // Bottom Nav
  bottomNav: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface + 'F5',
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant + '30',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    height: spacing.touchTarget,
    gap: 2,
  },
  navIcon: {
    fontSize: 22,
    color: colors.onSurfaceVariant,
  },
  navIconActive: {
    color: colors.primary,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  navLabelActive: {
    fontWeight: '600',
    color: colors.primary,
  },
});
