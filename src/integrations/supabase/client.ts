
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hhpkdfkyzpjwpnbgrdzr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhocGtkZmt5enBqd3BuYmdyZHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODM1NjMsImV4cCI6MjA1OTM1OTU2M30.4tsTp0f8wdt8RzNH2y6esA9P0WtYzzjBagY67ZTW85w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
