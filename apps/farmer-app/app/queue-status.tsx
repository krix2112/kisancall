import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { REALTIME_CHANNELS, subscribeToChannel } from '@kisancall/shared-types';
import { supabase } from '../src/supabase';
import { STAGES } from '../src/lib/mockData';
import { farmerApi } from '../src/services/api';

export default function QueueStatusScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [position, setPosition] = useState<number | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [token, setToken] = useState<string>('Loading...');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const farmerId = user?.id || '00000000-0000-0000-0000-000000000001';
      
      const data = await farmerApi.getQueuePosition(farmerId);
      setPosition(data.position);
      setEtaMinutes(data.estimated_wait_minutes);
      setToken(data.token);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load queue status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();

    // In a real app we would subscribe to the queue channel for the specific mandi_id
    // Since we don't have mandi_id readily available in this component without drilling,
    // we use a simple poll for now or rely on the `status:${farmerId}` channel.
    const farmerId = user?.id || '00000000-0000-0000-0000-000000000001';
    const channelName = REALTIME_CHANNELS.farmerStatus(farmerId);
    const unsubscribe = subscribeToChannel(
      supabase,
      channelName,
      { table: 'bookings', filter: `farmer_id=eq.${farmerId}` },
      (payload) => {
        console.log('[Realtime Farmer Status Update]', payload);
        fetchQueueData();
      }
    );

    return () => unsubscribe();
  }, []);

  const handleManualRefresh = () => {
    fetchQueueData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Live Mandi Queue & Stage Tracker</Text>
        <Text style={styles.subtitle}>Real-time updates synced with mandi gate scanner</Text>

        {/* Queue Highlight Card */}
        <View style={styles.highlightCard}>
          <View style={styles.highlightRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Your Token</Text>
              <Text style={styles.metricToken}>{token}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Current Position</Text>
              <Text style={styles.metricPos}>{position !== null ? `#${position}` : '-'}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Est. Wait</Text>
              <Text style={styles.metricEta}>{etaMinutes !== null ? `${etaMinutes} mins` : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.refreshBar}>
            <Text style={styles.refreshText}>{loading ? 'Refreshing...' : `Synced: ${lastRefreshed}`}</Text>
            <TouchableOpacity onPress={handleManualRefresh} style={styles.refreshButton} disabled={loading}>
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        {errorMsg && (
          <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: '#991B1B', fontSize: 13, fontWeight: '600' }}>Error: {errorMsg}</Text>
          </View>
        )}

        {/* Stage Tracker Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Procurement Stage Progress</Text>

          {STAGES.map((stage, idx) => (
            <View key={stage.id} style={styles.timelineRow}>
              {/* Node indicator */}
              <View style={styles.nodeColumn}>
                <View
                  style={[
                    styles.nodeDot,
                    stage.done && styles.nodeDone,
                    stage.active && styles.nodeActive,
                  ]}
                >
                  <Text style={styles.nodeDotText}>
                    {stage.done ? '✓' : stage.active ? '●' : idx + 1}
                  </Text>
                </View>
                {idx < STAGES.length - 1 && (
                  <View style={[styles.timelineLine, stage.done && styles.lineDone]} />
                )}
              </View>

              {/* Stage content */}
              <View style={styles.stageContent}>
                <Text
                  style={[
                    styles.stageTitle,
                    stage.active && styles.stageTitleActive,
                  ]}
                >
                  {stage.title}
                </Text>
                <Text style={styles.stageDesc}>{stage.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Book Another Slot CTA Button */}
        <TouchableOpacity
          style={styles.bookSlotButton}
          onPress={() => router.push('/book-slot')}
        >
          <Text style={styles.bookSlotButtonText}>📅 Book Another Mandi Slot (नया स्लॉट)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#065F46' },
  subtitle: { fontSize: 13, color: '#4B5563', marginBottom: 16 },
  highlightCard: {
    backgroundColor: '#7F1D1D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  highlightRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metricBox: { alignItems: 'center', width: '31%' },
  metricLabel: { fontSize: 11, color: '#FCA5A5' },
  metricToken: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  metricPos: { fontSize: 22, fontWeight: 'bold', color: '#FEF08A', marginTop: 2 },
  metricEta: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  refreshBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#991B1B',
    pt: 8,
    marginTop: 4,
  },
  refreshText: { fontSize: 11, color: '#FCA5A5' },
  refreshButton: { backgroundColor: '#991B1B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  refreshButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  timelineRow: { flexDirection: 'row', marginBottom: 16 },
  nodeColumn: { alignItems: 'center', marginRight: 12 },
  nodeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeDone: { backgroundColor: '#10B981' },
  nodeActive: { backgroundColor: '#EF4444' },
  nodeDotText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  timelineLine: { width: 2, height: 32, backgroundColor: '#E5E7EB', marginTop: 4 },
  lineDone: { backgroundColor: '#10B981' },
  stageContent: { flex: 1, justifyContent: 'center' },
  stageTitle: { fontSize: 15, fontWeight: '600', color: '#374151' },
  stageTitleActive: { color: '#DC2626', fontWeight: 'bold' },
  stageDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  bookSlotButton: {
    backgroundColor: '#00450d',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  bookSlotButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
