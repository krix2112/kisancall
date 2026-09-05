import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { REALTIME_CHANNELS, subscribeToChannel, FarmerStatusResponse } from '@kisancall/shared-types';
import { farmerApi } from '../src/services/api';
import { supabase } from '../src/supabase';

const colors = {
  primary: '#00450d',
  onPrimary: '#ffffff',
  primaryContainer: '#1b5e20',
  onPrimaryContainer: '#90d689',
  secondary: '#006e1c',
  onSecondary: '#ffffff',
  secondaryContainer: '#91f78e',
  onSecondaryContainer: '#00731e',
  tertiaryContainer: '#883454',
  onTertiaryContainer: '#ffaec6',
  tertiary: '#6b1d3d',
  surface: '#f7fbf1',
  surfaceContainer: '#ecefe6',
  surfaceContainerLow: '#f2f5ec',
  surfaceContainerHighest: '#e0e4db',
  surfaceVariant: '#e0e4db',
  onSurface: '#191d17',
  onSurfaceVariant: '#41493e',
  outlineVariant: '#c0c9bb',
  inverseSurface: '#2d322c',
  inverseOnSurface: '#eff2e9',
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState<string>('home');
  const [statusData, setStatusData] = useState<FarmerStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.id) return;
      try {
        const data = await farmerApi.getStatus(user.id);
        setStatusData(data);
      } catch (err) {
        console.error('Failed to fetch status', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [user]);

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
      'Dialing KisanCall Toll-Free Voice Assistant line: +91 1800-123-456\n\nAsk about slot, queue, price in your language.',
      [{ text: 'OK' }]
    );
  };

  const navItems = [
    { key: 'home', icon: '🏠', label: 'Home', path: '/' },
    { key: 'book-slot', icon: '📅', label: 'Book Slot', path: '/book-slot' },
    { key: 'my-slips', icon: '📋', label: 'Slips', path: '/proof' },
    { key: 'speak-call', icon: '🎙', label: 'Speak', path: '/call-history' },
    { key: 'profile', icon: '👤', label: 'Profile', path: '/profile' },
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
          <Text style={styles.brandTitle}>KisanCall</Text>
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
        {/* Greeting Section */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingSub}>शुभ प्रभात / Good Morning</Text>
            <Text style={styles.greetingTitle}>नमस्ते, {statusData?.farmer?.name || 'Kisan'}</Text>
          </View>
          <View style={styles.userBadgeCircle}>
            <Text style={styles.userBadgeIcon}>👤</Text>
          </View>
        </View>

        {/* Section 1: Today's Procurement Hero Card */}
        <View style={styles.procurementCard}>
          <View style={styles.procurementTop}>
            <View>
              <Text style={styles.procurementTitle}>आज की खरीद</Text>
              <Text style={styles.procurementSub}>Today's Procurement</Text>
            </View>
            <View style={styles.queuePill}>
              <Text style={styles.scheduleIcon}>⏱</Text>
              <Text style={styles.queuePillText}>कतार में / IN QUEUE</Text>
            </View>
          </View>

          {/* Details Column with accent border */}
          <View style={styles.detailsBox}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailTextBold}>10:00 – 11:00 AM (Today)</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>Sehore Center</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🌾</Text>
              <Text style={styles.detailText}>Wheat / गेहूँ</Text>
            </View>
          </View>

          {/* Vertical Stage Progress Tracker */}
          <View style={styles.progressSection}>
            <Text style={styles.progressHeader}>प्रक्रिया / Progress</Text>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineLine} />

              {/* Stage 1 */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineCheckCircle}>
                  <Text style={styles.timelineCheckText}>✓</Text>
                </View>
                <Text style={styles.timelineLabelDone}>Booked</Text>
              </View>

              {/* Stage 2 */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineCheckCircle}>
                  <Text style={styles.timelineCheckText}>✓</Text>
                </View>
                <Text style={styles.timelineLabelDone}>Arrived</Text>
              </View>

              {/* Stage 3 (Active) */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineActiveCircle}>
                  <View style={styles.activeDot} />
                </View>
                <Text style={styles.timelineLabelActive}>In Queue</Text>
              </View>

              {/* Stage 4 */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineEmptyCircle} />
                <Text style={styles.timelineLabelPending}>Procured</Text>
              </View>

              {/* Stage 5 */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineEmptyCircle} />
                <Text style={styles.timelineLabelPending}>Payment</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: Your Turn Card (Tertiary Container) */}
        <View style={styles.yourTurnCard}>
          <View style={styles.yourTurnLeft}>
            <Text style={styles.yourTurnHeading}>आपकी बारी / Your Turn</Text>
            <Text style={styles.yourTurnSub}>13 farmers are ahead of you</Text>
            <Text style={styles.yourTurnWait}>Estimated Wait: ~45 min</Text>
          </View>
          <View style={styles.yourTurnNumberBox}>
            <Text style={styles.yourTurnHash}>#</Text>
            <Text style={styles.yourTurnNumber}>14</Text>
          </View>
        </View>

        {/* Grid 2-cols: Mandi Price & Payment Status */}
        <View style={styles.gridRow}>
          {/* Mandi Price */}
          <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/price')}>
            <View>
              <Text style={styles.cardHeaderTitle}>📈 आज का मंडी भाव</Text>
              <Text style={styles.cardHeaderSub}>Today's Mandi Price</Text>
            </View>
            <View style={styles.priceContent}>
              <Text style={styles.priceBigText}>Check</Text>
              <Text style={styles.priceCropText}>Live Mandi Rates</Text>
            </View>
          </TouchableOpacity>

          {/* Payment Status */}
          <View style={styles.gridCard}>
            <View>
              <Text style={styles.cardHeaderTitle}>👛 भुगतान की स्थिति</Text>
              <Text style={styles.cardHeaderSub}>Payment Status</Text>
            </View>
            <View style={styles.paymentContent}>
              <View style={styles.paymentStatusBadge}>
                <Text style={styles.syncIcon}>🔄</Text>
                <Text style={styles.paymentStatusText}>
                  {statusData?.bookings?.[0]?.payment?.status || 'No Payment'}
                </Text>
              </View>
              <Text style={styles.paymentRefText}>
                {statusData?.bookings?.[0]?.payment?.reference || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4.5: Book New Slot Card */}
        <TouchableOpacity
          style={styles.bookSlotCard}
          onPress={() => router.push('/book-slot')}
          activeOpacity={0.9}
        >
          <View style={styles.bookSlotIconCircle}>
            <Text style={{ fontSize: 24 }}>📅</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookSlotTitle}>नया स्लॉट बुक करें</Text>
            <Text style={styles.bookSlotSub}>Book a new Mandi procurement slot</Text>
          </View>
          <Text style={styles.bookSlotArrow}>→</Text>
        </TouchableOpacity>

        {/* Section 5: Dark Call Button */}
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCallKisanCall}
          activeOpacity={0.9}
        >
          <Text style={styles.callButtonIcon}>📞</Text>
          <View style={styles.callButtonTexts}>
            <Text style={styles.callButtonTitle}>KisanCall को कॉल करें</Text>
            <Text style={styles.callButtonSub}>Ask about slot, queue, price...</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

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
                {item.icon}
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
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { fontSize: 20 },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
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
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 90,
    gap: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  greetingSub: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    marginTop: 2,
  },
  userBadgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBadgeIcon: { fontSize: 22 },
  procurementCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    gap: 16,
  },
  procurementTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  procurementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  procurementSub: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  queuePill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleIcon: { fontSize: 14, color: '#ffffff' },
  queuePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  detailsBox: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: { fontSize: 16 },
  detailTextBold: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  detailText: {
    fontSize: 16,
    color: colors.onSurface,
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    marginBottom: 12,
  },
  timelineContainer: {
    position: 'relative',
    gap: 16,
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 12,
    bottom: 12,
    width: 2,
    backgroundColor: colors.surfaceVariant,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 24,
  },
  timelineCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineCheckText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  timelineActiveCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondaryContainer,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  timelineEmptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
    zIndex: 1,
  },
  timelineLabelDone: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurface,
  },
  timelineLabelActive: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
  },
  timelineLabelPending: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  yourTurnCard: {
    backgroundColor: colors.tertiaryContainer,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yourTurnLeft: {
    gap: 2,
  },
  yourTurnHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  yourTurnSub: {
    fontSize: 16,
    color: '#ffaec6',
  },
  yourTurnWait: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  yourTurnNumberBox: {
    width: 72,
    height: 72,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yourTurnHash: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.tertiary,
  },
  yourTurnNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.tertiary,
    marginTop: -6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    justifyContent: 'space-between',
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  cardHeaderSub: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  priceContent: {
    marginTop: 12,
  },
  priceBigText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
  },
  priceCropText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  priceFootnote: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    opacity: 0.7,
    marginTop: 6,
  },
  paymentContent: {
    marginTop: 12,
  },
  paymentStatusBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  syncIcon: { fontSize: 12 },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  paymentRefText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  callButton: {
    height: 56,
    backgroundColor: colors.inverseSurface,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  callButtonIcon: {
    fontSize: 22,
    color: colors.inverseOnSurface,
  },
  callButtonTexts: {
    alignItems: 'flex-start',
  },
  callButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.inverseOnSurface,
  },
  callButtonSub: {
    fontSize: 12,
    color: colors.inverseOnSurface,
    opacity: 0.8,
  },
  bookSlotCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  bookSlotIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookSlotTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  bookSlotSub: {
    fontSize: 12,
    color: colors.onPrimaryContainer,
    marginTop: 2,
  },
  bookSlotArrow: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
  },
  bottomNav: {
    height: 72,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
