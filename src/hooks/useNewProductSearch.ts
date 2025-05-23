// src/hooks/useNewProductSearch.ts
import { useQuery } from '@tanstack/react-query';
import { newProductsSearch } from '@/lib/products';
import { ProductSchemaType } from '@/lib/schemas';
import { useProviderProductSearchStore } from '@/store/providerProductSearch.store';

export const UseNewProductSearch = () => {
  const { params } = useProviderProductSearchStore();

  const query = useQuery<{
    products: ProductSchemaType[];
  }>({
    queryKey: ['products-search', params],
    queryFn: async () => {
      if (!params) throw new Error('Search parameters are required');
      const result = await newProductsSearch(params);
      return { products: result as unknown as ProductSchemaType[] };
    },
    enabled: !!params,
  });

  return query;
};
