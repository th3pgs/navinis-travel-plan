import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://znkfcncwophzdhrkktdh.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_SjzVjUMOntXBAnPYSLFVhQ_IwrfjQHC';
export const STORAGE_BUCKET = 'travel-media';
export const STATE_TABLE = 'app_state';
export const STATE_ROW_ID = 'main_plan';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
