// hooks/useProductUploads.ts
import { useEffect, useState } from 'react';
import { SERVER_SENT_EVENTS } from '@/lib/constants';
import { subscribeSSE, useSSE } from '@/hooks/server-events/useSse';
import { ProductUploadUpdate } from '@/hooks/server-events/see';
import { PRODUCT_UPLOAD_EVENTS } from '@/lib/orders/endpoints';

type UploadStatus = {
  [key: string]: {
    percent: number;
    gtins: string[];
    finished?: boolean;
    failed?: boolean;
    fileName?: string;
    failedGtins?: string[];
    successGtins?: string[];
    uploadId?: string;
    timestamp?: number;
  };
};

export function useProductUploads(userId: string) {
  const [uploads, setUploads] = useState<UploadStatus>({});
  const [uploadPercent, setUploadPercent] = useState(0);

  // Initialize SSE connection
  useSSE(`${PRODUCT_UPLOAD_EVENTS}${userId}`);

  useEffect(() => {
    const unsubProgress = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadSuccess,
      (data) => {
        const key = data.upload_id || data.fileName;
        const ts = (data as any).timestamp || Date.now();
        setUploads((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            percent: data.upload_percent,
            fileName: data.fileName,
            gtins: [...(prev[key]?.gtins || []), data.gtin],
            uploadId: data.upload_id,
            timestamp: ts,
          },
        }));
        setUploadPercent(data.upload_percent);
      }
    );

    const unsubSuccess = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadSummary,
      (data) => {
        const key = data.upload_id || data.fileName;
        const ts = (data as any).timestamp || Date.now();
        setUploads((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            failedGtins: data.failedGtins,
            successGtins: data.successGtins,
            finished: true,
            percent: 100, // Ensure we show 100% when finished
            uploadId: data.upload_id,
            timestamp: ts,
          },
        }));
        setUploadPercent(100);
      }
    );

    const unsubFail = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadFail,
      (data) => {
        const key = data.upload_id || data.fileName;
        const ts = (data as any).timestamp || Date.now();
        setUploads((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            failed: true,
            percent: 0, // Reset progress on failure
            uploadId: data.upload_id,
            timestamp: ts,
          },
        }));
        setUploadPercent(0);
      }
    );

    return () => {
      unsubProgress();
      unsubSuccess();
      unsubFail();
    };
  }, []); // Remove uploads from dependency array to prevent infinite loop

  return { uploads, uploadPercent };
}
