export interface SlotResult {
  mandi: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface QueueResult {
  position: number;
  etaMinutes: number;
}

export interface PriceResult {
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
  source: string;
}

export interface PaymentResult {
  status: string;
  amount: number;
  reference: string;
  updatedAt: string;
}

export const mockToolClient = {
  getSlot: async (farmerId: string): Promise<SlotResult> => {
    return {
      mandi: 'Karnal Central Mandi',
      date: '2026-09-01',
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      status: 'confirmed',
    };
  },

  getQueue: async (farmerId: string): Promise<QueueResult> => {
    return {
      position: 4,
      etaMinutes: 25,
    };
  },

  getPrice: async (mandiId: string, commodity: string = 'wheat'): Promise<PriceResult> => {
    return {
      minPrice: 2150,
      maxPrice: 2350,
      modalPrice: 2275,
      date: '2026-08-31',
      source: 'Agmarknet / DoCA Govt Data',
    };
  },

  getPayment: async (procurementId: string): Promise<PaymentResult> => {
    return {
      status: 'completed',
      amount: 45500,
      reference: 'PAY-884920-IND',
      updatedAt: '2026-08-31T14:30:00Z',
    };
  },
};
