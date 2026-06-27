/**
 * Supabase Client - Server-side database operations
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin client with service role (for server-side operations)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Anon client (for client-side operations)
const SUPABASE_KEY = process.env.SUPABASE_KEY;
export const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_KEY);

export { createClient };
