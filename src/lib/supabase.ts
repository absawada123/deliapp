/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';
// Ensure this path matches where you created the file. 
// If src/types/supabase.ts exists, this is correct.
import { Database } from '../types/supabase'; 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
