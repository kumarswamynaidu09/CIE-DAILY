import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sibrgtmehwcrsnqvbagb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_4h381wGM0paE2W5KGh9uhg_bOVvdngf';

export const supabase = createClient(supabaseUrl, supabaseKey);