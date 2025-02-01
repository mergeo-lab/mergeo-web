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

export const ProductMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  created: z.string(),
  updated: z.string(),
  metadata: z.object({
    belongsToDiscountLists: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        discount: z.number(),
      })
    ),
  }),
  userActivity: z.array(
    z.object({
      action: z.string(),
      timestamp: z.string(),
      user: z.string(),
      details: z
        .object({
          price: z.object({ old: z.string(), new: z.string() }).optional(),
          description: z
            .object({ old: z.string(), new: z.string() })
            .optional(),
        })
        .or(z.string()),
    })
  ),
});

export type ProductsListSchemaType = z.infer<typeof ProductsListSchema>;

export const ProviderProductSearch = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  ean: z.string().optional(),
  companyId: z.string().optional(),
  includeInventory: z.boolean().optional(),
});

export type ProviderProductSearchType = z.infer<typeof ProviderProductSearch>;
export type ProductMetadataType = z.infer<typeof ProductMetadataSchema>;
