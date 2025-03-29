import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cek apakah URL Supabase valid
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Hanya buat klien jika URL valid
export const supabase = isValidUrl(supabaseUrl) 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export const getServerSupabase = () => supabase; 