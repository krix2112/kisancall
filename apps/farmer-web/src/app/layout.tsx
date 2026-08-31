import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'KisanCall - Farmer Portal',
  description: 'Voice-first agricultural procurement coordination platform for farmers',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
