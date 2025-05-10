// hooks/useSSE.ts
import { useEffect } from 'react';
import { BASE_URL } from '@/lib/api/axios';
import { SERVER_SENT_EVENTS } from '@/lib/constants';

type Callback<T> = (data: T) => void;

// Manage listeners per EventSource instance
const listeners = new Map<SERVER_SENT_EVENTS, Set<Callback<unknown>>>();

export function useSSE(connectionPath: string) {
  useEffect(() => {
    const source = new EventSource(`${BASE_URL}${connectionPath}`);

    source.onmessage = (event) => {
      if (!event.data) return;

      try {
        const parsed = JSON.parse(event.data);
        const message = parsed.message as SERVER_SENT_EVENTS;
        const callbacks = listeners.get(message);
        if (callbacks) {
          callbacks.forEach((cb) => cb(parsed));
        }
      } catch (e) {
        console.error('Failed to parse SSE message:', e);
      }
    };

    return () => {
      source.close();
    };
  }, [connectionPath]);
}

export function subscribeSSE<T>(
  event: SERVER_SENT_EVENTS,
  callback: Callback<T>
): () => void {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }

  listeners.get(event)!.add(callback as Callback<unknown>);

  return () => {
    listeners.get(event)?.delete(callback as Callback<unknown>);
    if (listeners.get(event)?.size === 0) {
      listeners.delete(event);
    }
  };
}
