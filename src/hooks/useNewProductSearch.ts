import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newProductsSearch } from '@/lib/products';
import { NewProductSearchType, ProductSchemaType } from '@/lib/schemas';

export const UseNewProductSearch = () => {
  const [params, setParams] = useState<NewProductSearchType | null>(null);

  useEffect(() => {
    console.log('Params updated:', params);
  }, [params]);

  const { data, isLoading, isError, error } = useQuery<{
    products: ProductSchemaType[];
  }>({
    queryKey: ['products', { ...params }],
    queryFn: async () => {
      if (!params) throw new Error('Search parameters are required');
      const result = await newProductsSearch(params);
      return { products: result };
    },
    enabled: !!params,
  });

  const handleSearch = (newParams: NewProductSearchType) => {
    setParams(newParams);
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
