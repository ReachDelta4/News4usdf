import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SUPABASE_MISSING_CONFIG = !supabaseUrl || !supabaseAnonKey;

function createStubClient(): any {
  const error = new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const handler: ProxyHandler<any> = {
    get: () => () => { throw error; }
  };
  return new Proxy({}, handler);
}

export const supabase = SUPABASE_MISSING_CONFIG
  ? createStubClient()
  : createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
