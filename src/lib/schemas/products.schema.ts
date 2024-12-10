import { z } from 'zod';

export const ProductsListSchema = z.object({
  id: z.string(),
  name: z.string(),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export type ProductsListSchemaType = z.infer<typeof ProductsListSchema>;

export const Gs1SearchSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
});

export type Gs1SearchSchemaType = z.infer<typeof Gs1SearchSchema>;
