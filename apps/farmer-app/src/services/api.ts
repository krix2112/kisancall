import { Booking, QueueEvent, FarmerStatusResponse } from '@kisancall/shared-types';
import { supabase } from '../supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiError {
  error: string;
  message: string;
}

export class NotAuthenticatedError extends Error {
  constructor(message = 'Not authenticated') {
    super(message);
    this.name = 'NotAuthenticatedError';
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      throw new NotAuthenticatedError('Please log in to continue.');
    }
    
    let errorMsg = 'An unexpected error occurred';
    try {
      const errBody = await res.json();
      errorMsg = errBody.message || errBody.error || errorMsg;
    } catch {
      // Ignored
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const farmerApi = {
  /** Phase 3: Create a booking */
  createBooking: async (farmerId: string, slotId: string): Promise<Booking> => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ farmer_id: farmerId, slot_id: slotId }),
    });
    return handleResponse<Booking>(res);
  },

  /** Phase 5: Get live queue position */
  getQueuePosition: async (farmerId: string): Promise<{
    farmer_id: string;
    booking_id: string;
    token: string;
    position: number;
    estimated_wait_minutes: number | null;
    latest_event: QueueEvent | null;
  }> => {
    const res = await fetch(`${API_URL}/farmers/${farmerId}/queue`, {
      headers: await getAuthHeaders(),
    });
    return handleResponse(res);
  },

  /** Phase 8: Get aggregate status */
  getStatus: async (farmerId: string): Promise<FarmerStatusResponse> => {
    const res = await fetch(`${API_URL}/farmers/${farmerId}/status`, {
      headers: await getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
