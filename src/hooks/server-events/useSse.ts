// hooks/useSSE.ts
import { useEffect } from 'react';
import { BASE_URL } from '@/lib/api/axios';
import { SERVER_SENT_EVENTS } from '@/lib/constants';

type Callback<T> = (data: T) => void;

// Manage listeners per EventSource instance
const listeners = new Map<SERVER_SENT_EVENTS, Set<Callback<unknown>>>();

// Function to get the access token
const getAccessToken = () => {
  const session = localStorage.getItem('sb-auth-token');
  if (session) {
    try {
      const { access_token } = JSON.parse(session);
      return access_token;
    } catch (error) {
      console.error('Error parsing session:', error);
      return null;
    }
  }
  return null;
};

export function useSSE(connectionPath: string) {
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.error('No access token available for SSE connection');
      return;
    }

    // Add token as a query parameter
    const url = new URL(`${BASE_URL}${connectionPath}`);
    url.searchParams.append('token', token);

    console.log('Connecting to SSE:', url.toString());

    const source = new EventSource(url.toString());

    // Handle connection open
    source.onopen = () => {
      console.log('SSE connection opened');
    };

    // Handle specific events
    Object.values(SERVER_SENT_EVENTS).forEach((eventType) => {
      source.addEventListener(eventType, (event) => {
        console.log(`Received ${eventType} event:`, event.data);
        if (!event.data) return;

        try {
          const parsed = JSON.parse(event.data);
          const callbacks = listeners.get(eventType as SERVER_SENT_EVENTS);
          if (callbacks) {
            callbacks.forEach((cb) => cb(parsed));
          }
        } catch (e) {
          console.error(`Failed to parse ${eventType} message:`, e);
        }
      });
    });

    // Handle general messages
    source.onmessage = (event) => {
      console.log('Received general message:', event.data);
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

    source.onerror = (error) => {
      console.error('SSE connection error:', error);
      // Try to reconnect after a delay
      setTimeout(() => {
        console.log('Attempting to reconnect SSE...');
        source.close();
        // The EventSource will automatically try to reconnect
      }, 5000);
    };

    return () => {
      console.log('Closing SSE connection');
      source.close();
    };
  }, [connectionPath]);
}

export function subscribeSSE<T>(
  event: SERVER_SENT_EVENTS,
  callback: Callback<T>
): () => void {
  console.log(`Subscribing to SSE event: ${event}`);

  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }

  const eventListeners = listeners.get(event);
  if (eventListeners) {
    eventListeners.add(callback as Callback<unknown>);
  }

  return () => {
    console.log(`Unsubscribing from SSE event: ${event}`);
    listeners.get(event)?.delete(callback as Callback<unknown>);
    if (listeners.get(event)?.size === 0) {
      listeners.delete(event);
    }
  };
}
