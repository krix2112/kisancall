import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const PROOF_RECORD = {
  procurementId: 'PROC-8821',
  transactionId: 'TX-KSC-2026-0831-8849',
  payloadHash: '0x8f7c2a1b9e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
  chainTxHash: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
  timestamp: '31 Aug 2026, 10:15:32 AM',
  blockNumber: 4892014,
  network: 'Shardeum Liberty EVM Testnet',
};

export default function ProofScreen() {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>डिजिटल प्रमाण / AgroChain Proof</Text>
        <Text style={styles.subtitle}>Verifiable tamper-proof transaction record on blockchain</Text>

        {/* Proof Hash Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>ब्लॉकचेन रिकॉर्ड / Verified Record</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓ VERIFIED ON-CHAIN</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.valMono}>{PROOF_RECORD.transactionId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Procurement ID:</Text>
            <Text style={styles.val}>{PROOF_RECORD.procurementId}</Text>
          </View>

          <View style={styles.hashBox}>
            <Text style={styles.hashLabel}>Procurement Payload Hash (SHA-256):</Text>
            <Text style={styles.hashValue}>{PROOF_RECORD.payloadHash}</Text>
          </View>

          <View style={styles.hashBox}>
            <Text style={styles.hashLabel}>Shardeum Chain Transaction Hash (TxHash):</Text>
            <Text style={styles.hashValue}>{PROOF_RECORD.chainTxHash}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Timestamp:</Text>
            <Text style={styles.val}>{PROOF_RECORD.timestamp}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Block Number:</Text>
            <Text style={styles.val}>#{PROOF_RECORD.blockNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Network:</Text>
            <Text style={styles.val}>{PROOF_RECORD.network}</Text>
          </View>
        </View>

        {/* Explainer Toggle */}
        <TouchableOpacity style={styles.explainerButton} onPress={() => setShowExplainer(!showExplainer)}>
          <Text style={styles.explainerButtonText}>
            💡 {showExplainer ? 'विवरण छुपाएं / Hide Explainer' : 'इसका क्या मतलब है? / What does this mean?'}
          </Text>
        </TouchableOpacity>

        {showExplainer && (
          <View style={styles.explainerCard}>
            <Text style={styles.explainerTitle}>यह प्रमाण क्यों आवश्यक है? / Why is this proof important?</Text>
            <Text style={styles.explainerBody}>
              आपकी उपज की तुलाई, गुणवत्ता जांच और भुगतान विवरण को ब्लॉकचेन टेक्नोलॉजी द्वारा सुरक्षित रूप से दर्ज किया गया है।
              {"\n\n"}
              इसका अर्थ है कि कोई भी अधिकारी या ठेकेदार आपकी तौल मात्रा या मूल्य रिकॉर्ड में बाद में बदलाव नहीं कर सकता। आपके पास हमेशा स्थायी एवं सुरक्षित प्रमाण रहेगा।
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#065F46' },
  subtitle: { fontSize: 13, color: '#4B5563', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#065F46' },
  hashBox: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 10, borderRadius: 8, marginVertical: 6 },
  hashLabel: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  hashValue: { fontSize: 10, color: '#0F172A', fontFamily: 'monospace', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  label: { fontSize: 12, color: '#6B7280' },
  val: { fontSize: 12, fontWeight: '600', color: '#1E293B' },
  valMono: { fontSize: 12, fontWeight: 'bold', color: '#047857', fontFamily: 'monospace' },
  explainerButton: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  explainerButtonText: { color: '#1D4ED8', fontWeight: 'bold', fontSize: 13 },
  explainerCard: { backgroundColor: '#FEF3C7', borderLeftWidth: 4, borderLeftColor: '#F59E0B', padding: 14, borderRadius: 8 },
  explainerTitle: { fontSize: 14, fontWeight: 'bold', color: '#92400E', marginBottom: 6 },
  explainerBody: { fontSize: 12, color: '#78350F', lineHeight: 18 },
});
