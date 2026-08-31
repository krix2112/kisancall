import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validate that all required environment variables are present.
 * Throws a fatal error listing exactly which vars are missing.
 * Must be called before any Supabase client usage.
 */
export function validateEnv(): void {
  const required: Record<string, string | undefined> = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATAGOVIN_API_KEY: process.env.DATAGOVIN_API_KEY,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value || value.trim() === '' || value.startsWith('your-'))
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `FATAL: Missing required environment variables: ${missing.join(', ')}. ` +
      `The application cannot start without these. ` +
      `Set them in services/backend/.env or as system environment variables.`
    );
  }
}

// Validate immediately on import — fail before anything else runs
validateEnv();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Supabase client initialized with the service-role key.
 * This bypasses Row Level Security for server-side operations.
 * Never expose this client or key to the frontend.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
