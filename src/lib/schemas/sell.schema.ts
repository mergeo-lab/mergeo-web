import { z } from 'zod';

export const SellProductSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  providerId: z.string(),
  dropZoneId: z.string(),
});

export const SellSchema = z.object({
  acceptedProducts: z.array(SellProductSchema),
  rejectedProducts: z.array(SellProductSchema),
});

export type SellProductSchemaType = z.infer<typeof SellProductSchema>;
export type SellSchemaType = z.infer<typeof SellSchema>;
