import { z } from 'zod';

export const CreateDiscountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(30),
  description: z.string().optional(),
  discount: z.number().optional(),
});

// Infer TypeScript type from the schema
export type CreateDiscountSchemaType = z.infer<typeof CreateDiscountSchema>;
