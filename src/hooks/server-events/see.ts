export type ProductUploadUpdate = {
  gtin: string;
  upload_percent: number;
  upload_id: string;
  providerId: string;
  message: string;
  fileName: string;
  failedGtins: string[];
  successGtins: string[];
};
