import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Modal } from 'react-native';

interface CallRecord {
  id: string;
  date: string;
  direction: 'Inbound Call (आवक कॉल)' | 'Outbound Call (जावक कॉल)';
  intent: string;
  outcome: string;
  duration: string;
  summary: string;
}

const PAST_CALLS: CallRecord[] = [
  {
    id: 'C1',
    date: '31 Aug 2026, 09:30 AM',
    direction: 'Inbound Call (आवक कॉल)',
    intent: 'Queue Status Inquiry (टोकन स्थिति पूछताछ)',
    outcome: 'Confirmed position #4 via Voice AI (स्थान #4 की पुष्टि)',
    duration: '1 min 14 sec',
    summary: 'Farmer asked for live queue status in Hindi. KisanCall Voice AI retrieved token position #4, estimated wait 25 minutes for Karnal Mandi.',
  },
  {
    id: 'C2',
    date: '30 Aug 2026, 04:15 PM',
    direction: 'Outbound Call (जावक कॉल)',
    intent: 'Slot Reminder (स्लॉट रिमाइंडर)',
    outcome: 'Slot confirmed for 01 Sep (01 सितंबर स्लॉट पक्का)',
    duration: '2 mins 05 sec',
    summary: 'Automated outbound voice call confirmed wheat procurement slot at Karnal Central Mandi for 01 Sep morning block.',
  },
  {
    id: 'C3',
    date: '28 Aug 2026, 11:00 AM',
    direction: 'Inbound Call (आवक कॉल)',
    intent: 'Mandi Price Inquiry (मंडी भाव जानकारी)',
    outcome: 'Provided wheat MSP ₹2,275 (गेहूं एमएसपी ₹2,275 बताया)',
    duration: '48 sec',
    summary: 'Farmer inquired about wheat daily price. KisanCall AI retrieved Agmarknet rates and read out ₹2,275/Qtl in Hindi.',
  },
];

export default function CallHistoryScreen() {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  const handleReplaySummary = (call: CallRecord) => {
    setSelectedCall(call);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>कॉल विवरण / Voice Call History</Text>
        <Text style={styles.subtitle}>History of AI voice assistant calls & automatic reminders</Text>

        {PAST_CALLS.map((call) => (
          <View key={call.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.directionText}>{call.direction}</Text>
                <Text style={styles.intentText}>{call.intent}</Text>
                <Text style={styles.dateText}>{call.date}</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{call.duration}</Text>
              </View>
            </View>

            <Text style={styles.outcomeText}>
              परिणाम / Outcome: <Text style={styles.bold}>{call.outcome}</Text>
            </Text>

            <TouchableOpacity style={styles.summaryButton} onPress={() => handleReplaySummary(call)}>
              <Text style={styles.summaryButtonText}>🔊 Replay Summary / कॉल सारांश सुनें</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Replay Summary Modal */}
      {selectedCall && (
        <Modal transparent animationType="fade" visible={!!selectedCall}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>🔊 Call AI Summary & Transcript</Text>
              <Text style={styles.modalSub}>{selectedCall.intent} • {selectedCall.date}</Text>

              <View style={styles.modalBodyBox}>
                <Text style={styles.modalBodyText}>{selectedCall.summary}</Text>
              </View>

              <View style={styles.audioBar}>
                <Text style={styles.audioText}>▶ Playing Simulated Voice Recording (Hindi)</Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCall(null)}>
                <Text style={styles.closeBtnText}>Close / बंद करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#065F46' },
  subtitle: { fontSize: 13, color: '#4B5563', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  directionText: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  intentText: { fontSize: 12, color: '#047857', fontWeight: '600', marginTop: 2 },
  dateText: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  durationBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  durationText: { fontSize: 11, color: '#065F46', fontWeight: 'bold' },
  outcomeText: { fontSize: 12, color: '#4B5563', marginBottom: 12 },
  bold: { fontWeight: 'bold', color: '#065F46' },
  summaryButton: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', padding: 12, borderRadius: 8, alignItems: 'center' },
  summaryButtonText: { color: '#047857', fontWeight: 'bold', fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  modalSub: { fontSize: 12, color: '#6B7280', marginTop: 2, marginBottom: 12 },
  modalBodyBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 },
  modalBodyText: { fontSize: 13, color: '#334155', lineHeight: 20 },
  audioBar: { backgroundColor: '#ECFDF5', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 14 },
  audioText: { fontSize: 12, color: '#047857', fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#065F46', padding: 12, borderRadius: 10, alignItems: 'center' },
  closeBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});
