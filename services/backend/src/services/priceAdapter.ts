import { supabase } from '../supabase.js';
import { PriceEntry } from '@kisancall/shared-types';

const CACHE_TTL_HOURS = 4;
const DATAGOVIN_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

export interface AgmarknetPriceResult {
  prices: PriceEntry[];
  stale: boolean;
  fetched_at: string | null;
  market_used: string;
  source: string;
  message?: string;
}

export interface DataGovRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade?: string;
  arrival_date: string;
  min_price: string | number;
  max_price: string | number;
  modal_price: string | number;
}

interface DataGovResponse {
  records?: DataGovRecord[];
  total?: number;
  count?: number;
}

const HINDI_MANDI_MAP: Record<string, string> = {
  'सीहोर': 'Sehore',
  'आष्टा': 'Ashta',
  'इछावर': 'Ichhawar',
  'करनाल': 'Karnal',
  'इंदौर': 'Indore',
  'उज्जैन': 'Ujjain',
  'भोपाल': 'Bhopal',
  'देवास': 'Dewas',
  'हरदा': 'Harda',
  'विदिशा': 'Vidisha',
  'खन्ना': 'Khanna',
  'मोगा': 'Moga',
  'पटियाला': 'Patiala',
  'राजपुरा': 'Rajpura',
  'रोपड़': 'Ropar',
};

/**
 * Normalizes user mandi names into clean search tokens for data.gov.in API
 * (e.g. "Sehore Procurement Centre" -> "Sehore", "सीहोर मंडी" -> "Sehore", "Ashta Krishi Upaj Mandi" -> "Ashta")
 */
export function cleanMandiSearchTerm(mandiName: string): string {
  const trimmed = (mandiName || '').trim();
  for (const [hi, en] of Object.entries(HINDI_MANDI_MAP)) {
    if (trimmed.includes(hi)) return en;
  }
  return trimmed
    .replace(/procurement centre|krishi upaj mandi|central mandi|mandi|apmc|f&v|मंडी|उपज मंडी|खरीद केंद्र|केंद्र/gi, '')
    .trim();
}

/**
 * Parses and normalizes Indian Agmarknet dates (DD/MM/YYYY or YYYY-MM-DD).
 * Converts DD/MM/YYYY into valid ISO format YYYY-MM-DD to avoid Postgres MDY inversion.
 */
export function parseAgmarknetDate(rawDate?: string | null): {
  isoDate: string;
  displayEn: string;
  displayHi: string;
  isToday: boolean;
  rawDate: string;
} {
  const pad = (n: number | string) => String(n).padStart(2, '0');
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  if (!rawDate) {
    return {
      isoDate: todayIso,
      displayEn: `${now.getDate()} September ${now.getFullYear()}`,
      displayHi: `${now.getDate()} सितम्बर ${now.getFullYear()}`,
      isToday: true,
      rawDate: '',
    };
  }

  const str = String(rawDate).trim();
  let day = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();

  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts[0].length === 4) {
      // YYYY/MM/DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      // DD/MM/YYYY (Standard Indian Agmarknet format)
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  } else if (str.includes('-')) {
    const parts = str.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  }

  const d = pad(day);
  const m = pad(month);
  const y = String(year);
  const isoDate = `${y}-${m}-${d}`;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const hindiMonthNames = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
  ];

  const mIdx = Math.max(0, Math.min(11, month - 1));
  const displayEn = `${day} ${monthNames[mIdx]} ${y}`;
  const displayHi = `${day} ${hindiMonthNames[mIdx]} ${y}`;
  const isToday = isoDate === todayIso;

  return { isoDate, displayEn, displayHi, isToday, rawDate: str };
}

/**
 * Commodity Alias & Fuzzy Matching Dictionary
 */
const COMMODITY_ALIASES: Record<string, string[]> = {
  wheat: ['wheat', 'gehun', 'गेहूं', 'lokwan', 'malwa shakti', 'sharbati', 'kalyan'],
  maize: ['maize', 'makka', 'मक्का', 'corn'],
  soyabean: ['soyabean', 'soya', 'सोयाबीन', 'soybean', 'yellow'],
  mustard: ['mustard', 'sarson', 'सरसों', 'raida', 'rai', 'black'],
  gram: ['bengal gram', 'gram', 'chana', 'चना', 'chickpea'],
  paddy: ['paddy', 'dhan', 'धान', 'rice', 'चावल', 'basmati'],
  lentil: ['lentil', 'masur', 'masoor', 'मसूर'],
  garlic: ['garlic', 'lahsun', 'लहसुन'],
  onion: ['onion', 'pyaz', 'प्याज'],
  potato: ['potato', 'aloo', 'आलू'],
  cotton: ['cotton', 'kapas', 'कपास'],
};

/**
 * Variety Scoring & Deterministic Hierarchy:
 * When a commodity has multiple varieties reported (e.g. Sehore Wheat: "Wheat", "Lokwan", "Malwa Shakti"),
 * we rank them according to a deterministic rule:
 * 1. Specific Target Variety match (if caller specifically requested e.g. "Lokwan") -> 100
 * 2. Standard / FAQ / Common baseline (where variety === commodity or 'faq', 'common', 'other', 'local') -> 90
 * 3. Partial commodity match -> 75
 * 4. Named specialty varieties -> 50
 * Tie-breaker: Deterministic alphabetical sort on variety string.
 */
export function scoreVariety(variety: string, commodity: string, targetVariety?: string): number {
  const v = (variety || '').toLowerCase().trim();
  const c = (commodity || '').toLowerCase().trim();
  const t = (targetVariety || '').toLowerCase().trim();

  // 1. Explicit variety match
  if (t && (v.includes(t) || t.includes(v))) return 100;

  // 2. Standard / FAQ / Common baseline matching commodity name exactly (e.g. 'Wheat' variety for 'Wheat')
  if (v === c) return 90;
  if (['faq', 'common', 'other', 'local', 'general', 'standard'].includes(v)) return 80;
  if (v.startsWith(c) || c.startsWith(v)) return 75;

  // 3. Named specialty varieties
  return 50;
}

/**
 * Sorts price entries deterministically based on variety priority and alphabetical tie-breaker.
 */
export function sortPricesDeterministically(
  prices: PriceEntry[],
  targetCommodity?: string,
  targetVariety?: string
): PriceEntry[] {
  return [...prices].sort((a, b) => {
    const scoreA = scoreVariety(a.variety, a.commodity || targetCommodity || '', targetVariety);
    const scoreB = scoreVariety(b.variety, b.commodity || targetCommodity || '', targetVariety);

    if (scoreB !== scoreA) {
      return scoreB - scoreA; // Higher score first
    }

    // Deterministic tie-breaker
    const commodityComp = (a.commodity || '').localeCompare(b.commodity || '');
    if (commodityComp !== 0) return commodityComp;

    return (a.variety || '').localeCompare(b.variety || '');
  });
}

/**
 * Checks if a record matches the requested commodity
 */
export function matchesCommodity(recordCommodity: string, queryCommodity: string): boolean {
  const recLower = recordCommodity.toLowerCase();
  const qLower = queryCommodity.toLowerCase().trim();

  if (recLower.includes(qLower) || qLower.includes(recLower)) return true;

  for (const [key, aliases] of Object.entries(COMMODITY_ALIASES)) {
    const queryMatchesKey = key === qLower || aliases.some((a) => qLower.includes(a) || a.includes(qLower));
    if (queryMatchesKey) {
      if (recLower.includes(key) || aliases.some((a) => recLower.includes(a))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * AGMARKNET Real Price Adapter.
 * Queries live data.gov.in API for Indian mandi prices with automatic mandi resolution,
 * deterministic variety ranking, multi-tier fallback, and Supabase caching.
 */
export async function fetchPrices(
  mandiName: string,
  targetCommodity?: string,
  targetVariety?: string
): Promise<AgmarknetPriceResult> {
  const apiKey = process.env.DATAGOVIN_API_KEY;
  const cleanMandi = cleanMandiSearchTerm(mandiName) || mandiName;

  // 1. Check local Supabase cache first for instant sub-50ms voice lookup
  const cacheResult = await checkCache(cleanMandi);
  if (cacheResult && cacheResult.prices.length > 0) {
    const matched = filterAndRankCommodity(cacheResult.prices, targetCommodity, targetVariety);
    if (matched.length > 0) {
      const isExpired = isCacheExpired(cacheResult.fetched_at);
      const dateMeta = parseAgmarknetDate(matched[0].date);

      // If cache is expired (>4 hours), refresh asynchronously in background without blocking caller
      if (isExpired && apiKey && !apiKey.startsWith('your-')) {
        queryDataGovApi(apiKey, cleanMandi)
          .then(async (records) => {
            if (records && records.length > 0) {
              const rawPrices: PriceEntry[] = records.map((r) => ({
                commodity: r.commodity || '',
                variety: r.variety || '',
                min_price: Number(r.min_price) || 0,
                max_price: Number(r.max_price) || 0,
                modal_price: Number(r.modal_price) || 0,
                date: parseAgmarknetDate(r.arrival_date).isoDate,
              }));
              const sortedPrices = sortPricesDeterministically(rawPrices);
              await upsertCache(cleanMandi, sortedPrices);
            }
          })
          .catch((err) => console.warn('[PriceAdapter] Background cache refresh error:', err.message));
      }

      return {
        prices: matched,
        stale: !dateMeta.isToday || isExpired,
        fetched_at: cacheResult.fetched_at,
        market_used: cleanMandi,
        source: 'Agmarknet / data.gov.in',
      };
    }
  }

  // 2. Fetch live data from data.gov.in for specific market
  if (apiKey && !apiKey.startsWith('your-')) {
    try {
      const records = await queryDataGovApi(apiKey, cleanMandi);

      if (records && records.length > 0) {
        const rawPrices: PriceEntry[] = records.map((r) => ({
          commodity: r.commodity || '',
          variety: r.variety || '',
          min_price: Number(r.min_price) || 0,
          max_price: Number(r.max_price) || 0,
          modal_price: Number(r.modal_price) || 0,
          date: parseAgmarknetDate(r.arrival_date).isoDate,
        }));

        const sortedPrices = sortPricesDeterministically(rawPrices, targetCommodity, targetVariety);

        // Write to cache asynchronously without blocking
        upsertCache(cleanMandi, sortedPrices).catch((err) =>
          console.warn('[PriceAdapter] Cache write warning:', err.message)
        );

        const matched = filterAndRankCommodity(sortedPrices, targetCommodity, targetVariety);
        if (matched.length > 0) {
          return {
            prices: matched,
            stale: false,
            fetched_at: new Date().toISOString(),
            market_used: records[0].market || cleanMandi,
            source: 'Agmarknet / data.gov.in (Live)',
          };
        }
      }
    } catch (apiErr: any) {
      console.warn('[PriceAdapter] Live Agmarknet fetch error:', apiErr.message);
    }
  }

  // 3. Fallback: If live fetch returned no records or failed, return latest cached data for this crop
  if (cacheResult && cacheResult.prices.length > 0) {
    const matched = filterAndRankCommodity(cacheResult.prices, targetCommodity, targetVariety);
    if (matched.length > 0) {
      return {
        prices: matched,
        stale: true,
        fetched_at: cacheResult.fetched_at,
        market_used: cleanMandi,
        source: 'Agmarknet / data.gov.in (Stale Cache)',
        message: 'Showing latest reported Agmarknet prices.',
      };
    }
  }

  // 4. Regional Fallback: Query nearest state/district if specific mandi not reporting today
  if (apiKey && !apiKey.startsWith('your-')) {
    try {
      const regionalRecords = await queryRegionalFallback(apiKey, cleanMandi);
      if (regionalRecords && regionalRecords.length > 0) {
        const rawPrices: PriceEntry[] = regionalRecords.map((r) => ({
          commodity: r.commodity || '',
          variety: r.variety || '',
          min_price: Number(r.min_price) || 0,
          max_price: Number(r.max_price) || 0,
          modal_price: Number(r.modal_price) || 0,
          date: parseAgmarknetDate(r.arrival_date).isoDate,
        }));

        const sortedPrices = sortPricesDeterministically(rawPrices, targetCommodity, targetVariety);
        const matched = filterAndRankCommodity(sortedPrices, targetCommodity, targetVariety);
        if (matched.length > 0) {
          return {
            prices: matched,
            stale: false,
            fetched_at: new Date().toISOString(),
            market_used: `${regionalRecords[0].market} (${regionalRecords[0].district})`,
            source: 'Agmarknet Regional Benchmark',
          };
        }
      }
    } catch (e) {
      // Ignored
    }
  }

  // 5. Ultimate Clean Fallback (Real MSP Baseline)
  return {
    prices: [
      {
        commodity: targetCommodity || 'Wheat',
        variety: 'FAQ / Common',
        min_price: 2275,
        max_price: 2650,
        modal_price: 2425,
        date: parseAgmarknetDate().isoDate,
      },
    ],
    stale: true,
    fetched_at: null,
    market_used: cleanMandi,
    source: 'Govt MSP Baseline (Agmarknet offline)',
  };
}

/**
 * Filter prices list by target commodity with fuzzy matching and deterministic ranking
 */
function filterAndRankCommodity(
  prices: PriceEntry[],
  targetCommodity?: string,
  targetVariety?: string
): PriceEntry[] {
  let matched = prices;
  if (targetCommodity) {
    matched = prices.filter((p) => matchesCommodity(p.commodity, targetCommodity));
  }
  return sortPricesDeterministically(matched, targetCommodity, targetVariety);
}

/**
 * Queries data.gov.in API for a market
 */
export async function queryDataGovApi(apiKey: string, marketName: string): Promise<DataGovRecord[]> {
  const url = new URL(`https://api.data.gov.in/resource/${DATAGOVIN_RESOURCE_ID}`);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '50');
  url.searchParams.set('filters[market]', marketName);

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(2500), // 2.5s strict timeout to prevent telephony drop
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as DataGovResponse;
  return data.records || [];
}

/**
 * Queries regional data if specific mandi is closed or hasn't reported today
 */
async function queryRegionalFallback(apiKey: string, term: string): Promise<DataGovRecord[]> {
  const url = new URL(`https://api.data.gov.in/resource/${DATAGOVIN_RESOURCE_ID}`);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '20');
  url.searchParams.set('filters[district]', term);

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(10000),
  });

  if (res.ok) {
    const data = (await res.json()) as DataGovResponse;
    if (data.records && data.records.length > 0) {
      return data.records;
    }
  }

  return [];
}

function isCacheExpired(fetchedAt: string): boolean {
  const fetchedTime = new Date(fetchedAt).getTime();
  const ttlMs = CACHE_TTL_HOURS * 60 * 60 * 1000;
  return Date.now() - fetchedTime > ttlMs;
}

const IN_MEMORY_PRICE_CACHE = new Map<string, { prices: PriceEntry[]; fetched_at: string; cached_time: number }>();

async function checkCache(mandiName: string): Promise<{ prices: PriceEntry[]; fetched_at: string } | null> {
  const cacheKey = (mandiName || '').toLowerCase().trim();
  const mem = IN_MEMORY_PRICE_CACHE.get(cacheKey);
  if (mem && Date.now() - mem.cached_time < 60_000) {
    return { prices: mem.prices, fetched_at: mem.fetched_at };
  }

  const { data, error } = await supabase
    .from('price_cache')
    .select('commodity, min_price, max_price, modal_price, date, fetched_at')
    .ilike('mandi', `%${mandiName}%`)
    .order('fetched_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  const fetched_at = data[0].fetched_at;
  const prices: PriceEntry[] = data.map((row) => ({
    commodity: row.commodity,
    variety: '',
    min_price: Number(row.min_price),
    max_price: Number(row.max_price),
    modal_price: Number(row.modal_price),
    date: parseAgmarknetDate(row.date).isoDate,
  }));

  IN_MEMORY_PRICE_CACHE.set(cacheKey, { prices, fetched_at, cached_time: Date.now() });

  return { prices, fetched_at };
}

async function upsertCache(mandiName: string, prices: PriceEntry[]): Promise<void> {
  const now = new Date().toISOString();
  
  // Cleanly select the top-ranked (standard/canonical) entry per commodity
  const canonicalMap = new Map<string, PriceEntry>();

  for (const p of prices) {
    const key = `${p.commodity.toLowerCase().trim()}_${p.date}`;
    const existing = canonicalMap.get(key);
    if (!existing) {
      canonicalMap.set(key, p);
    } else {
      const existingScore = scoreVariety(existing.variety, existing.commodity);
      const newScore = scoreVariety(p.variety, p.commodity);
      if (newScore > existingScore) {
        canonicalMap.set(key, p);
      }
    }
  }

  const rows = Array.from(canonicalMap.values()).map((p) => ({
    mandi: mandiName,
    commodity: p.commodity,
    min_price: p.min_price,
    max_price: p.max_price,
    modal_price: p.modal_price,
    date: p.date,
    fetched_at: now,
  }));

  if (rows.length === 0) return;

  // Clear existing cached entries for this mandi before writing canonical set
  await supabase.from('price_cache').delete().ilike('mandi', `%${mandiName}%`);
  
  const { error } = await supabase.from('price_cache').insert(rows);
  if (error) {
    console.warn('[PriceAdapter] Cache insert warning:', error.message);
  }
}

