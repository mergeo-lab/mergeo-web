import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { providerProductsSearch } from '@/lib/products';
import {
  PreOrderProductDetailSchemaType,
  ProviderProductSearchType,
} from '@/lib/schemas';

export const useProviderProductSearch = () => {
  const [params, setParams] = useState<ProviderProductSearchType | null>(null);

  useEffect(() => {
    console.log('Params updated:', params);
  }, [params]);

  const { data, isLoading, isError, error } = useQuery<{
    products: PreOrderProductDetailSchemaType[];
    count: number;
  }>({
    queryKey: ['products', { ...params }],
    queryFn: () => {
      if (!params) {
        return Promise.resolve({ products: [], count: 0 }); // Return an empty object with products and count when no params
      }
      return providerProductsSearch(params); // Call the API with the current params
    },
    enabled: !!params, // Only run the query if params exist
  });

  const handleSearch = (newParams: ProviderProductSearchType) => {
    setParams(newParams); // Update params and trigger the query
  };

  const resetSearch = () => {
    setParams(null);
  };

  return {
    data,
    isLoading,
    isError,
    error,
    handleSearch,
    resetSearch,
  };
};
