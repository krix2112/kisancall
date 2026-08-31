// TODO: Consolidate Supabase client setup into shared package helper if needed
import { createSupabaseClient } from '@kisancall/shared-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
