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

// --- Phase 1 additions ---

/** Row in the user_roles table mapping Supabase Auth users to application roles */
export interface UserRoleRecord {
  id: string;
  auth_user_id: string;
  role: UserRole;
  created_at: string;
}

/** Price data returned from the AGMARKNET adapter */
export interface PriceEntry {
  commodity: string;
  variety: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  date: string;
}

/** Response shape for GET /mandis/:id/prices */
export interface PriceResponse {
  mandi_id: string;
  mandi_name: string;
  prices: PriceEntry[];
  stale: boolean;
  fetched_at: string | null;
  message?: string;
}

/** Authenticated user attached to req.user after JWT verification */
export interface AuthenticatedUser {
  id: string;
  phone: string;
  role: UserRole;
}

import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';

/**
 * Reusable Supabase client factory helper shared across KisanCall apps and services.
 */
export function createSupabaseClient(
  url?: string,
  anonKey?: string,
  options?: SupabaseClientOptions<any>
): SupabaseClient {
  const finalUrl = url || 'https://placeholder.supabase.co';
  const finalKey = anonKey || 'placeholder-anon-key';
  return createClient(finalUrl, finalKey, options);
}

/**
 * Standardized Supabase Realtime channel naming convention.
 * - queue:{mandiId} -> Live queue updates for a mandi
 * - status:{farmerId} -> Individual farmer slot/procurement status updates
 * - procurement:{procurementId} -> Procurement verification updates
 * - prices:{mandiId} -> Mandi price cache updates
 */
export const REALTIME_CHANNELS = {
  queue: (mandiId: string) => `queue:${mandiId}`,
  farmerStatus: (farmerId: string) => `status:${farmerId}`,
  procurement: (procurementId: string) => `procurement:${procurementId}`,
  prices: (mandiId: string) => `prices:${mandiId}`,
};

/**
 * Reusable Supabase Realtime subscription helper.
 */
export function subscribeToChannel(
  supabaseClient: SupabaseClient,
  channelName: string,
  eventConfig: { table: string; filter?: string; event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*' },
  onData: (payload: any) => void
) {
  if (!supabaseClient || typeof supabaseClient.channel !== 'function') {
    console.warn(`[Realtime Helper] Supabase client unavailable for channel: ${channelName}`);
    return () => {};
  }

  const channel = supabaseClient
    .channel(channelName)
    .on(
      'postgres_changes' as any,
      {
        event: eventConfig.event || '*',
        schema: 'public',
        table: eventConfig.table,
        filter: eventConfig.filter,
      },
      (payload: any) => {
        console.log(`[Realtime Update] Channel ${channelName}:`, payload);
        onData(payload);
      }
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(channel);
  };
}

