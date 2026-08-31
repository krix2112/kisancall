import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

const colors = {
  primary: '#00450d',
  onPrimary: '#ffffff',
  primaryContainer: '#1b5e20',
  onPrimaryContainer: '#90d689',
  secondary: '#006e1c',
  tertiary: '#6b1d3d',
  surface: '#f7fbf1',
  surfaceContainerLow: '#f2f5ec',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e0',
  surfaceContainer: '#ecefe6',
  onSurface: '#191d17',
  onSurfaceVariant: '#41493e',
  outlineVariant: '#c0c9bb',
  inverseSurface: '#2d322c',
};

interface SlipItem {
  id: string;
  crop: string;
  cropHindi: string;
  quantity: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Processing';
  statusHindi: string;
  tokenCode: string;
}

export default function ProofScreen() {
  const router = useRouter();
  const [selectedSlip, setSelectedSlip] = useState<SlipItem | null>(null);

  const slips: SlipItem[] = [
    {
      id: '1',
      crop: 'Wheat',
      cropHindi: 'Gehu',
      quantity: '25.5 Quintals',
      amount: '₹58,650',
      date: '12 May 2024',
      status: 'Paid',
      statusHindi: 'भुगतान हो गया',
      tokenCode: '#KC-8472-91',
    },
    {
      id: '2',
      crop: 'Chana',
      cropHindi: 'Gram',
      quantity: '10.2 Quintals',
      amount: '₹48,960',
      date: '10 May 2024',
      status: 'Processing',
      statusHindi: 'प्रक्रिया में',
      tokenCode: '#KC-8472-92',
    },
    {
      id: '3',
      crop: 'Mustard',
      cropHindi: 'Sarso',
      quantity: '15.0 Quintals',
      amount: '₹84,750',
      date: '02 May 2024',
      status: 'Paid',
      statusHindi: 'भुगतान हो गया',
      tokenCode: '#KC-8472-88',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🚜</Text>
          </View>
          <Text style={styles.brandTitle}>KisanCall</Text>
        </View>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Area */}
        <View style={styles.titleSection}>
          <Text style={styles.displayTitle}>My Slips</Text>
          <Text style={styles.displaySubtitle}>मेरी पर्चियां</Text>
        </View>

        {/* Slips List */}
        <View style={styles.listContainer}>
          {slips.map((item) => {
            const isPaid = item.status === 'Paid';
            return (
              <View
                key={item.id}
                style={[styles.slipCard, item.id === '3' && { opacity: 0.8 }]}
              >
                {/* Status Row */}
                <View style={styles.statusRow}>
                  <View style={styles.statusBadge}>
                    <Text
                      style={[
                        styles.statusIcon,
                        { color: isPaid ? colors.secondary : colors.tertiary },
                      ]}
                    >
                      {isPaid ? '✓' : '⏱'}
                    </Text>
                    <Text
                      style={[
                        styles.statusText,
                        { color: isPaid ? colors.secondary : colors.tertiary },
                      ]}
                    >
                      {item.status} / {item.statusHindi}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>

                {/* Details */}
                <View style={styles.detailsRow}>
                  <View>
                    <Text style={styles.cropTitle}>
                      {item.crop} ({item.cropHindi})
                    </Text>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>
                  <Text style={styles.amountText}>{item.amount}</Text>
                </View>

                {/* Actions */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isPaid
                      ? { backgroundColor: colors.primaryContainer }
                      : { backgroundColor: colors.surfaceContainerHigh },
                  ]}
                  onPress={() => setSelectedSlip(item)}
                >
                  <Text
                    style={[
                      styles.actionIcon,
                      { color: isPaid ? colors.onPrimaryContainer : colors.onSurface },
                    ]}
                  >
                    {isPaid ? '📱' : '🔍'}
                  </Text>
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: isPaid ? colors.onPrimaryContainer : colors.onSurface },
                    ]}
                  >
                    {isPaid ? 'View Digital Slip' : 'Check Status'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          {/* CTA: Book New Slot */}
          <TouchableOpacity
            style={styles.bookSlotCtaBtn}
            onPress={() => router.push('/book-slot')}
            activeOpacity={0.9}
          >
            <Text style={styles.bookSlotCtaIcon}>📅</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookSlotCtaTitle}>नया स्लॉट बुक करें</Text>
              <Text style={styles.bookSlotCtaSub}>Book a new procurement slot</Text>
            </View>
            <Text style={styles.bookSlotCtaArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { key: 'home', icon: '🏠', label: 'Home', path: '/' },
          { key: 'book-slot', icon: '📅', label: 'Book Slot', path: '/book-slot' },
          { key: 'my-slips', icon: '📋', label: 'Slips', path: '/proof' },
          { key: 'speak-call', icon: '🎙', label: 'Speak', path: '/call-history' },
          { key: 'profile', icon: '👤', label: 'Profile', path: '/profile' },
        ].map((item) => {
          const isActive = item.key === 'my-slips';
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={() => {
                if (item.path !== '/proof') router.push(item.path as any);
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

      {/* Floating Call Help Button */}
      <View style={styles.floatingHelpContainer}>
        <TouchableOpacity style={styles.floatingHelpBtn} activeOpacity={0.9}>
          <Text style={styles.micIcon}>🎙</Text>
          <Text style={styles.floatingHelpText}>Call KisanCall for Help</Text>
        </TouchableOpacity>
      </View>

      {/* QR Modal Overlay */}
      <Modal
        visible={!!selectedSlip}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSlip(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Digital Slip</Text>
            <Text style={styles.modalSub}>Show this QR code at the mandi</Text>

            {/* QR Code Graphic Box */}
            <View style={styles.qrContainer}>
              <View style={styles.qrGrid}>
                {/* Simulated high-contrast QR pattern */}
                <View style={[styles.qrCorner, { top: 12, left: 12 }]} />
                <View style={[styles.qrCorner, { top: 12, right: 12 }]} />
                <View style={[styles.qrCorner, { bottom: 12, left: 12 }]} />
                <Text style={styles.qrCenterIcon}>🌾</Text>
              </View>
            </View>

            <Text style={styles.modalId}>
              ID: {selectedSlip?.tokenCode || '#KC-8472-91'}
            </Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedSlip(null)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  titleSection: {
    marginBottom: 16,
  },
  displayTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
  },
  displaySubtitle: {
    fontSize: 18,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  listContainer: {
    gap: 16,
  },
  slipCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  cropTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
  },
  quantityText: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  amountText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primary,
  },
  actionBtn: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  floatingHelpContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  floatingHelpBtn: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  micIcon: {
    fontSize: 20,
    color: colors.onPrimary,
  },
  floatingHelpText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    width: 192,
    height: 192,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrGrid: {
    width: 160,
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#191d17',
  },
  qrCorner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: '#191d17',
  },
  qrCenterIcon: {
    fontSize: 32,
  },
  modalId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 16,
  },
  closeBtn: {
    width: '100%',
    height: 48,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  bookSlotCtaBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  bookSlotCtaIcon: { fontSize: 24 },
  bookSlotCtaTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  bookSlotCtaSub: { fontSize: 12, color: colors.onPrimaryContainer, marginTop: 2 },
  bookSlotCtaArrow: { fontSize: 22, color: '#ffffff', fontWeight: '700' },
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
