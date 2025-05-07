import { useEffect, useRef } from 'react';
import { BASE_URL } from '@/lib/api/axios';
import { SSE_TOPIC } from './seeTopics';

type EventPayload = {
  message: string;
  [key: string]: unknown;
};

type CallbackFn = (data: EventPayload) => void;

type ListenerMap = {
  [topic in SSE_TOPIC]?: CallbackFn[];
};

export function useSseManager(connectionPath: string) {
  const listeners = useRef<ListenerMap>({});

  useEffect(() => {
    const evtSource = new EventSource(`${BASE_URL}${connectionPath}`);

    evtSource.onmessage = (event) => {
      if (!event.data) return;
      const parsed: EventPayload = JSON.parse(event.data);
      const topic = parsed.message as SSE_TOPIC;

      // Call specific topic listeners
      listeners.current[topic]?.forEach((cb) => cb(parsed));

      // Call ALL listeners
      listeners.current[SSE_TOPIC.ALL]?.forEach((cb) => cb(parsed));
    };

    return () => {
      evtSource.close();
    };
  }, [connectionPath]);

  const subscribe = (topic: SSE_TOPIC, callback: CallbackFn) => {
    if (!listeners.current[topic]) {
      listeners.current[topic] = [];
    }
    listeners.current[topic]?.push(callback);
  };

  const unsubscribe = (topic: SSE_TOPIC, callback: CallbackFn) => {
    listeners.current[topic] = listeners.current[topic]?.filter(
      (cb) => cb !== callback
    );
  };

  return { subscribe, unsubscribe };
}
