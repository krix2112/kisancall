import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const PAYMENT_DETAILS = {
  status: 'completed', // 'pending' | 'processing' | 'completed'
  amount: 45500,
  reference: 'PAY-884920-IND',
  procurementId: 'PROC-8821',
  mandi: 'Karnal Central Mandi',
  quantity: '20.00 Quintals (क्विंटल)',
  rate: '₹2,275 / Qtl',
  expectedTimeline: 'Direct Benefit Transfer credited within 24-48 hours',
  updatedAt: '31 Aug 2026, 02:30 PM',
};

const TIMELINE = [
  { title: 'उपज तुलाई पूर्ण / Procurement Verified', time: '31 Aug, 10:15 AM', done: true },
  { title: 'PFMS भुगतान बैच शुरू / Payment Batch Initiated', time: '31 Aug, 11:45 AM', done: true },
  { title: 'बैंक खाते में भुगतान जमा / DBT Bank Account Credited', time: '31 Aug, 02:30 PM', done: true },
];

export default function PaymentScreen() {
  const router = useRouter();

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#D1FAE5', text: '#065F46', label: '✓ भुगतान सफल / PAID' };
      case 'processing': return { bg: '#F3E8FF', text: '#6B21A8', label: '⏳ प्रक्रिया में / PROCESSING' };
      default: return { bg: '#FEF3C7', text: '#92400E', label: '⏳ लंबित / PENDING' };
    }
  };

  const badge = getBadgeStyle(PAYMENT_DETAILS.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>भुगतान स्थिति / Payment Status</Text>
        <Text style={styles.subtitle}>Direct Benefit Transfer (DBT) payment status & receipt</Text>

        {/* Hero Amount Card */}
        <View style={styles.heroCard}>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
          <Text style={styles.amountLabel}>कुल भुगतान राशि / Total Disbursed Amount</Text>
          <Text style={styles.amountValue}>₹{PAYMENT_DETAILS.amount.toLocaleString('en-IN')}</Text>
          <Text style={styles.refText}>Bank Ref: {PAYMENT_DETAILS.reference}</Text>
        </View>

        {/* Expected Timeline Explainer */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>💡 भुगतान समय सीमा / Expected Timeline:</Text>
          <Text style={styles.infoBannerText}>{PAYMENT_DETAILS.expectedTimeline}</Text>
        </View>

        {/* Procurement Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>उपज एवं तौल विवरण / Procurement Record</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Procurement ID:</Text>
            <Text style={styles.rowValue}>{PAYMENT_DETAILS.procurementId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>मंडी केंद्र / Centre:</Text>
            <Text style={styles.rowValue}>{PAYMENT_DETAILS.mandi}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>कुल मात्रा / Quantity:</Text>
            <Text style={styles.rowValue}>{PAYMENT_DETAILS.quantity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>सरकारी भाव / Rate:</Text>
            <Text style={styles.rowValue}>{PAYMENT_DETAILS.rate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>अंतिम अपडेट / Last Update:</Text>
            <Text style={styles.rowValue}>{PAYMENT_DETAILS.updatedAt}</Text>
          </View>
        </View>

        {/* Payment Progress Steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>भुगतान प्रगति चरण / PFMS Payment Steps</Text>
          {TIMELINE.map((item, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={[styles.dot, { backgroundColor: item.done ? '#10B981' : '#D1D5DB' }]} />
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Book Next Mandi Slot CTA */}
        <TouchableOpacity
          style={styles.bookSlotBtn}
          onPress={() => router.push('/book-slot')}
        >
          <Text style={styles.bookSlotBtnText}>📅 Book Next Procurement Slot (नया स्लॉट बुक करें)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#065F46' },
  subtitle: { fontSize: 13, color: '#4B5563', marginBottom: 16 },
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginBottom: 10 },
  badgeText: { fontWeight: 'bold', fontSize: 12 },
  amountLabel: { fontSize: 12, color: '#A7F3D0' },
  amountValue: { fontSize: 34, fontWeight: 'bold', color: '#FFFFFF', marginVertical: 4 },
  refText: { fontSize: 12, color: '#A7F3D0', fontMono: true },
  infoBanner: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 12, borderRadius: 10, marginBottom: 14 },
  infoBannerTitle: { fontSize: 12, fontWeight: 'bold', color: '#1E40AF' },
  infoBannerText: { fontSize: 12, color: '#1E3A8A', marginTop: 2 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowLabel: { fontSize: 13, color: '#6B7280' },
  rowValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  itemTime: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  bookSlotBtn: {
    backgroundColor: '#00450d',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  bookSlotBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
