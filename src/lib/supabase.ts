import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to subscribe to real-time events
export const subscribeToRealtimeEvents = (
  table: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: table,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};
