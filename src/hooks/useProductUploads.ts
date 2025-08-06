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

  console.log('useProductUploads: Initializing with userId:', userId);

  // Initialize SSE connection
  useSSE(`${PRODUCT_UPLOAD_EVENTS}${userId}`);

  useEffect(() => {
    console.log('useProductUploads: Setting up SSE subscriptions');

    const unsubProgress = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadSuccess,
      (data) => {
        console.log('useProductUploads: Received progress event:', data);

        // Use fileName as the primary key for consistency
        const key = data.fileName;
        const ts = (data as any).timestamp || Date.now();

        console.log('useProductUploads: Using key:', key, 'timestamp:', ts);

        // Update the upload status
        setUploads((prev) => {
          const currentUpload = prev[key] || { gtins: [] };
          const newUpload = {
            ...currentUpload,
            percent: data.upload_percent,
            fileName: data.fileName,
            gtins: [...(currentUpload.gtins || []), data.gtin],
            uploadId: data.upload_id,
            timestamp: ts,
          };

          console.log(
            'useProductUploads: Updated upload for key:',
            key,
            'new state:',
            newUpload
          );

          return {
            ...prev,
            [key]: newUpload,
          };
        });

        // Update the global progress
        setUploadPercent(data.upload_percent);
      }
    );

    const unsubSuccess = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadSummary,
      (data) => {
        console.log('useProductUploads: Received summary event:', data);

        // Use fileName as the primary key for consistency
        const key = data.fileName;
        const ts = (data as any).timestamp || Date.now();

        console.log(
          'useProductUploads: Using key for summary:',
          key,
          'timestamp:',
          ts
        );

        // Update the upload status with final state
        setUploads((prev) => {
          const currentUpload = prev[key] || { gtins: [] };
          const newUpload = {
            ...currentUpload,
            failedGtins: data.failedGtins,
            successGtins: data.successGtins,
            finished: true,
            percent: 100, // Force 100% on completion
            uploadId: data.upload_id,
            timestamp: ts,
          };

          console.log(
            'useProductUploads: Final upload state for key:',
            key,
            'new state:',
            newUpload
          );

          return {
            ...prev,
            [key]: newUpload,
          };
        });

        // Force 100% progress on completion
        setUploadPercent(100);
      }
    );

    const unsubFail = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadFail,
      (data) => {
        console.log('useProductUploads: Received fail event:', data);

        // Use fileName as the primary key for consistency
        const key = data.fileName;
        const ts = (data as any).timestamp || Date.now();

        console.log(
          'useProductUploads: Using key for fail:',
          key,
          'timestamp:',
          ts
        );

        // Update the upload status with failure state
        setUploads((prev) => {
          const currentUpload = prev[key] || { gtins: [] };
          const newUpload = {
            ...currentUpload,
            failed: true,
            percent: 0,
            uploadId: data.upload_id,
            timestamp: ts,
          };

          console.log(
            'useProductUploads: Failed upload state for key:',
            key,
            'new state:',
            newUpload
          );

          return {
            ...prev,
            [key]: newUpload,
          };
        });

        // Reset progress on failure
        setUploadPercent(0);
      }
    );

    return () => {
      console.log('useProductUploads: Cleaning up SSE subscriptions');
      unsubProgress();
      unsubSuccess();
      unsubFail();
    };
  }, []); // Empty dependency array since we don't want to recreate subscriptions

  // Clean up finished uploads after a delay
  useEffect(() => {
    const cleanupTimer = setTimeout(() => {
      setUploads((prev) => {
        const newUploads = { ...prev };
        Object.keys(newUploads).forEach((key) => {
          const upload = newUploads[key];
          if (upload.finished && upload.percent === 100) {
            console.log('useProductUploads: Cleaning up finished upload:', key);
            delete newUploads[key];
          }
        });
        return newUploads;
      });
    }, 5000); // Clean up after 5 seconds

    return () => clearTimeout(cleanupTimer);
  }, [uploads]);

  console.log('useProductUploads: Current uploads state:', uploads);

  return { uploads, uploadPercent };
}
