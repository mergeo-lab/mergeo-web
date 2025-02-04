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
  const [start, setStart] = useState(false);
  const [data, setData] = useState<SseData | null>();

  useEffect(() => {
    if (start === false) return;
    const evtSource = new EventSource(`${BASE_URL}${connectionPath}`);

    evtSource.onmessage = (event) => {
      console.log('EVENT ::::::::: ', event.data);
      if (event.data) {
        setData(JSON.parse(event.data));
      }
    };

    return () => {
      evtSource.close();
    };
  }, [connectionPath, start]);

  return { data, setStart };
}
