const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let supabaseAdmin = null;
let isConfigured = false;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey);
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    isConfigured = true;
    console.log('[Supabase] Successfully initialized Supabase client with live credentials.');
  } catch (error) {
    console.warn('[Supabase] Failed to initialize live client:', error.message);
  }
} else {
  console.log('[Supabase] No live credentials configured. Running in high-fidelity local fallback mode.');
}

module.exports = {
  supabase,
  supabaseAdmin,
  isConfigured
};
