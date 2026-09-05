/**
 * seedRealMandis.ts
 * One-off script: fetches real APMC market data from data.gov.in AGMARKNET
 * variety-wise price dataset (9ef84268-d588-465a-a308-a864a43d0070),
 * deduplicates by (market, district), and inserts ~30-50 real mandis into
 * the `mandis` table.
 *
 * Run: npx tsx scripts/seedRealMandis.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATAGOVIN_API_KEY = process.env.DATAGOVIN_API_KEY!;
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DATAGOVIN_API_KEY) {
  console.error('Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATAGOVIN_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface DataGovRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  arrival_date: string;
}

interface DataGovResponse {
  records: DataGovRecord[];
  total: number;
  count: number;
}

// Target states to fetch from — major agricultural states of India
const TARGET_STATES = ['Haryana', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Maharashtra'];

async function fetchMandiRecordsForState(state: string, limit: number = 500): Promise<DataGovRecord[]> {
  const url = new URL(`https://api.data.gov.in/resource/${RESOURCE_ID}`);
  url.searchParams.set('api-key', DATAGOVIN_API_KEY);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('filters[state]', state);

  console.log(`  Fetching ${state}...`);

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    console.warn(`  ⚠️  ${state}: API returned ${response.status} ${response.statusText}`);
    return [];
  }

  const data = await response.json() as DataGovResponse;

  if (!data.records || !Array.isArray(data.records)) {
    console.warn(`  ⚠️  ${state}: No records in response`);
    return [];
  }

  console.log(`  ✓ ${state}: ${data.records.length} records (total available: ${data.total})`);
  return data.records;
}

interface MandiCandidate {
  name: string;
  district: string;
  state: string;
}

function deduplicateMandis(records: DataGovRecord[]): MandiCandidate[] {
  const seen = new Set<string>();
  const mandis: MandiCandidate[] = [];

  for (const record of records) {
    const market = (record.market || '').trim();
    const district = (record.district || '').trim();
    const state = (record.state || '').trim();

    if (!market || !district) continue;

    const key = `${market.toLowerCase()}||${district.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      mandis.push({ name: market, district, state });
    }
  }

  return mandis;
}

function pickRandomDefault(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getExistingMandiNames(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('mandis')
    .select('name, district');

  if (error) {
    console.warn('Could not fetch existing mandis:', error.message);
    return new Set();
  }

  const existing = new Set<string>();
  for (const row of (data || [])) {
    existing.add(`${(row.name || '').toLowerCase()}||${(row.district || '').toLowerCase()}`);
  }
  return existing;
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   KisanCall — Seed Real APMC Mandis               ║');
  console.log('║   Source: data.gov.in AGMARKNET variety-wise data ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Step 1: Fetch records from multiple states
  console.log('Step 1: Fetching AGMARKNET records from major states...');
  const allRecords: DataGovRecord[] = [];

  for (const state of TARGET_STATES) {
    const records = await fetchMandiRecordsForState(state, 500);
    allRecords.push(...records);
    // Small delay to be polite to the API
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nTotal raw records fetched: ${allRecords.length}`);

  // Step 2: Deduplicate by (market, district)
  console.log('\nStep 2: Deduplicating mandis by (name, district)...');
  const allMandis = deduplicateMandis(allRecords);
  console.log(`Unique (mandi, district) combinations: ${allMandis.length}`);

  // Step 3: Get existing mandis to skip duplicates
  console.log('\nStep 3: Checking existing mandis in Supabase...');
  const existingMandis = await getExistingMandiNames();
  console.log(`Already in DB: ${existingMandis.size} mandis`);

  // Step 4: Filter out already-existing mandis
  const newMandis = allMandis.filter(m => {
    const key = `${m.name.toLowerCase()}||${m.district.toLowerCase()}`;
    return !existingMandis.has(key);
  });
  console.log(`New mandis to insert: ${newMandis.length}`);

  if (newMandis.length === 0) {
    console.log('\n✓ All fetched mandis already exist in the DB. Nothing to insert.');
    return;
  }

  // Step 5: Limit to 50 mandis — pick a good spread across states
  const TARGET_COUNT = 50;

  // Sort by state to get spread, then slice
  const sortedMandis = newMandis.sort((a, b) => a.state.localeCompare(b.state));

  // Try to get ~10 per state evenly
  const perStateBucket: Record<string, MandiCandidate[]> = {};
  for (const m of sortedMandis) {
    if (!perStateBucket[m.state]) perStateBucket[m.state] = [];
    perStateBucket[m.state].push(m);
  }

  const selected: MandiCandidate[] = [];
  const statesInData = Object.keys(perStateBucket);
  const perStateQuota = Math.ceil(TARGET_COUNT / statesInData.length);

  for (const state of statesInData) {
    const bucket = perStateBucket[state] || [];
    selected.push(...bucket.slice(0, perStateQuota));
    if (selected.length >= TARGET_COUNT) break;
  }

  const finalMandis = selected.slice(0, TARGET_COUNT);
  console.log(`\nStep 4: Inserting ${finalMandis.length} real mandis (capped at ${TARGET_COUNT})...\n`);

  // Step 6: Insert in batches
  const BATCH_SIZE = 10;
  const inserted: Array<{ id: string; name: string; district: string }> = [];
  const failed: MandiCandidate[] = [];

  for (let i = 0; i < finalMandis.length; i += BATCH_SIZE) {
    const batch = finalMandis.slice(i, i + BATCH_SIZE);

    const rows = batch.map(m => ({
      name: m.name,
      district: m.district,
      // Realistic defaults — not in source data
      daily_capacity: pickRandomDefault(150, 300),
      working_hours: '09:00-18:00',
    }));

    const { data, error } = await supabase
      .from('mandis')
      .insert(rows)
      .select('id, name, district');

    if (error) {
      console.error(`  ✗ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed: ${error.message}`);
      // Try to insert one-by-one to find which ones fail (e.g. name duplicates)
      for (const row of rows) {
        const { data: singleData, error: singleErr } = await supabase
          .from('mandis')
          .insert(row)
          .select('id, name, district')
          .single();

        if (singleErr) {
          console.warn(`    ✗ "${row.name}" (${row.district}): ${singleErr.message}`);
          failed.push(batch[rows.indexOf(row)]);
        } else if (singleData) {
          inserted.push(singleData);
        }
      }
    } else if (data) {
      inserted.push(...data);
      process.stdout.write(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(finalMandis.length / BATCH_SIZE)} inserted (${inserted.length} so far)\r`);
    }
  }

  // Step 7: Print results
  console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
  console.log(`║  ✅ Successfully inserted ${String(inserted.length).padEnd(3)} real APMC mandis           ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log('Inserted Mandis:');
  console.log('─'.repeat(70));
  console.log(`${'#'.padEnd(4)} ${'Mandi Name'.padEnd(35)} ${'District'.padEnd(25)} ${'ID (short)'}`);
  console.log('─'.repeat(70));

  for (let i = 0; i < inserted.length; i++) {
    const m = inserted[i];
    const shortId = m.id.slice(0, 8) + '...';
    console.log(
      `${String(i + 1).padEnd(4)} ${m.name.slice(0, 34).padEnd(35)} ${m.district.slice(0, 24).padEnd(25)} ${shortId}`
    );
  }

  console.log('─'.repeat(70));
  console.log(`\nTotal in DB now: ${existingMandis.size + inserted.length} mandis`);

  if (failed.length > 0) {
    console.log(`\n⚠️  ${failed.length} mandis could not be inserted (see warnings above)`);
  }

  console.log('\n✅ Done! You can now use these real mandi IDs for farmer preferred_mandi_id lookups.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
