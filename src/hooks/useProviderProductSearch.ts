import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { providerProductsSearch } from '@/lib/products';
import {
  PaginationSort,
  PaginationType,
  ProductSchemaType,
  ProviderProductSearchType,
} from '@/lib/schemas';

export const useProviderProductSearch = () => {
  const [params, setParams] = useState<ProviderProductSearchType | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 20,
    orderBy: 'created',
    sortOrder: PaginationSort.ASC,
  });

  useEffect(() => {
    console.log('Params updated:', params);
  }, [params]);

  const { data, isLoading, isError, error } = useQuery<{
    products: ProductSchemaType[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>({
    queryKey: ['products', { ...params, pagination }],
    queryFn: async () => {
      const result = !params
        ? {
            products: [],
            currentPage: 1,
            total: 0,
            totalPages: 0,
          }
        : await providerProductsSearch(params, pagination);

      // Transform the API response to match the expected type
      return {
        products: result.products,
        currentPage: result.currentPage,
        total: result.total || 0,
        totalPages: result.totalPages,
      };
    },
    enabled: !!params,
  });

  const handleSearch = (newParams: ProviderProductSearchType) => {
    setParams(newParams);
  };

  const resetSearch = () => {
    setParams(null);
    setPagination({
      page: 1,
      pageSize: 10,
      orderBy: 'created',
      sortOrder: PaginationSort.DESC,
    });
  };

  return {
    data,
    isLoading,
    isError,
    error,
    handleSearch,
    resetSearch,
    setPagination,
  };
};
