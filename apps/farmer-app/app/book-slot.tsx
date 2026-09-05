import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

const colors = {
  primary: '#00450d',
  onPrimary: '#ffffff',
  primaryContainer: '#1b5e20',
  onPrimaryContainer: '#90d689',
  primaryFixed: '#acf4a4',
  onPrimaryFixed: '#002203',
  secondary: '#006e1c',
  secondaryContainer: '#91f78e',
  onSecondaryContainer: '#00731e',
  secondaryFixed: '#94f990',
  tertiaryContainer: '#883454',
  onTertiaryContainer: '#ffaec6',
  tertiaryFixed: '#ffd9e2',
  tertiary: '#6b1d3d',
  surface: '#f7fbf1',
  surfaceContainer: '#ecefe6',
  surfaceContainerLow: '#f2f5ec',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e0',
  surfaceVariant: '#e0e4db',
  onSurface: '#191d17',
  onSurfaceVariant: '#41493e',
  outline: '#717a6d',
  outlineVariant: '#c0c9bb',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  error: '#ba1a1a',
  background: '#f7fbf1',
};

import { CROPS, MANDIS, DATES, SLOTS } from '../src/lib/mockData';
import { farmerApi } from '../src/services/api';

export default function BookSlotScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1); // 1: Crop, 2: Mandi, 3: Time, 4: Confirm, 5: Success

  // State
  const [selectedCrop, setSelectedCrop] = useState<string>('wheat');
  const [selectedMandi, setSelectedMandi] = useState<string>('sehore');
  const [selectedDate, setSelectedDate] = useState<string>('today');
  const [selectedSlot, setSelectedSlot] = useState<string>('slot1');
  const [mandiSearch, setMandiSearch] = useState<string>('');
  
  // API State
  const [bookingState, setBookingState] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [bookedToken, setBookedToken] = useState<string>('K-104');

  const currentCropObj = CROPS.find((c) => c.id === selectedCrop) || CROPS[0];
  const currentMandiObj = MANDIS.find((m) => m.id === selectedMandi) || MANDIS[0];
  const currentSlotObj = SLOTS.find((s) => s.id === selectedSlot) || SLOTS[0];

  const handleNextStep = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      try {
        setBookingState('submitting');
        setErrorMessage('');
        
        // In real app, `selectedSlot` must be a real UUID from GET /mandis/:id/slots
        // which currently isn't implemented. We'll use a hardcoded valid slot or mock ID.
        // But for backend testing, we need a UUID. Let's use a dummy UUID.
        const dummySlotId = '00000000-0000-0000-0000-000000000002';
        const farmerId = user?.id || '00000000-0000-0000-0000-000000000001';
        const booking = await farmerApi.createBooking(farmerId, dummySlotId);
        
        setBookedToken(booking.token);
        setBookingState('idle');
        setStep(5); // Success state
      } catch (err: any) {
        setBookingState('error');
        setErrorMessage(err.message || 'An unexpected error occurred while booking');
      }
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleVoiceHelp = () => {
    Alert.alert(
      'KisanCall Voice Assistant',
      'Speak your preferred crop, mandi, or slot. The assistant will complete your booking automatically.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />

      {/* App Header */}
      <View style={styles.appHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBackStep}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitleHi}>स्लॉट बुक करें</Text>
          <Text style={styles.headerTitleSub}>Book a Slot</Text>
        </View>
        <TouchableOpacity style={styles.micBtn} onPress={handleVoiceHelp}>
          <Text style={styles.micIcon}>🎙</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar Header (Steps 1 to 4) */}
      {step <= 4 && (
        <View style={styles.progressHeader}>
          <View style={styles.progressTopRow}>
            <Text style={styles.stepIndicatorText}>Step {step} of 4</Text>
            <Text style={styles.stepNameText}>
              {step === 1 ? 'Crop' : step === 2 ? 'Mandi' : step === 3 ? 'Time' : 'Review'}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(step / 4) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Main Content Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: SELECT CROP */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.displayTitleHi}>फसल चुनें</Text>
              <Text style={styles.displaySubEng}>Choose your crop</Text>
              <Text style={styles.helperText}>
                Please select the crop you want to sell.
              </Text>
            </View>

            <View style={styles.optionsList}>
              {CROPS.map((crop) => {
                const isSelected = selectedCrop === crop.id;
                return (
                  <TouchableOpacity
                    key={crop.id}
                    style={[
                      styles.cropCard,
                      isSelected && styles.cropCardSelected,
                    ]}
                    onPress={() => setSelectedCrop(crop.id)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.cropIconBox}>
                      <Text style={styles.cropEmoji}>{crop.icon}</Text>
                    </View>
                    <View style={styles.cropTextCol}>
                      <Text
                        style={[
                          styles.cropNameHi,
                          isSelected && { color: colors.primary },
                        ]}
                      >
                        {crop.titleHindi}
                      </Text>
                      <Text style={styles.cropNameEng}>{crop.titleEng}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <Text style={styles.checkMarkText}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 2: SELECT MANDI */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.displayTitleHi}>मंडी चुनें</Text>
              <Text style={styles.helperText}>
                Choose procurement centre for your crop delivery.
              </Text>
            </View>

            {/* Search Box */}
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="मंडी खोजें / Search Mandi"
                placeholderTextColor={colors.onSurfaceVariant}
                value={mandiSearch}
                onChangeText={setMandiSearch}
              />
              <Text style={styles.locationIcon}>📍</Text>
            </View>

            <View style={styles.optionsList}>
              {MANDIS.filter(
                (m) =>
                  m.titleEng.toLowerCase().includes(mandiSearch.toLowerCase()) ||
                  m.titleHindi.includes(mandiSearch)
              ).map((mandi) => {
                const isSelected = selectedMandi === mandi.id;
                const isDisabled = !mandi.available;
                return (
                  <TouchableOpacity
                    key={mandi.id}
                    disabled={isDisabled}
                    style={[
                      styles.mandiCard,
                      isSelected && styles.mandiCardSelected,
                      isDisabled && { opacity: 0.5 },
                    ]}
                    onPress={() => setSelectedMandi(mandi.id)}
                    activeOpacity={0.9}
                  >
                    {mandi.recommended && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>RECOMMENDED</Text>
                      </View>
                    )}

                    <View style={styles.mandiCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.mandiNameHi}>
                          {mandi.titleHindi}
                        </Text>
                        <Text style={styles.mandiNameEng}>
                          {mandi.titleEng}
                        </Text>
                        <View style={styles.mandiMetaRow}>
                          <Text style={styles.metaText}>
                            📍 {mandi.distance}
                          </Text>
                          <Text
                            style={[
                              styles.metaText,
                              {
                                color: mandi.available
                                  ? colors.secondary
                                  : colors.error,
                                fontWeight: '700',
                              },
                            ]}
                          >
                            • {mandi.slotsOpen}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && (
                          <Text style={styles.checkMarkText}>✓</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 3: SELECT TIME */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            {/* Selection Summary Pill */}
            <View style={styles.summaryPill}>
              <View style={styles.summaryIconCircle}>
                <Text style={{ fontSize: 18 }}>🌾</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryCropTitle}>
                  {currentCropObj.titleEng} / {currentCropObj.titleHindi}
                </Text>
                <Text style={styles.summaryMandiSub}>
                  📍 {currentMandiObj.titleEng}
                </Text>
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.displayTitleHi}>समय चुनें</Text>
              <Text style={styles.helperText}>Choose a time slot for today</Text>
            </View>

            {/* Date Selector Row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesRow}
            >
              {DATES.map((dateObj) => {
                const isSelected = selectedDate === dateObj.id;
                return (
                  <TouchableOpacity
                    key={dateObj.id}
                    style={[
                      styles.dateBtn,
                      isSelected && styles.dateBtnSelected,
                    ]}
                    onPress={() => setSelectedDate(dateObj.id)}
                  >
                    <Text
                      style={[
                        styles.dateLabel,
                        isSelected && { color: colors.onPrimary },
                      ]}
                    >
                      {dateObj.label}
                    </Text>
                    <Text
                      style={[
                        styles.dateDayNumber,
                        isSelected && { color: colors.onPrimary },
                      ]}
                    >
                      {dateObj.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        isSelected && { color: colors.onPrimary },
                      ]}
                    >
                      {dateObj.month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Slot Cards */}
            <View style={styles.optionsList}>
              {SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                const isFull = slot.status === 'full';
                return (
                  <TouchableOpacity
                    key={slot.id}
                    disabled={isFull}
                    style={[
                      styles.slotCard,
                      isSelected && styles.slotCardSelected,
                      isFull && styles.slotCardFull,
                    ]}
                    onPress={() => setSelectedSlot(slot.id)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.slotCardTop}>
                      <View>
                        <Text
                          style={[
                            styles.slotTimeText,
                            isSelected && { color: colors.onPrimaryContainer },
                            isFull && {
                              textDecorationLine: 'line-through',
                              color: colors.onSurfaceVariant,
                            },
                          ]}
                        >
                          ⏱ {slot.timeEng}
                        </Text>
                        <Text
                          style={[
                            styles.slotSubText,
                            isSelected && {
                              color: colors.onPrimaryContainer,
                              opacity: 0.9,
                            },
                          ]}
                        >
                          {slot.timeHindi}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && (
                          <Text style={styles.checkMarkText}>✓</Text>
                        )}
                        {isFull && <Text style={{ fontSize: 12 }}>✕</Text>}
                      </View>
                    </View>

                    {/* Spot Availability Tag */}
                    <View
                      style={[
                        styles.spotTag,
                        isSelected && {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        },
                        slot.status === 'few' && {
                          backgroundColor: colors.tertiaryContainer,
                        },
                        isFull && { backgroundColor: colors.errorContainer },
                      ]}
                    >
                      <Text
                        style={[
                          styles.spotTagText,
                          isSelected && { color: colors.onPrimaryContainer },
                          slot.status === 'few' && {
                            color: colors.onTertiaryContainer,
                          },
                          isFull && { color: colors.onErrorContainer },
                        ]}
                      >
                        {slot.statusText}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 4: CONFIRM & REVIEW */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.displayTitleHi}>स्लॉट की पुष्टि करें</Text>
              <Text style={styles.displaySubEng}>Confirm your Slot</Text>
              <Text style={styles.helperText}>
                Please review your booking details before confirming.
              </Text>
            </View>

            {/* Summary Card */}
            <View style={styles.reviewCard}>
              {/* Crop */}
              <View style={styles.reviewRow}>
                <View
                  style={[
                    styles.reviewIconBox,
                    { backgroundColor: colors.tertiaryContainer },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>🌿</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewLabel}>फसल / Crop</Text>
                  <Text style={styles.reviewValTitle}>
                    {currentCropObj.titleEng} ({currentCropObj.titleHindi})
                  </Text>
                  <Text style={styles.reviewValSub}>Quantity: 50 Quintals</Text>
                </View>
              </View>

              {/* Mandi */}
              <View style={styles.reviewRow}>
                <View
                  style={[
                    styles.reviewIconBox,
                    { backgroundColor: colors.secondaryContainer },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>🏬</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewLabel}>मंडी / Mandi</Text>
                  <Text style={styles.reviewValTitle}>
                    {currentMandiObj.titleEng}
                  </Text>
                  <Text style={styles.reviewValSub}>
                    📍 {currentMandiObj.titleHindi}
                  </Text>
                </View>
              </View>

              {/* Date & Time */}
              <View style={[styles.reviewRow, { borderBottomWidth: 0 }]}>
                <View
                  style={[
                    styles.reviewIconBox,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>📅</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewLabel}>तारीख और समय / Date & Time</Text>
                  <Text style={styles.reviewValTitle}>
                    Today (12 Nov 2026)
                  </Text>
                  <Text
                    style={[
                      styles.reviewValSub,
                      { color: colors.primary, fontWeight: '700' },
                    ]}
                  >
                    {currentSlotObj.timeEng}
                  </Text>
                </View>
              </View>
            </View>

            {/* Error Message */}
            {bookingState === 'error' && (
              <View style={{ backgroundColor: colors.errorContainer, padding: 12, borderRadius: 12, marginTop: 16 }}>
                <Text style={{ color: colors.onErrorContainer, fontSize: 14, fontWeight: '600' }}>
                  Booking failed: {errorMessage}
                </Text>
              </View>
            )}

            {/* Timely Note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteIcon}>ℹ️</Text>
              <Text style={styles.noteText}>
                कृपया अपनी उपज समय पर लाएं। / Please bring your produce on time.
              </Text>
            </View>
          </View>
        )}

        {/* STEP 5: SUCCESS STATE */}
        {step === 5 && (
          <View style={styles.successContainer}>
            {/* Animated Check Circle */}
            <View style={styles.successCircle}>
              <Text style={styles.successCheckIcon}>✓</Text>
            </View>

            <Text style={styles.successTitleHi}>स्लॉट बुक हो गया</Text>
            <Text style={styles.successSubEng}>Slot booked successfully</Text>

            {/* Token Display Box */}
            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>टोकन नंबर / TOKEN NUMBER</Text>
              <Text style={styles.tokenNumber}>{bookedToken}</Text>
            </View>

            {/* Details Summary */}
            <View style={styles.successSummaryBox}>
              <View style={styles.successRow}>
                <Text style={styles.successRowIcon}>🌾</Text>
                <View>
                  <Text style={styles.successRowLabel}>Crop</Text>
                  <Text style={styles.successRowValue}>
                    {currentCropObj.titleEng} ({currentCropObj.titleHindi})
                  </Text>
                </View>
              </View>

              <View style={styles.successRow}>
                <Text style={styles.successRowIcon}>🏬</Text>
                <View>
                  <Text style={styles.successRowLabel}>Mandi</Text>
                  <Text style={styles.successRowValue}>
                    {currentMandiObj.titleEng}
                  </Text>
                </View>
              </View>

              <View style={styles.successRow}>
                <Text style={styles.successRowIcon}>⏱</Text>
                <View>
                  <Text style={styles.successRowLabel}>Time</Text>
                  <Text style={styles.successRowValue}>
                    Today, {currentSlotObj.timeEng}
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.primaryActionText}>
                होम पर जाएँ / Go to Home →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={handleVoiceHelp}
            >
              <Text style={styles.secondaryActionText}>
                🎙 बुकिंग की जानकारी फोन पर पाएं
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Action Bar for Steps 1-4 */}
      {step <= 4 && (
        <View style={styles.fixedBottomBar}>
          <TouchableOpacity
            style={[styles.nextStepBtn, bookingState === 'submitting' && { opacity: 0.7 }]}
            onPress={handleNextStep}
            activeOpacity={0.9}
            disabled={bookingState === 'submitting'}
          >
            <Text style={styles.nextStepBtnText}>
              {bookingState === 'submitting' 
                ? 'Submitting...' 
                : step === 4 ? 'स्लॉट बुक करें / Book Slot' : 'Next Step / आगे बढ़ें'}
            </Text>
            <Text style={styles.nextStepBtnIcon}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  appHeader: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '40',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: colors.onSurface },
  headerTitleCol: { alignItems: 'center' },
  headerTitleHi: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  headerTitleSub: { fontSize: 12, color: colors.onSurfaceVariant },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: { fontSize: 18 },

  progressHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    gap: 6,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicatorText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  stepNameText: { fontSize: 14, color: colors.onSurfaceVariant },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  stepContainer: { gap: 16 },

  titleSection: { gap: 4 },
  displayTitleHi: { fontSize: 26, fontWeight: '700', color: colors.onSurface },
  displaySubEng: { fontSize: 18, color: colors.onSurfaceVariant },
  helperText: { fontSize: 15, color: colors.onSurfaceVariant, marginTop: 4 },

  optionsList: { gap: 12 },

  // Step 1: Crop Cards
  cropCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cropCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer + '10',
  },
  cropIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropEmoji: { fontSize: 28 },
  cropTextCol: { flex: 1 },
  cropNameHi: { fontSize: 20, fontWeight: '700', color: colors.onSurface },
  cropNameEng: { fontSize: 15, color: colors.onSurfaceVariant },

  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkMarkText: { fontSize: 14, color: '#ffffff', fontWeight: 'bold' },

  // Step 2: Mandi Cards
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    gap: 8,
  },
  searchIcon: { fontSize: 18 },
  searchInput: { flex: 1, fontSize: 16, color: colors.onSurface },
  locationIcon: { fontSize: 18 },

  mandiCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.surfaceVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  mandiCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer + '10',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  mandiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mandiNameHi: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  mandiNameEng: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },
  mandiMetaRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  metaText: { fontSize: 13, color: colors.onSurfaceVariant },

  // Step 3: Time Slot & Dates
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 12,
  },
  summaryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCropTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  summaryMandiSub: { fontSize: 13, color: colors.onSurfaceVariant },

  datesRow: { gap: 12, paddingVertical: 8 },
  dateBtn: {
    width: 90,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    gap: 2,
  },
  dateBtnSelected: { backgroundColor: colors.primary },
  dateLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  dateDayNumber: { fontSize: 22, fontWeight: '700', color: colors.onSurface },
  dateMonth: { fontSize: 12, color: colors.onSurfaceVariant },

  slotCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 12,
  },
  slotCardSelected: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primary,
  },
  slotCardFull: { opacity: 0.6, backgroundColor: colors.surfaceContainerHighest },
  slotCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotTimeText: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  slotSubText: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },
  spotTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  spotTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },

  // Step 4: Review
  reviewCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    gap: 16,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  reviewIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewLabel: { fontSize: 12, color: colors.onSurfaceVariant },
  reviewValTitle: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  reviewValSub: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },
  noteBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  noteIcon: { fontSize: 18 },
  noteText: { flex: 1, fontSize: 13, color: colors.onSurfaceVariant },

  // Step 5: Success
  successContainer: { alignItems: 'center', gap: 16, paddingTop: 20 },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheckIcon: { fontSize: 40, color: '#ffffff', fontWeight: 'bold' },
  successTitleHi: { fontSize: 28, fontWeight: '700', color: colors.onSurface },
  successSubEng: { fontSize: 16, color: colors.onSurfaceVariant, marginTop: -8 },
  tokenBox: {
    width: '100%',
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  tokenNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  successSummaryBox: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  successRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  successRowIcon: { fontSize: 20 },
  successRowLabel: { fontSize: 12, color: colors.onSurfaceVariant },
  successRowValue: { fontSize: 16, fontWeight: '700', color: colors.onSurface },
  primaryActionBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  secondaryActionBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: { fontSize: 16, fontWeight: '700', color: colors.primary },

  // Fixed Bottom Bar
  fixedBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  nextStepBtn: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextStepBtnText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  nextStepBtnIcon: { fontSize: 20, color: '#ffffff' },
});
