import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { REALTIME_CHANNELS, subscribeToChannel } from '@kisancall/shared-types';
import { supabase } from '../src/supabase';

const STAGES = [
  { id: '1', title: 'Booked', desc: 'Slot confirmed for 01 Sep', done: true },
  { id: '2', title: 'Arrived', desc: 'Gate entry verified', done: true },
  { id: '3', title: 'In Queue', desc: 'Position #4 in weighbridge queue', active: true },
  { id: '4', title: 'Procured', desc: 'Quality grade & weight entry', done: false },
  { id: '5', title: 'Paid', desc: 'PFMS DBT payment credited', done: false },
];

export default function QueueStatusScreen() {
  const [position, setPosition] = useState<number>(4);
  const [etaMinutes, setEtaMinutes] = useState<number>(25);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    // Realtime queue subscription stub
    const channelName = REALTIME_CHANNELS.queue('mandi-karnal');
    const unsubscribe = subscribeToChannel(
      supabase,
      channelName,
      { table: 'queue_events' },
      (payload) => {
        console.log('[Queue Realtime Event]', payload);
        if (payload.new?.sequence) {
          setPosition((prev) => Math.max(1, prev - 1));
          setEtaMinutes((prev) => Math.max(5, prev - 5));
        }
      }
    );

    // Auto-refresh interval stub
    const interval = setInterval(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleManualRefresh = () => {
    // Simulate position update
    setLastRefreshed(new Date().toLocaleTimeString());
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
              <Text style={styles.metricToken}>#KC-8849</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Current Position</Text>
              <Text style={styles.metricPos}>#{position}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Est. Wait</Text>
              <Text style={styles.metricEta}>{etaMinutes} mins</Text>
            </View>
          </View>

          <View style={styles.refreshBar}>
            <Text style={styles.refreshText}>Synced: {lastRefreshed}</Text>
            <TouchableOpacity onPress={handleManualRefresh} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

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
});
