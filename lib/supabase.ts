// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);


export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  color: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};