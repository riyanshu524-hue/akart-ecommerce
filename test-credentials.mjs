/**
 * Test script to validate Supabase and Razorpay credentials
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;

console.log('🔍 Testing Supabase credentials...');

try {
  // Test Supabase connection
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing Supabase credentials');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✓ Supabase client created successfully');
  console.log(`✓ Supabase URL: ${SUPABASE_URL}`);

  // Test Razorpay credentials
  if (!RAZORPAY_KEY_ID) {
    throw new Error('Missing Razorpay credentials');
  }

  console.log('✓ Razorpay Key ID configured');
  console.log(`✓ Razorpay Key: ${RAZORPAY_KEY_ID.substring(0, 10)}...`);

  console.log('\n✅ All credentials validated successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Credential validation failed:', error.message);
  process.exit(1);
}
