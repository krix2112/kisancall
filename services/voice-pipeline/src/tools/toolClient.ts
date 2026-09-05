import * as dotenv from 'dotenv';
dotenv.config();

import { mockToolClient, SlotResult, QueueResult, PriceResult, PaymentResult } from './mockToolClient';

export { SlotResult, QueueResult, PriceResult, PaymentResult };

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:4000';

export const httpToolClient = {
  getSlot: async (farmerId: string): Promise<SlotResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-slot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmer_id: farmerId }),
      });
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorBody}`);
      }
      const data = await res.json() as any;
      return {
        mandi: data.mandi_name || data.mandi || 'Karnal Mandi',
        date: data.date,
        startTime: data.start_time || data.startTime,
        endTime: data.end_time || data.endTime,
        status: data.status,
      };
    } catch (err: any) {
      if (process.env.USE_MOCK_TOOLS === 'true') {
        console.warn('[HTTP Tool Client] Falling back to mock:', err.message);
        return mockToolClient.getSlot(farmerId);
      }
      throw err;
    }
  },

  getQueue: async (farmerId: string): Promise<QueueResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmer_id: farmerId }),
      });
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorBody}`);
      }
      const data = await res.json() as any;
      return {
        position: data.position,
        etaMinutes: data.estimated_wait_minutes ?? 15,
      };
    } catch (err: any) {
      if (process.env.USE_MOCK_TOOLS === 'true') {
        console.warn('[HTTP Tool Client] Falling back to mock:', err.message);
        return mockToolClient.getQueue(farmerId);
      }
      throw err;
    }
  },

  getPrice: async (farmerIdOrMandi: string, commodity: string = 'wheat'): Promise<PriceResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmer_id: farmerIdOrMandi, commodity }),
      });
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorBody}`);
      }
      const data = await res.json() as any;
      return {
        minPrice: data.min_price ?? data.minPrice,
        maxPrice: data.max_price ?? data.maxPrice,
        modalPrice: data.modal_price ?? data.modalPrice,
        date: data.date,
        source: 'Agmarknet / DoCA Govt Data',
      };
    } catch (err: any) {
      if (process.env.USE_MOCK_TOOLS === 'true') {
        console.warn('[HTTP Tool Client] Falling back to mock:', err.message);
        return mockToolClient.getPrice(farmerIdOrMandi, commodity);
      }
      throw err;
    }
  },

  getPayment: async (farmerId: string): Promise<PaymentResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmer_id: farmerId }),
      });
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorBody}`);
      }
      const data = await res.json() as any;
      return {
        status: data.status,
        amount: data.amount ?? 0,
        reference: data.reference ?? 'N/A',
        updatedAt: data.updated_at ?? data.updatedAt ?? '',
      };
    } catch (err: any) {
      if (process.env.USE_MOCK_TOOLS === 'true') {
        console.warn('[HTTP Tool Client] Falling back to mock:', err.message);
        return mockToolClient.getPayment(farmerId);
      }
      throw err;
    }
  },
};

export function getToolClient() {
  const useMock = process.env.USE_MOCK_TOOLS === 'true';
  return useMock ? mockToolClient : httpToolClient;
}
