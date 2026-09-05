export interface FarmerStatusData {
  farmer: {
    name: string;
    phone: string;
    mandi: string;
    crop: string;
  };
  booking: {
    tokenId: string;
    date: string;
    slotBlock: string;
    status: 'Booked' | 'Arrived' | 'In Queue' | 'Procured' | 'Completed';
  };
  queue: {
    position: number;
    totalInQueue: number;
    etaMinutes: number;
    gateNumber: string;
  };
  price: {
    commodity: string;
    modalPrice: number;
    msp: number;
    date: string;
  };
  payment: {
    status: 'Pending' | 'Processing' | 'Paid';
    amount: number;
    reference: string;
    updatedAt: string;
  };
  proof?: {
    txHash: string;
    blockNumber: number;
    verified: boolean;
  };
}

export const FALLBACK_STATUS: FarmerStatusData = {
  farmer: {
    name: 'Ramesh Kumar (रमेश कुमार)',
    phone: '+91 98765 43210',
    mandi: 'Karnal Central Mandi (कर्नाल केंद्रीय मंडी)',
    crop: 'Wheat / गेहूं (Lok-1)',
  },
  booking: {
    tokenId: '#KC-8849',
    date: '01 Sep 2026',
    slotBlock: 'Morning 08:00 AM - 12:00 PM',
    status: 'In Queue',
  },
  queue: {
    position: 4,
    totalInQueue: 18,
    etaMinutes: 25,
    gateNumber: 'Gate 2 (गेट न. 2)',
  },
  price: {
    commodity: 'Wheat (गेहूं)',
    modalPrice: 2275,
    msp: 2275,
    date: '31 Aug 2026',
  },
  payment: {
    status: 'Paid',
    amount: 45500,
    reference: 'PAY-884920-IND',
    updatedAt: '31 Aug 02:30 PM',
  },
  proof: {
    txHash: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
    blockNumber: 4892014,
    verified: true,
  },
};
