import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, sendOtp, verifyOtp, isConfigured } = useAuth();

  const [step, setStep] = useState<'language' | 'phone' | 'otp'>('language');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [preferCall, setPreferCall] = useState<boolean>(false);

  const handleSelectLanguage = async (selectedLang: string) => {
    await setLanguage(selectedLang);
    setStep('phone');
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error } = await sendOtp(formattedPhone);

    setLoading(false);

    if (error) {
      if (!isConfigured) {
        // Graceful error display + option to continue in offline/demo mode
        setErrorMessage(`Note: ${error} (Demo Mode Active)`);
        setStep('otp');
      } else {
        setErrorMessage(error);
      }
    } else {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setErrorMessage('Please enter a valid 6-digit OTP code.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error } = await verifyOtp(formattedPhone, otp);

    setLoading(false);

    if (error) {
      if (!isConfigured) {
        // Unconfigured fallback allow proceeding for UI testing
        router.replace('/');
      } else {
        setErrorMessage(error);
      }
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.appTitle}>KisanCall</Text>
          <Text style={styles.subtitle}>
            {language === 'hi'
              ? 'किसान कॉल - कृषि खरीद समन्वय'
              : 'Voice-First Agricultural Procurement'}
          </Text>
        </View>

        {!isConfigured && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              ⚠️ Supabase env keys not set. Running in UI preview mode.
            </Text>
          </View>
        )}

        {/* STEP 1: LANGUAGE SELECT */}
        {step === 'language' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {language === 'hi' ? 'अपनी भाषा चुनें' : 'Select Your Language'}
            </Text>

            <TouchableOpacity
              style={[
                styles.langButton,
                language === 'hi' && styles.langButtonActive,
              ]}
              onPress={() => handleSelectLanguage('hi')}
            >
              <Text
                style={[
                  styles.langButtonText,
                  language === 'hi' && styles.langButtonTextActive,
                ]}
              >
                🇮🇳 हिंदी (Hindi)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                language === 'en' && styles.langButtonActive,
              ]}
              onPress={() => handleSelectLanguage('en')}
            >
              <Text
                style={[
                  styles.langButtonText,
                  language === 'en' && styles.langButtonTextActive,
                ]}
              >
                🌐 English
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: PHONE NUMBER ENTRY */}
        {step === 'phone' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {language === 'hi' ? 'अपना मोबाइल नंबर दर्ज करें' : 'Enter Your Phone Number'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="9876543210"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {language === 'hi' ? 'ओटीपी भेजें (Send OTP)' : 'Send OTP'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Link for Phone Call Preference */}
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setPreferCall(!preferCall)}
            >
              <Text style={styles.toggleText}>
                {preferCall
                  ? '▼ Hide Phone Call Info'
                  : '📞 Prefer a phone call instead of the app?'}
              </Text>
            </TouchableOpacity>

            {preferCall && (
              <View style={styles.callPreferenceCard}>
                <Text style={styles.callPreferenceTitle}>
                  {language === 'hi' ? 'फ़ोन कॉल पंजीकरण' : 'Voice Call Registration'}
                </Text>
                <Text style={styles.callPreferenceBody}>
                  {language === 'hi'
                    ? 'यदि आप ऐप का उपयोग नहीं करना चाहते हैं, तो हमारे टोल-फ्री नंबर पर कॉल करें। हमारी एआई आवाज सहायक आपकी बोली लगाने, स्लॉट बुक करने और भुगतान जानने में सहायता करेगी।'
                    : 'If you prefer not to use the app, simply give a missed call or dial our toll-free line. Our AI voice agent handles slot booking and queue updates in your language.'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => setStep('language')}
            >
              <Text style={styles.backLinkText}>← Change Language ({language.toUpperCase()})</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 'otp' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {language === 'hi' ? 'ओटीपी सत्यापित करें' : 'Verify OTP'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {language === 'hi'
                ? `नंबर +91 ${phone} पर भेजा गया 6-अंकों का कोड दर्ज करें`
                : `Enter 6-digit code sent to +91 ${phone}`}
            </Text>

            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {language === 'hi' ? 'सत्यापित करें और आगे बढ़ें' : 'Verify & Continue'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => setStep('phone')}
            >
              <Text style={styles.backLinkText}>← Change Phone Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065F46',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
    textAlign: 'center',
  },
  warningCard: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#92400E',
    fontSize: 12,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  langButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    alignItems: 'center',
  },
  langButtonActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  langButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  langButtonTextActive: {
    color: '#047857',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#111827',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#059669',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  toggleContainer: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  callPreferenceCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
  },
  callPreferenceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  callPreferenceBody: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  backLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  backLinkText: {
    color: '#6B7280',
    fontSize: 13,
  },
});
