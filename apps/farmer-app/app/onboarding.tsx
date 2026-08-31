import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

const colors = {
  primary: '#00450d',
  onPrimary: '#ffffff',
  primaryContainer: '#1b5e20',
  onPrimaryContainer: '#90d689',
  surface: '#f7fbf1',
  surfaceContainer: '#ecefe6',
  surfaceContainerLow: '#f2f5ec',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e0',
  onSurface: '#191d17',
  onSurfaceVariant: '#41493e',
  outline: '#717a6d',
  outlineVariant: '#c0c9bb',
  error: '#ba1a1a',
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { verifyOtp } = useAuth();

  const [step, setStep] = useState<'input' | 'error' | 'success'>('input');
  const [otp, setOtp] = useState<string[]>(['5', '2', '9', '1']);
  const [timer, setTimer] = useState<number>(45);

  // Animations for success state
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (step === 'error') {
      triggerShake();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'success') {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleOtpChange = (text: string, index: number) => {
    if (step === 'error') setStep('input');
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp === '0000') {
      setStep('error');
    } else {
      setStep('success');
    }
  };

  const handleContinue = async () => {
    await verifyOtp('+919876543210', otp.join(''));
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.brandGroup}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>🌱</Text>
            </View>
            <Text style={styles.brandTitle}>KisanCall</Text>
          </View>
        </View>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step !== 'success' ? (
          /* ── OTP Input / Error View ── */
          <View style={styles.mainContainer}>
            <View style={styles.centerHeader}>
              <View style={styles.iconCircle}>
                <Text style={styles.smsIcon}>💬</Text>
              </View>
              <Text style={styles.title}>OTP दर्ज करें</Text>
              <Text style={styles.subtitle}>
                हमने +91 98765 43210 पर 6-अंकों का कोड भेजा है
              </Text>
            </View>

            <View style={styles.otpSection}>
              <Animated.View
                style={[
                  styles.otpContainer,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => (inputRefs.current[i] = ref)}
                    style={[
                      styles.otpInput,
                      step === 'error'
                        ? styles.otpInputError
                        : digit
                        ? styles.otpInputFilled
                        : null,
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, i)}
                  />
                ))}
              </Animated.View>

              {step === 'error' && (
                <View style={styles.errorRow}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>OTP सही नहीं है। कृपया दोबारा जांचें।</Text>
                </View>
              )}
            </View>

            <View style={styles.resendSection}>
              <Text style={styles.resendPrompt}>OTP नहीं मिला?</Text>
              <TouchableOpacity style={styles.resendButton}>
                <Text style={styles.resendIcon}>🔄</Text>
                <Text style={styles.resendText}>फिर से भेजें (00:{timer})</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
                <Text style={styles.verifyBtnText}>सत्यापित करें (Verify)</Text>
              </TouchableOpacity>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>या</Text>
                <View style={styles.dividerLine} />
              </View>
              <TouchableOpacity style={styles.callOtpBtn}>
                <Text style={styles.callIcon}>📞</Text>
                <Text style={styles.callOtpBtnText}>कॉल पर OTP प्राप्त करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── OTP Success State View ── */
          <View style={styles.mainContainer}>
            <View style={styles.centerHeader}>
              <Text style={styles.successTitle}>नंबर की पुष्टि हो गई</Text>
              <Text style={styles.subtitle}>आपका खाता सुरक्षित है</Text>
            </View>

            {/* Success Animation Ring & Check */}
            <View style={styles.successAnimContainer}>
              <View style={styles.outerRing}>
                <Animated.View
                  style={[
                    styles.innerCheckCircle,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <Text style={styles.checkSymbol}>✓</Text>
                </Animated.View>
              </View>

              <Animated.Text style={[styles.verifiedText, { opacity: fadeAnim }]}>
                सत्यापन सफल (Verified)
              </Animated.Text>
            </View>

            {/* Ghosted OTP display */}
            <View style={styles.ghostOtpContainer}>
              {otp.map((d, i) => (
                <View key={i} style={styles.ghostOtpBox}>
                  <Text style={styles.ghostOtpText}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={{ flex: 1 }} />

            {/* Primary Action Continue Button */}
            <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleContinue}
                activeOpacity={0.85}
              >
                <Text style={styles.continueBtnText}>आगे बढ़ें (Continue)</Text>
                <Text style={styles.arrowIcon}>→</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { fontSize: 16 },
  brandTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerHeader: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  smsIcon: {
    fontSize: 32,
    color: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
    width: '100%',
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: colors.surfaceContainerLowest,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
  },
  otpInputFilled: {
    borderColor: colors.primary,
  },
  otpInputError: {
    borderColor: colors.error,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  errorIcon: { fontSize: 14 },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.error,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendPrompt: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  resendIcon: { fontSize: 18 },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  actionsSection: {
    gap: 16,
    width: '100%',
    marginTop: 'auto',
  },
  verifyBtn: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    backgroundColor: colors.surface,
  },
  callOtpBtn: {
    width: '100%',
    height: 48,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callIcon: {
    fontSize: 22,
    color: colors.primary,
  },
  callOtpBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },

  /* Success State Styles */
  successAnimContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  outerRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#1b5e2020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkSymbol: {
    fontSize: 48,
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
  verifiedText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 24,
  },
  ghostOtpContainer: {
    flexDirection: 'row',
    gap: 12,
    opacity: 0.3,
    marginTop: 16,
  },
  ghostOtpBox: {
    width: 52,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostOtpText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.onSurface,
  },
  continueBtn: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  arrowIcon: {
    fontSize: 20,
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
});
