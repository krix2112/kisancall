export type UserRole = 'farmer' | 'operator' | 'supervisor' | 'admin';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type ProcurementStatus = 'pending' | 'in_progress' | 'verified' | 'rejected';
export type QualityStatus = 'grade_a' | 'grade_b' | 'grade_c' | 'rejected';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type CallDirection = 'inbound' | 'outbound';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  language: string;
  preferred_mandi_id?: string;
  crop?: string;
}

export interface Mandi {
  id: string;
  name: string;
  district: string;
  daily_capacity: number;
  working_hours: string;
}

export interface Slot {
  id: string;
  mandi_id: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
}

export interface Booking {
  id: string;
  farmer_id: string;
  slot_id: string;
  status: BookingStatus;
  token: string;
}

export interface QueueEvent {
  booking_id: string;
  event_type: string;
  timestamp: string;
  sequence: number;
}

export interface Procurement {
  booking_id: string;
  quantity: number;
  price: number;
  quality_status: QualityStatus;
  status: ProcurementStatus;
}

export interface Payment {
  procurement_id: string;
  status: PaymentStatus;
  reference: string;
  updated_at: string;
}

export interface PriceCache {
  mandi: string;
  commodity: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  date: string;
  fetched_at: string;
}

export interface Call {
  farmer_id: string;
  direction: CallDirection;
  intent: string;
  outcome: string;
  duration: number;
  timestamp: string;
}

export interface ProofEvent {
  procurement_id: string;
  event_type: string;
  payload_hash: string;
  chain_tx_hash: string;
}

export interface AuditLog {
  actor: string;
  action: string;
  entity: string;
  old_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  timestamp: string;
}
