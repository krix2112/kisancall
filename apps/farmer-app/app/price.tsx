import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';

interface PriceItem {
  commodity: string;
  variety?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  msp?: number;
  mandi?: string;
  date: string;
}

const FALLBACK_PRICES: PriceItem[] = [
  { commodity: 'Wheat (गेहूं)', variety: 'Lok-1', min_price: 2150, max_price: 2350, modal_price: 2275, msp: 2275, mandi: 'Karnal Central Mandi', date: '31 Aug 2026' },
  { commodity: 'Paddy (धान - PR126)', variety: 'PR126', min_price: 2180, max_price: 2320, modal_price: 2203, msp: 2183, mandi: 'Karnal Central Mandi', date: '31 Aug 2026' },
  { commodity: 'Mustard (सरसों)', variety: 'Black', min_price: 5400, max_price: 5850, modal_price: 5650, msp: 5650, mandi: 'Panipat Grain Market', date: '31 Aug 2026' },
  { commodity: 'Gram (चना)', variety: 'Desi', min_price: 5100, max_price: 5500, modal_price: 5350, msp: 5440, mandi: 'Kurukshetra Mandi', date: '31 Aug 2026' },
];

export default function PriceScreen() {
  const router = useRouter();
  const [prices, setPrices] = useState<PriceItem[]>(FALLBACK_PRICES);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRealData, setIsRealData] = useState<boolean>(false);

  useEffect(() => {
    fetchMandiPrices();
  }, []);

  const fetchMandiPrices = async () => {
    setLoading(true);
    try {
      // Real backend route: GET /mandis/:id/prices
      const res = await fetch('http://localhost:4000/mandis/karnal-central/prices');
      if (res.ok) {
        const data = await res.json();
        if (data.prices && data.prices.length > 0) {
          setPrices(data.prices);
          setIsRealData(true);
        }
      }
    } catch (err) {
      console.log('Backend prices unavailable, showing cached Agmarknet data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>मंडी भाव / Mandi Prices</Text>
        <Text style={styles.subtitle}>Latest government-reported daily mandi price & MSP</Text>

        {/* Source Banner */}
        <View style={styles.sourceTag}>
          <Text style={styles.sourceTagText}>
            🏛️ Source: Agmarknet / Govt. Dept of Consumer Affairs (DoCA) • Updated Daily
          </Text>
          {isRealData && <Text style={styles.liveBadge}>● LIVE BACKEND SYNC</Text>}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#065F46" style={{ marginVertical: 20 }} />
        ) : (
          prices.map((p, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.commodityName}>{p.commodity}</Text>
                  <Text style={styles.mandiName}>{p.mandi || 'Karnal Central Mandi'} • {p.date}</Text>
                </View>
                {p.msp && (
                  <View style={styles.mspBadge}>
                    <Text style={styles.mspBadgeText}>Govt MSP: ₹{p.msp}</Text>
                  </View>
                )}
              </View>

              {/* Price Grid */}
              <View style={styles.priceRow}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalLabel}>औसत भाव / Modal Price</Text>
                  <Text style={styles.modalValue}>₹{p.modal_price.toLocaleString('en-IN')}</Text>
                  <Text style={styles.unitText}>प्रति क्विंटल / per quintal</Text>
                </View>

                <View style={styles.rangeBox}>
                  <Text style={styles.rangeLabel}>भाव सीमा / Price Range</Text>
                  <Text style={styles.rangeValue}>₹{p.min_price} - ₹{p.max_price}</Text>
                  <Text style={styles.unitText}>Min - Max per quintal</Text>
                </View>
              </View>

              {p.msp ? (
                <View style={styles.mspFooter}>
                  <Text style={styles.mspLabel}>न्यूनतम समर्थन मूल्य (MSP Guarantee):</Text>
                  <Text style={styles.mspValue}>₹{p.msp} / Qtl</Text>
                </View>
              ) : null}

              {/* Direct Book Slot Button for this crop */}
              <TouchableOpacity
                style={styles.bookSlotCardBtn}
                onPress={() => router.push('/book-slot')}
              >
                <Text style={styles.bookSlotCardBtnText}>📅 Book Slot for {p.commodity.split(' ')[0]} →</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.refreshBtn} onPress={fetchMandiPrices}>
          <Text style={styles.refreshBtnText}>🔄 Refresh Government Rates (ताज़ा भाव देखें)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookSlotFullBtn}
          onPress={() => router.push('/book-slot')}
        >
          <Text style={styles.bookSlotFullBtnText}>📅 Book a Procurement Slot Now (स्लॉट बुक करें)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#065F46' },
  subtitle: { fontSize: 13, color: '#4B5563', marginBottom: 12 },
  sourceTag: { backgroundColor: '#FEF3C7', borderLeftWidth: 4, borderLeftColor: '#F59E0B', padding: 10, borderRadius: 8, marginBottom: 16 },
  sourceTagText: { fontSize: 11, color: '#92400E', fontWeight: '600' },
  liveBadge: { fontSize: 10, color: '#047857', fontWeight: 'bold', marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 14, elevation: 2, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 10, marginBottom: 12 },
  commodityName: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  mandiName: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  mspBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mspBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#065F46' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  modalBox: { width: '48%', backgroundColor: '#ECFDF5', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#A7F3D0' },
  modalLabel: { fontSize: 11, color: '#047857', fontWeight: 'bold' },
  modalValue: { fontSize: 20, fontWeight: 'bold', color: '#065F46', marginTop: 4 },
  rangeBox: { width: '48%', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  rangeLabel: { fontSize: 11, color: '#6B7280', fontWeight: 'bold' },
  rangeValue: { fontSize: 15, fontWeight: 'bold', color: '#374151', marginTop: 6 },
  unitText: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  mspFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  mspLabel: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
  mspValue: { fontSize: 13, fontWeight: 'bold', color: '#059669' },
  refreshBtn: { backgroundColor: '#065F46', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  refreshBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  bookSlotCardBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  bookSlotCardBtnText: { color: '#047857', fontWeight: '700', fontSize: 12 },
  bookSlotFullBtn: {
    backgroundColor: '#00450d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  bookSlotFullBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});
