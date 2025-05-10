// hooks/useProductUploads.ts
import { useEffect, useState } from 'react';
import { SERVER_SENT_EVENTS } from '@/lib/constants';
import { subscribeSSE, useSSE } from '@/hooks/server-events/useSse';
import { ProductUploadUpdate } from '@/hooks/server-events/see';
import { PRODUCT_UPLOAD_EVENTS } from '@/lib/orders/endpoints';

type UploadStatus = {
  [uploadId: string]: {
    percent: number;
    gtins: string[];
    finished?: boolean;
    failed?: boolean;
    fileName?: string;
    failedGtins?: string[];
    successGtins?: string[];
  };
};

export function useProductUploads(providerId: string) {
  const [uploads, setUploads] = useState<UploadStatus>({});

  useSSE(`${PRODUCT_UPLOAD_EVENTS}${providerId}`);

  useEffect(() => {
    const unsubProgress = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadSuccess,
      (data) => {
        console.log('productsUploadSuccess', data);
        setUploads((prev) => ({
          ...prev,
          [data.fileName]: {
            ...prev[data.fileName],
            percent: data.upload_percent,
            fileName: data.fileName,
            gtins: [...(prev[data.fileName]?.gtins || []), data.gtin],
          },
        }));

        console.log('UPDATES BEFORE FINISHING :: ', uploads);

        if (data.upload_percent === 100) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          setUploads((prev) => {
            const newUploads = { ...prev };
            delete newUploads[data.fileName];
            return newUploads;
          });

          console.log('UPDATES AFETER FINISHING :: ', uploads);
        }
      }
    );

    const unsubSuccess = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadSummary,
      (data) => {
        console.log('productsUploadSummary', data);

        setUploads((prev) => ({
          ...prev,
          [data.fileName]: {
            ...prev[data.fileName],
            failedGtins: data.failedGtins,
            successGtins: data.successGtins,
            finished: true,
          },
        }));
      }
    );

    const unsubFail = subscribeSSE<ProductUploadUpdate>(
      SERVER_SENT_EVENTS.productsUploadFail,
      (data) => {
        console.log('productsUploadFail', data);

        setUploads((prev) => ({
          ...prev,
          [data.fileName]: {
            ...prev[data.fileName],
            failed: true,
          },
        }));
      }
    );

    return () => {
      unsubProgress();
      unsubSuccess();
      unsubFail();
    };
  }, []);

  return { uploads };
}
