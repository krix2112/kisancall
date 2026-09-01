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
    PROOF_ANCHOR_CONTRACT_ADDRESS: process.env.PROOF_ANCHOR_CONTRACT_ADDRESS,
    SHARDEUM_RPC_URL: process.env.SHARDEUM_RPC_URL,
    PROOF_ANCHOR_WALLET_KEY: process.env.PROOF_ANCHOR_WALLET_KEY,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => {
      if (!value || value.trim() === '' || value.startsWith('your-')) return true;
      // Reject the all-zero sentinel address for the contract
      if (value === '0x0000000000000000000000000000000000000000') return true;
      // Reject the all-zero private key (zero/dummy key)
      if (value === '0x0000000000000000000000000000000000000000000000000000000000000000') return true;
      return false;
    })
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
