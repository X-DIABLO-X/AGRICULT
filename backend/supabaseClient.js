import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and Anon Key
const SUPABASE_URL = 'https://pojuqqnftsunpiutlyrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvanVxcW5mdHN1bnBpdXRseXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODAwOTIsImV4cCI6MjA1MDI1NjA5Mn0.0QASIiNcOib_pClL7XMi45_MoK3cMNjLbmvfhp982UQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
