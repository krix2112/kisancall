import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function ProfileScreen() {
  const { user, language, setLanguage } = useAuth();

  const [notifyByVoice, setNotifyByVoice] = useState(true);
  const [notifyBySms, setNotifyBySms] = useState(true);

  const handleToggleLang = async () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    await setLanguage(nextLang);
    Alert.alert('भाषा अपडेट / Language Updated', `Preferred language switched to ${nextLang.toUpperCase()}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>किसान प्रोफ़ाइल / Farmer Profile</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RK</Text>
            </View>
            <View>
              <Text style={styles.name}>Ramesh Kumar (रमेश कुमार)</Text>
              <Text style={styles.phone}>{user?.phone || '+91 98765 43210'}</Text>
              <Text style={styles.idTag}>Farmer ID: KC-FARMER-8849</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>पसंदीदा मंडी / Preferred Mandi:</Text>
            <Text style={styles.infoValue}>Karnal Central Mandi</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>प्राथमिक फसल / Primary Crop:</Text>
            <Text style={styles.infoValue}>Wheat (गेहूं - Lok 1)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>चयनित भाषा / Preferred Language:</Text>
            <TouchableOpacity onPress={handleToggleLang} style={styles.langBtn}>
              <Text style={styles.langBtnText}>{language === 'hi' ? '🇮🇳 हिंदी' : '🌐 English'} (टैप करके बदलें)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification & Communication Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>सूचना एवं कॉल प्राथमिकताएं / Notification Settings</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>आवाज़ एआई कॉल (Automated Voice Calls)</Text>
              <Text style={styles.toggleDesc}>स्लॉट पुष्टि एवं कतार रिमाइंडर के लिए वॉइस कॉल प्राप्त करें</Text>
            </View>
            <Switch
              value={notifyByVoice}
              onValueChange={setNotifyByVoice}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>एसएमएस एवं व्हाट्सएप (SMS & WhatsApp)</Text>
              <Text style={styles.toggleDesc}>टोकन रसीद और भुगतान अपडेट के लिए एसएमएस संदेश प्राप्त करें</Text>
            </View>
            <Switch
              value={notifyBySms}
              onValueChange={setNotifyBySms}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            />
          </View>
        </View>

        {/* Support Banner */}
        <View style={styles.supportBanner}>
          <Text style={styles.supportTitle}>📞 किसान हेल्पलाइन / Kisan Helpline</Text>
          <Text style={styles.supportText}>Toll-Free AI Assistance: 1800-123-456 (24x7 Available)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#065F46', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, borderWidth: 1, borderColor: '#E5E7EB' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#065F46', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  phone: { fontSize: 13, color: '#4B5563', marginTop: 2 },
  idTag: { fontSize: 11, color: '#047857', fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  infoLabel: { fontSize: 12, color: '#6B7280', flex: 1 },
  infoValue: { fontSize: 12, fontWeight: 'bold', color: '#111827' },
  langBtn: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  langBtnText: { fontSize: 11, color: '#047857', fontWeight: 'bold' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleTextCol: { flex: 1, paddingRight: 12 },
  toggleTitle: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  toggleDesc: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  supportBanner: { backgroundColor: '#FEF3C7', borderLeftWidth: 4, borderLeftColor: '#F59E0B', padding: 14, borderRadius: 10 },
  supportTitle: { fontSize: 13, fontWeight: 'bold', color: '#92400E' },
  supportText: { fontSize: 12, color: '#78350F', marginTop: 2 },
});
