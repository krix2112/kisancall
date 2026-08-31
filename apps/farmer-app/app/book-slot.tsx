import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const CROPS = ['Wheat (गेहूं)', 'Paddy (धान)', 'Mustard (सरसों)', 'Gram (चना)'];
const MANDIS = [
  'Karnal Central Mandi',
  'Panipat Grain Market',
  'Kurukshetra Mandi',
  'Ambala Cantt Mandi',
];

const AVAILABLE_SLOTS = [
  { id: 'S1', date: '01 Sep 2026', time: '09:00 AM - 12:00 PM', capacityLeft: 45 },
  { id: 'S2', date: '01 Sep 2026', time: '12:00 PM - 03:00 PM', capacityLeft: 18 },
  { id: 'S3', date: '02 Sep 2026', time: '09:00 AM - 12:00 PM', capacityLeft: 80 },
  { id: 'S4', date: '02 Sep 2026', time: '12:00 PM - 03:00 PM', capacityLeft: 60 },
];

export default function BookSlotScreen() {
  const router = useRouter();

  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);
  const [selectedMandi, setSelectedMandi] = useState(MANDIS[0]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('S1');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmBooking = () => {
    // TODO: Wire to POST /bookings endpoint when backend is ready
    setIsConfirmed(true);
    Alert.alert(
      'Slot Confirmed!',
      `Token #KC-8849 confirmed for ${selectedCrop} at ${selectedMandi} on ${AVAILABLE_SLOTS.find(s=>s.id===selectedSlotId)?.date}.`
    );
  };

  const handleRepeatByCall = () => {
    Alert.alert(
      'Voice Call Triggered',
      'Our AI Voice Assistant will call your mobile number to repeat & verify this slot booking verbally.'
    );
  };

  const selectedSlot = AVAILABLE_SLOTS.find((s) => s.id === selectedSlotId);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Register & Book Mandi Slot</Text>
        <Text style={styles.subtitle}>Select crop, procurement centre, and preferred time block</Text>

        {/* Crop Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Commodity / Crop</Text>
          <View style={styles.chipGrid}>
            {CROPS.map((crop) => (
              <TouchableOpacity
                key={crop}
                style={[styles.chip, selectedCrop === crop && styles.chipActive]}
                onPress={() => setSelectedCrop(crop)}
              >
                <Text style={[styles.chipText, selectedCrop === crop && styles.chipTextActive]}>
                  {crop}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mandi Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Procurement Centre (Mandi)</Text>
          {MANDIS.map((mandi) => (
            <TouchableOpacity
              key={mandi}
              style={[styles.radioCard, selectedMandi === mandi && styles.radioCardActive]}
              onPress={() => setSelectedMandi(mandi)}
            >
              <Text style={styles.radioText}>{mandi}</Text>
              {selectedMandi === mandi && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Available Slots */}
        <View style={styles.section}>
          <Text style={styles.label}>Available Time Slots</Text>
          {AVAILABLE_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slotCard, selectedSlotId === slot.id && styles.slotCardActive]}
              onPress={() => setSelectedSlotId(slot.id)}
            >
              <View>
                <Text style={styles.slotDate}>{slot.date}</Text>
                <Text style={styles.slotTime}>{slot.time}</Text>
              </View>
              <View style={styles.capacityBadge}>
                <Text style={styles.capacityText}>{slot.capacityLeft} spots left</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Card */}
        {selectedSlot && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <Text style={styles.summaryDetail}>Crop: <Text style={styles.bold}>{selectedCrop}</Text></Text>
            <Text style={styles.summaryDetail}>Mandi: <Text style={styles.bold}>{selectedMandi}</Text></Text>
            <Text style={styles.summaryDetail}>Time: <Text style={styles.bold}>{selectedSlot.date} ({selectedSlot.time})</Text></Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
              <Text style={styles.confirmButtonText}>Confirm & Generate Token</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.repeatCallButton} onPress={handleRepeatByCall}>
              <Text style={styles.repeatCallText}>📞 Repeat & Verify by Voice Call</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#065F46' },
  subtitle: { fontSize: 13, color: '#4B5563', marginBottom: 16 },
  section: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  chipActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  chipText: { fontSize: 13, color: '#374151' },
  chipTextActive: { color: '#047857', fontWeight: 'bold' },
  radioCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  radioCardActive: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  radioText: { fontSize: 14, color: '#1F2937' },
  checkIcon: { color: '#059669', fontWeight: 'bold' },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  slotCardActive: { borderColor: '#059669', backgroundColor: '#ECFDF5' },
  slotDate: { fontSize: 12, color: '#6B7280' },
  slotTime: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  capacityBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  capacityText: { fontSize: 11, color: '#1E40AF', fontWeight: '600' },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginTop: 10, elevation: 2 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  summaryDetail: { fontSize: 13, color: '#4B5563', marginBottom: 4 },
  bold: { fontWeight: 'bold', color: '#111827' },
  confirmButton: { backgroundColor: '#059669', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  confirmButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  repeatCallButton: { marginTop: 8, paddingVertical: 10, alignItems: 'center' },
  repeatCallText: { color: '#2563EB', fontWeight: '600', fontSize: 13 },
});
