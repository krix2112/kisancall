import { supabase } from '../supabase.js';
import { PriceEntry } from '@kisancall/shared-types';

const CACHE_TTL_HOURS = 6;
const DATAGOVIN_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

/**
 * AGMARKNET price adapter.
 * Fetches mandi commodity prices from data.gov.in with cache-first strategy.
 *
 * - Checks price_cache table first
 * - On cache miss/expiry, calls the live API
 * - On API failure with stale cache, returns stale data with stale: true
 * - Never falls back to hardcoded price lists
 */
export async function fetchPrices(mandiName: string): Promise<{
  prices: PriceEntry[];
  stale: boolean;
  fetched_at: string | null;
  message?: string;
}> {
  const apiKey = process.env.DATAGOVIN_API_KEY!;
  const today = new Date().toISOString().split('T')[0];

  // 1. Check cache first
  const cacheResult = await checkCache(mandiName);
  if (cacheResult && !isCacheExpired(cacheResult.fetched_at)) {
    return {
      prices: cacheResult.prices,
      stale: false,
      fetched_at: cacheResult.fetched_at,
    };
  }

  // 2. Cache miss or expired — call live API
  try {
    const url = new URL(`https://api.data.gov.in/resource/${DATAGOVIN_RESOURCE_ID}`);
    url.searchParams.set('api-key', apiKey);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '100');
    url.searchParams.set('filters[market]', mandiName);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) {
      throw new Error(`data.gov.in API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as DataGovResponse;

    if (!data.records || !Array.isArray(data.records)) {
      throw new Error('Unexpected API response format: missing records array');
    }

    const prices: PriceEntry[] = data.records.map((record: DataGovRecord) => ({
      commodity: record.commodity || '',
      variety: record.variety || '',
      min_price: parseFloat(record.min_price) || 0,
      max_price: parseFloat(record.max_price) || 0,
      modal_price: parseFloat(record.modal_price) || 0,
      date: record.arrival_date || today,
    }));

    // 3. Upsert into cache
    await upsertCache(mandiName, prices);

    return {
      prices,
      stale: false,
      fetched_at: new Date().toISOString(),
    };
  } catch (apiError) {
    // API failed — return stale cache if available
    if (cacheResult) {
      return {
        prices: cacheResult.prices,
        stale: true,
        fetched_at: cacheResult.fetched_at,
        message: 'Price data temporarily unavailable. Showing cached data.',
      };
    }

    // No cache and API failed — return empty with clear error
    return {
      prices: [],
      stale: true,
      fetched_at: null,
      message: 'Price data temporarily unavailable. No cached data available.',
    };
  }
}

// ---- Internal helpers ----

interface CacheResult {
  prices: PriceEntry[];
  fetched_at: string;
}

interface DataGovResponse {
  records: DataGovRecord[];
  total: number;
  count: number;
}

interface DataGovRecord {
  market: string;
  commodity: string;
  variety: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  arrival_date: string;
  state: string;
  district: string;
}

function isCacheExpired(fetchedAt: string): boolean {
  const fetchedTime = new Date(fetchedAt).getTime();
  const now = Date.now();
  const ttlMs = CACHE_TTL_HOURS * 60 * 60 * 1000;
  return now - fetchedTime > ttlMs;
}

async function checkCache(mandiName: string): Promise<CacheResult | null> {
  const { data, error } = await supabase
    .from('price_cache')
    .select('commodity, min_price, max_price, modal_price, date, fetched_at')
    .eq('mandi', mandiName)
    .order('fetched_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  // Use the most recent fetched_at as the cache timestamp
  const fetched_at = data[0].fetched_at;

  const prices: PriceEntry[] = data.map((row) => ({
    commodity: row.commodity,
    variety: '', // Cache doesn't store variety separately; returned as empty
    min_price: parseFloat(row.min_price),
    max_price: parseFloat(row.max_price),
    modal_price: parseFloat(row.modal_price),
    date: row.date,
  }));

  return { prices, fetched_at };
}

async function upsertCache(mandiName: string, prices: PriceEntry[]): Promise<void> {
  const now = new Date().toISOString();

  const rows = prices.map((p) => ({
    mandi: mandiName,
    commodity: p.commodity,
    min_price: p.min_price,
    max_price: p.max_price,
    modal_price: p.modal_price,
    date: p.date,
    fetched_at: now,
  }));

  if (rows.length === 0) return;

  // Upsert using the unique index on (mandi, commodity, date)
  const { error } = await supabase
    .from('price_cache')
    .upsert(rows, { onConflict: 'mandi,commodity,date' });

  if (error) {
    // Log but don't throw — cache write failure shouldn't break the response
    console.error('Failed to write price cache:', error.message);
  }
}
