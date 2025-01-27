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

export const ProviderProductSearch = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  ean: z.string().optional(),
  companyId: z.string().optional(),
});

export type ProviderProductSearchType = z.infer<typeof ProviderProductSearch>;
