import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { REALTIME_CHANNELS, subscribeToChannel } from '@kisancall/shared-types';
import { supabase } from '../src/supabase';

export type ProcurementStage = 'Booked' | 'Arrived' | 'In Queue' | 'Procured' | 'Payment Processing' | 'Paid';

export default function HomeScreen() {
  const router = useRouter();
  const { user, language, signOut } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<ProcurementStage>('In Queue');
  const [isTodaySlot, setIsTodaySlot] = useState<boolean>(true);
  const [queuePosition, setQueuePosition] = useState<number>(4);
  const [etaMinutes, setEtaMinutes] = useState<number>(25);

  useEffect(() => {
    // Realtime subscription helper stub
    const farmerId = user?.id || 'FARMER-9876';
    const channelName = REALTIME_CHANNELS.farmerStatus(farmerId);

    const unsubscribe = subscribeToChannel(
      supabase,
      channelName,
      { table: 'bookings', filter: `farmer_id=eq.${farmerId}` },
      (payload) => {
        if (payload.new?.status) {
          console.log('[Realtime Farmer Status Update]', payload.new);
          // TODO: Sync realtime status updates from backend
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

  const getBadgeStyle = (stage: ProcurementStage) => {
    switch (stage) {
      case 'Booked':
        return { bg: '#E0F2FE', text: '#0369A1' };
      case 'Arrived':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'In Queue':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'Procured':
        return { bg: '#E0E7FF', text: '#3730A3' };
      case 'Payment Processing':
        return { bg: '#F3E8FF', text: '#6B21A8' };
      case 'Paid':
        return { bg: '#D1FAE5', text: '#065F46' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const badgeStyle = getBadgeStyle(currentStage);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Header */}
        <View style={styles.headerCard}>
          <Text style={styles.welcomeTitle}>
            {language === 'hi' ? 'नमस्ते, रामेश कुमार' : 'Welcome, Ramesh Kumar'}
          </Text>
          <Text style={styles.phoneSub}>
            {user?.phone || '+91 98765 43210'} • Karnal Central Mandi
          </Text>
        </View>

        {/* Live Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {language === 'hi' ? 'आपकी खरीद स्थिति' : 'Procurement Status'}
            </Text>
            <View style={[styles.stageBadge, { backgroundColor: badgeStyle.bg }]}>
              <Text style={[styles.stageBadgeText, { color: badgeStyle.text }]}>
                {currentStage}
              </Text>
            </View>
          </View>

          {/* Slot Details */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Slot Allocated:</Text>
            <Text style={styles.detailValue}>01 Sep 2026 (09:00 AM - 12:00 PM)</Text>
          </View>

          {/* Queue Position & ETA (Only shown if today's slot) */}
          {isTodaySlot && (
            <View style={styles.queueContainer}>
              <View style={styles.queueBox}>
                <Text style={styles.queueLabel}>Queue Token</Text>
                <Text style={styles.queueValue}>#{queuePosition}</Text>
              </View>
              <View style={styles.queueBox}>
                <Text style={styles.queueLabel}>Est. Wait Time</Text>
                <Text style={styles.queueValue}>{etaMinutes} mins</Text>
              </View>
            </View>
          )}

          {/* Mandi Price */}
          <View style={styles.priceStrip}>
            <Text style={styles.priceStripLabel}>Wheat Govt Mandi Modal Price:</Text>
            <Text style={styles.priceStripValue}>₹2,275 / Qtl (31 Aug 2026)</Text>
          </View>

          {/* Call KisanCall Voice AI Button */}
          <TouchableOpacity style={styles.callAiButton} onPress={handleCallKisanCall}>
            <Text style={styles.callAiButtonText}>📞 Call KisanCall Voice Assistant</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Nav Options */}
        <Text style={styles.sectionHeader}>
          {language === 'hi' ? 'मुख्य सेवाएं' : 'Services & History'}
        </Text>

        <View style={styles.navGrid}>
          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/book-slot')}>
            <Text style={styles.navIcon}>📅</Text>
            <Text style={styles.navTitle}>Book Slot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/queue-status')}>
            <Text style={styles.navIcon}>⏱️</Text>
            <Text style={styles.navTitle}>Live Queue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/price')}>
            <Text style={styles.navIcon}>📊</Text>
            <Text style={styles.navTitle}>Mandi Prices</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/payment')}>
            <Text style={styles.navIcon}>💳</Text>
            <Text style={styles.navTitle}>Payments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/proof')}>
            <Text style={styles.navIcon}>⛓️</Text>
            <Text style={styles.navTitle}>Proof Hash</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/call-history')}>
            <Text style={styles.navIcon}>📞</Text>
            <Text style={styles.navTitle}>Call Logs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/profile')}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navTitle}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/onboarding')}>
            <Text style={styles.navIcon}>🌐</Text>
            <Text style={styles.navTitle}>Language</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  headerCard: {
    backgroundColor: '#065F46',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  phoneSub: { fontSize: 13, color: '#A7F3D0', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  stageBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  stageBadgeText: { fontSize: 12, fontWeight: 'bold' },
  detailRow: { marginBottom: 12 },
  detailLabel: { fontSize: 12, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginTop: 2 },
  queueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  queueBox: { width: '48%', alignItems: 'center' },
  queueLabel: { fontSize: 11, color: '#991B1B' },
  queueValue: { fontSize: 18, fontWeight: 'bold', color: '#7F1D1D', marginTop: 2 },
  priceStrip: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  priceStripLabel: { fontSize: 11, color: '#047857' },
  priceStripValue: { fontSize: 13, fontWeight: 'bold', color: '#065F46', marginTop: 2 },
  callAiButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  callAiButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  navCard: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navIcon: { fontSize: 20, marginBottom: 4 },
  navTitle: { fontSize: 10, fontWeight: '600', color: '#374151', textAlign: 'center' },
  signOutButton: { marginTop: 10, alignItems: 'center', padding: 12 },
  signOutText: { color: '#DC2626', fontWeight: '600' },
});
