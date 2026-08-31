import { mockToolClient, SlotResult, QueueResult, PriceResult, PaymentResult } from './mockToolClient';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export const httpToolClient = {
  getSlot: async (farmerId: string): Promise<SlotResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-slot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[HTTP Tool Client] Backend returned error/501, falling back to mock:', err);
      return mockToolClient.getSlot(farmerId);
    }
  },

  getQueue: async (farmerId: string): Promise<QueueResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[HTTP Tool Client] Backend returned error/501, falling back to mock:', err);
      return mockToolClient.getQueue(farmerId);
    }
  },

  getPrice: async (mandiId: string, commodity: string): Promise<PriceResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mandiId, commodity }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[HTTP Tool Client] Backend returned error/501, falling back to mock:', err);
      return mockToolClient.getPrice(mandiId, commodity);
    }
  },

  getPayment: async (procurementId: string): Promise<PaymentResult> => {
    try {
      const res = await fetch(`${BACKEND_URL}/voice/tool/get-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ procurementId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[HTTP Tool Client] Backend returned error/501, falling back to mock:', err);
      return mockToolClient.getPayment(procurementId);
    }
  },
};

export function getToolClient() {
  const useMock = process.env.USE_MOCK_TOOLS !== 'false';
  return useMock ? mockToolClient : httpToolClient;
}
