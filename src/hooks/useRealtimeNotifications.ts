import { useEffect } from 'react';
import { supabase } from '../context/supabaseClient';

type RealtimeEvent = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: any;
  old: any;
};

export const useRealtimeNotifications = (
  table: string,
  onEvent: (event: RealtimeEvent) => void
) => {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          onEvent({
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [table, onEvent]);
};
