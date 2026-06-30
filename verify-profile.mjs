import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('email', 'realsupabase@test.com')
  .single();

if (error) {
  console.log('❌ Profile NOT found:', error.message);
} else {
  console.log('✅ Profile FOUND in Supabase:');
  console.log(JSON.stringify(data, null, 2));
}
