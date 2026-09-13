import './globals.css';
import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import VoiceAssistantWidget from '@/components/VoiceAssistantWidget';
import CallHelplineFAB from '@/components/farmer/CallHelplineFAB';
import FarmerBottomNav from '@/components/farmer/FarmerBottomNav';
import PwaRegister from '@/components/PwaRegister';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B3B18',
};

export const metadata: Metadata = {
  title: 'KisanCall | कृषि उपार्जन समन्वय — Transparent Mandi Procurement & Queue Platform',
  description: 'KisanCall bridges Indian farmers and mandi procurement centres with scheduled arrival slots, real-time queue visibility, tamper-evident digital weighing, and direct DBT tracking.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KisanCall',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KisanCall" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-stonebg-50 text-charcoal-900 antialiased selection:bg-brand-800 selection:text-white min-h-screen pb-safe">
        {children}
        <CallHelplineFAB />
        <VoiceAssistantWidget />
        <FarmerBottomNav />
        <PwaRegister />
      </body>
    </html>
  );
}
