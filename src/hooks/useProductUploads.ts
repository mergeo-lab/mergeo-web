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

        // Update the upload status
        setUploads((prev) => {
          const currentUpload = prev[key] || { gtins: [] };
          return {
            ...prev,
            [key]: {
              ...currentUpload,
              percent: data.upload_percent,
              fileName: data.fileName,
              gtins: [...(currentUpload.gtins || []), data.gtin],
              uploadId: data.upload_id,
              timestamp: ts,
            },
          };
        });

        // Update the global progress
        setUploadPercent(data.upload_percent);
      }
    );

    const unsubSuccess = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadSummary,
      (data) => {
        const key = data.upload_id || data.fileName;
        const ts = (data as any).timestamp || Date.now();

        // Update the upload status with final state
        setUploads((prev) => {
          const currentUpload = prev[key] || { gtins: [] };
          return {
            ...prev,
            [key]: {
              ...currentUpload,
              failedGtins: data.failedGtins,
              successGtins: data.successGtins,
              finished: true,
              percent: 100, // Force 100% on completion
              uploadId: data.upload_id,
              timestamp: ts,
            },
          };
        });

        // Force 100% progress on completion
        setUploadPercent(100);
      }
    );

    const unsubFail = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadFail,
      (data) => {
        const key = data.upload_id || data.fileName;
        const ts = (data as any).timestamp || Date.now();

        // Update the upload status with failure state
        setUploads((prev) => {
          const currentUpload = prev[key] || { gtins: [] };
          return {
            ...prev,
            [key]: {
              ...currentUpload,
              failed: true,
              percent: 0,
              uploadId: data.upload_id,
              timestamp: ts,
            },
          };
        });

        // Reset progress on failure
        setUploadPercent(0);
      }
    );

    return () => {
      unsubProgress();
      unsubSuccess();
      unsubFail();
    };
  }, []); // Empty dependency array since we don't want to recreate subscriptions

  return { uploads, uploadPercent };
}
