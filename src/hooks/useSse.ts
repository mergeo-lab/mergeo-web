import { BASE_URL } from '@/lib/api/axios';
import { useEffect, useState } from 'react';

type SseData = {
  orderId: string;
  clientId: string;
  providerId: string;
  message: string;
  upload_percent?: number;
  gtin?: string | null;
};

export function UseSse(connectionPath: string) {
  const [data, setData] = useState<SseData | null>();

  useEffect(() => {
    const evtSource = new EventSource(`${BASE_URL}${connectionPath}`);
    console.log('EVENT SOURCE :: ', evtSource);

    evtSource.onmessage = (event) => {
      if (event.data) {
        setData(JSON.parse(event.data));
      }
    };

    return () => {
      evtSource.close();
    };
  }, [connectionPath]);

  return { data };
}
