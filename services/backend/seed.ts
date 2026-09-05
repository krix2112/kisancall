import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function run() {
  console.log('Inserting mandi...');
  const { data: mandi, error: err1 } = await supabase
    .from('mandis')
    .insert({
      name: 'Karnal Mandi',
      district: 'Karnal',
      daily_capacity: 200,
      working_hours: '09:00-18:00'
    })
    .select('id')
    .single();

  if (err1) {
    console.error('Error inserting mandi:', err1);
    return;
  }
  console.log('Mandi ID:', mandi.id);

  console.log('Inserting slot...');
  const today = new Date().toISOString().split('T')[0];
  const { data: slot, error: err2 } = await supabase
    .from('slots')
    .insert({
      mandi_id: mandi.id,
      date: today,
      start_time: '09:00:00',
      end_time: '12:00:00',
      capacity: 50
    })
    .select('id')
    .single();

  if (err2) {
    console.error('Error inserting slot:', err2);
    return;
  }
  console.log('Slot ID:', slot.id);

  console.log('Inserting farmer...');
  const { data: farmer, error: err3 } = await supabase
    .from('farmers')
    .insert({
      name: 'Test Farmer',
      phone: '+919999999999',
      language: 'hi',
      preferred_mandi_id: mandi.id,
      crop: 'Wheat'
    })
    .select('id')
    .single();

  if (err3) {
    console.error('Error inserting farmer:', err3);
    return;
  }
  console.log('Farmer ID:', farmer.id);

  console.log('Inserting booking...');
  const { data: booking, error: err4 } = await supabase
    .from('bookings')
    .insert({
      farmer_id: farmer.id,
      slot_id: slot.id,
      status: 'confirmed',
      token: 'TEST-BOOKING-001'
    })
    .select('id')
    .single();

  if (err4) {
    console.error('Error inserting booking:', err4);
    return;
  }
  console.log('Booking ID:', booking.id);
  
  console.log('--- UUIDS ---');
  console.log('MANDI_ID=' + mandi.id);
  console.log('SLOT_ID=' + slot.id);
  console.log('FARMER_ID=' + farmer.id);
  console.log('BOOKING_ID=' + booking.id);
}

run();
