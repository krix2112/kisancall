import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

    let errorMsg = `HTTP Error ${res.status}`;
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

export const staffApi = {
  markArrived: async (bookingId: string): Promise<any> => {
    const res = await fetch(`${API_URL}/staff/arrivals`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ booking_id: bookingId }),
    });
    return handleResponse(res);
  },

  submitProcurement: async (bookingId: string, data: any): Promise<any> => {
    const res = await fetch(`${API_URL}/staff/procurement`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ booking_id: bookingId, ...data }),
    });
    return handleResponse(res);
  },

  processPayment: async (paymentId: string, data: any): Promise<any> => {
    const res = await fetch(`${API_URL}/payments/${paymentId}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  }
};
