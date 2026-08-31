import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../supabase';

interface AuthContextType {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  session: Session | null;
  user: User | null;
  sendOtp: (phone: string) => Promise<{ error: string | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LANGUAGE_KEY = 'farmer_language';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('hi');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load persisted language
    AsyncStorage.getItem(LANGUAGE_KEY).then((savedLang) => {
      if (savedLang) {
        setLanguageState(savedLang);
      }
    }).catch((err) => {
      console.warn('Failed to load language from AsyncStorage:', err);
    });

    // Check Supabase session
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      }).catch(() => setLoading(false));

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (err) {
      console.warn('Failed to persist language choice:', err);
    }
  };

  const sendOtp = async (phone: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase URL and Anon Key are not configured in environment.' };
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (phone: string, token: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase URL and Anon Key are not configured in environment.' };
    }
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      if (error) return { error: error.message };
      if (data.session) setSession(data.session);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to verify OTP' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        language,
        setLanguage,
        session,
        user: session?.user || null,
        sendOtp,
        verifyOtp,
        signOut,
        isConfigured: isSupabaseConfigured,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
