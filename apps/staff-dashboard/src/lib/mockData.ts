export const MOCK_FARMERS = [
  { id: '1', name: 'Ramesh Kumar', phone: '+91 98765 43210', token: '#KC-8849', slot: '09:00 AM - 12:00 PM', crop: 'Wheat', status: 'In Queue' },
  { id: '2', name: 'Suresh Verma', phone: '+91 98765 43211', token: '#KC-8850', slot: '09:00 AM - 12:00 PM', crop: 'Paddy', status: 'Arrived' },
  { id: '3', name: 'Baldev Singh', phone: '+91 98765 43212', token: '#KC-8851', slot: '12:00 PM - 03:00 PM', crop: 'Wheat', status: 'Booked' },
  { id: '4', name: 'Harpreet Kaur', phone: '+91 98765 43213', token: '#KC-8852', slot: '09:00 AM - 12:00 PM', crop: 'Mustard', status: 'Procured' },
  { id: '5', name: 'Jagdish Chand', phone: '+91 98765 43214', token: '#KC-8853', slot: '12:00 PM - 03:00 PM', crop: 'Gram', status: 'Paid' },
];

export const CAPACITY_BLOCKS = [
  { time: '09:00 AM - 12:00 PM', capacity: 50, booked: 50, arrived: 35, color: 'bg-rose-500' },
  { time: '12:00 PM - 03:00 PM', capacity: 50, booked: 42, arrived: 18, color: 'bg-emerald-500' },
  { time: '03:00 PM - 06:00 PM', capacity: 50, booked: 28, arrived: 5, color: 'bg-amber-500' },
];

export interface ArrivalRecord {
  id: string;
  token: string;
  name: string;
  phone: string;
  slot: string;
  crop: string;
  expectedQty: string;
  arrived: boolean;
  arrivalTime?: string;
}

export const INITIAL_ARRIVALS: ArrivalRecord[] = [
  { id: '1', token: '#KC-8849', name: 'Ramesh Kumar', phone: '+91 98765 43210', slot: '09:00 AM - 12:00 PM', crop: 'Wheat', expectedQty: '20 Qtl', arrived: true, arrivalTime: '08:52 AM' },
  { id: '2', token: '#KC-8850', name: 'Suresh Verma', phone: '+91 98765 43211', slot: '09:00 AM - 12:00 PM', crop: 'Paddy', expectedQty: '35 Qtl', arrived: false },
  { id: '3', token: '#KC-8851', name: 'Baldev Singh', phone: '+91 98765 43212', slot: '12:00 PM - 03:00 PM', crop: 'Wheat', expectedQty: '50 Qtl', arrived: false },
  { id: '4', token: '#KC-8854', name: 'Gurmeet Singh', phone: '+91 98765 43215', slot: '09:00 AM - 12:00 PM', crop: 'Mustard', expectedQty: '15 Qtl', arrived: false },
];

export interface PaymentRecord {
  id: string;
  procurementId: string;
  farmerName: string;
  phone: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Paid';
  reference: string;
  updatedAt: string;
}

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  { id: '1', procurementId: 'PROC-8821', farmerName: 'Ramesh Kumar', phone: '+91 98765 43210', amount: 45500, status: 'Paid', reference: 'PAY-884920-IND', updatedAt: '31 Aug 02:30 PM' },
  { id: '2', procurementId: 'PROC-8822', farmerName: 'Harpreet Kaur', phone: '+91 98765 43213', amount: 34125, status: 'Processing', reference: 'PFMS-PENDING-99', updatedAt: '31 Aug 11:45 AM' },
  { id: '3', procurementId: 'PROC-8823', farmerName: 'Jagdish Chand', phone: '+91 98765 43214', amount: 113750, status: 'Pending', reference: '--', updatedAt: '31 Aug 09:15 AM' },
];

export interface CallRecord {
  id: string;
  callSid: string;
  phone: string;
  farmerName: string;
  intent: string;
  duration: string;
  outcome: string;
  status: 'Completed' | 'Failed' | 'Escalated';
  timestamp: string;
}

export const INITIAL_CALLS: CallRecord[] = [
  { id: '1', callSid: 'CA88192031', phone: '+91 98765 43210', farmerName: 'Ramesh Kumar', intent: 'Queue Check', duration: '1m 14s', outcome: 'Answered in Hindi (Queue pos #4)', status: 'Completed', timestamp: '31 Aug 09:30 AM' },
  { id: '2', callSid: 'CA88192032', phone: '+91 98765 43211', farmerName: 'Suresh Verma', intent: 'Slot Reminder', duration: '0m 00s', outcome: 'Unanswered / Busy', status: 'Failed', timestamp: '31 Aug 08:45 AM' },
  { id: '3', callSid: 'CA88192033', phone: '+91 98765 43212', farmerName: 'Baldev Singh', intent: 'Price Query', duration: '2m 05s', outcome: 'Provided Wheat MSP ₹2,275', status: 'Completed', timestamp: '30 Aug 04:15 PM' },
];
