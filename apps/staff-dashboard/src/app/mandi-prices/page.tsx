'use client';

import React from 'react';
import { MandiPricesDashboard } from '@/components/MandiPricesDashboard';

export default function StaffMandiPricesPage() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  return <MandiPricesDashboard apiBaseUrl={backendUrl} />;
}
