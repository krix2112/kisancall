import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'KisanCall | कृषि उपार्जन समन्वय — Transparent Mandi Procurement & Queue Platform',
  description: 'KisanCall bridges Indian farmers and mandi procurement centres with scheduled arrival slots, real-time queue visibility, tamper-evident digital weighing, and direct DBT tracking.',
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
      </head>
      <body className="bg-stonebg-50 text-charcoal-900 antialiased selection:bg-brand-800 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
