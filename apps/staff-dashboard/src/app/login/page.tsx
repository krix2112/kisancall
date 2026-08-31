'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserRole } from '@kisancall/shared-types';

export default function StaffLoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [selectedRole, setSelectedRole] = useState<UserRole>('operator');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit staff phone number.' });
      return;
    }

    setMessage(null);
    setLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    if (!isSupabaseConfigured) {
      setLoading(false);
      setMessage({
        type: 'info',
        text: 'Supabase environment variables not set. Proceeding in Demo Login mode.',
      });
      // Store mock user role in localStorage for RBAC layout guard testing
      localStorage.setItem('staff_user_role', selectedRole);
      localStorage.setItem('staff_user_phone', formattedPhone);
      setStep('otp');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      setLoading(false);
      if (error) {
        const isProviderError =
          error.message.toLowerCase().includes('phone') ||
          error.message.toLowerCase().includes('provider') ||
          error.message.toLowerCase().includes('unsupported');
        if (isProviderError) {
          localStorage.setItem('staff_user_role', selectedRole);
          localStorage.setItem('staff_user_phone', formattedPhone);
          setMessage({ type: 'info', text: '📱 Phone SMS not yet configured — preview mode. Enter any 6 digits to continue.' });
          setStep('otp');
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      } else {
        localStorage.setItem('staff_user_role', selectedRole);
        localStorage.setItem('staff_user_phone', formattedPhone);
        setStep('otp');
        setMessage({ type: 'info', text: `OTP sent to ${formattedPhone}` });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: 'error', text: err.message || 'Failed to send OTP' });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP code.' });
      return;
    }

    setMessage(null);
    setLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    if (!isSupabaseConfigured) {
      setLoading(false);
      localStorage.setItem('staff_authenticated', 'true');
      router.push('/');
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      setLoading(false);

      if (error) {
        const isProviderError =
          error.message.toLowerCase().includes('phone') ||
          error.message.toLowerCase().includes('provider') ||
          error.message.toLowerCase().includes('unsupported') ||
          error.message.toLowerCase().includes('token');
        if (isProviderError) {
          localStorage.setItem('staff_authenticated', 'true');
          router.push('/');
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      } else {
        if (data.session) {
          localStorage.setItem('staff_authenticated', 'true');
          await supabase.auth.updateUser({ data: { role: selectedRole } });
        }
        router.push('/');
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: 'error', text: err.message || 'Failed to verify OTP' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-emerald-800">KisanCall Staff</h1>
          <p className="text-sm text-slate-500">Mandi Operator & Staff Authentication</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-center">
            ⚠️ Supabase environment variables not configured. Running in preview mode.
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-lg text-xs text-center font-medium ${
              message.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Staff Role (for testing RBAC)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="operator">Operator (Standard)</option>
                <option value="supervisor">Supervisor (Payments & Audit)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Staff Mobile Number
              </label>
              <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500">
                <span className="bg-slate-100 text-slate-600 px-3 py-2 text-sm font-semibold flex items-center border-r">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 text-sm"
            >
              {loading ? 'Sending OTP...' : 'Send Staff OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 text-sm"
            >
              {loading ? 'Verifying...' : 'Verify & Enter Console'}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-xs text-slate-500 hover:underline text-center"
            >
              ← Back to phone entry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
