import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#10B981' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="onboarding" options={{ title: 'KisanCall Onboarding', headerShown: false }} />
        <Stack.Screen name="index" options={{ title: 'KisanCall - Home' }} />
        <Stack.Screen name="book-slot" options={{ title: 'Register & Book Slot' }} />
        <Stack.Screen name="queue-status" options={{ title: 'Live Queue & Status' }} />
        <Stack.Screen name="price" options={{ title: 'Commodity Prices' }} />
        <Stack.Screen name="payment" options={{ title: 'Payment Details' }} />
        <Stack.Screen name="proof" options={{ title: 'Proof Reference' }} />
        <Stack.Screen name="call-history" options={{ title: 'Call History' }} />
        <Stack.Screen name="profile" options={{ title: 'Farmer Profile' }} />
      </Stack>
    </AuthProvider>
  );
}
