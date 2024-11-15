import * as z from 'zod';

export const SearchListProductSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  category: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export const SearchListSchema = z.object({
  id: z.string().optional(),
  name: z.string().max(25),
  createdBy: z.string(),
  products: SearchListProductSchema.array().optional(),
  file: z.any().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export const SearchListsResults = z.object({
  created: z.string(),
  updated: z.string(),
  id: z.string(),
  name: z.string(),
  companyId: z.string(),
  createdBy: z.string(),
  products: z.array(SearchListProductSchema),
});

export type SearchListType = z.infer<typeof SearchListSchema>;
export type SearchListProductType = z.infer<typeof SearchListProductSchema>;
export type SearchListsResultsType = z.infer<typeof SearchListsResults>;
