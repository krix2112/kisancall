import { supabase } from '../dist/supabase.js';

async function main() {
  console.log('Checking Supabase connection...');
  const { data: test, error: testErr } = await supabase.from('mandis').select('id, name');
  console.log('Mandis in DB:', test?.length, 'Error:', testErr?.message);

  // Check if price_history exists
  const { data: ph, error: phErr } = await supabase.from('price_history').select('id').limit(1);
  console.log('price_history query result:', { hasData: Boolean(ph), error: phErr?.message });
}

main().catch(console.error);
