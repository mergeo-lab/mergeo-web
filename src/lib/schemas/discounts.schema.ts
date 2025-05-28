import { CompanySchema } from '@/lib/schemas/company.schema';
import { z } from 'zod';

export const DiscountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(30).optional(),
  description: z.string().optional(),
  discount: z.number().optional(),
  companies: z.array(CompanySchema).optional(),
});

export const DiscountFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(30).optional(),
  description: z.string().optional(),
  discount: z.number().optional(),
});

export const DiscountProductSearchSchema = z.object({
  listId: z.string(),
});

// Infer TypeScript type from the schema
export type DiscountSchemaType = z.infer<typeof DiscountSchema>;
export type DiscountFormSchemaType = z.infer<typeof DiscountFormSchema>;
export type DiscountProductSearchSchemaType = z.infer<
  typeof DiscountProductSearchSchema
>;
