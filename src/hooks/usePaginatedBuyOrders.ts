import { useQuery } from '@tanstack/react-query';
import { getAllBuyOrdersPaginated } from '@/lib/orders';
import { BuyOrderSchemaType } from '@/lib/schemas/orders.schema';
import { useState, useCallback } from 'react';

export const defaultBuyOrdersPagination = {
  page: 1,
  take: 30,
};

export type BuyOrdersFilters = {
  viewed?: boolean;
  clientId?: string;
  sortByCreated?: boolean;
  sortOrder?: 'ASC' | 'DESC';
};

export function usePaginatedBuyOrders(
  companyId: string,
  isClient: boolean = true
) {
  const [pagination, setPagination] = useState<
    typeof defaultBuyOrdersPagination
  >(defaultBuyOrdersPagination);
  const [filters, setFilters] = useState<BuyOrdersFilters>({});

  const handleSearch = useCallback((newFilters: BuyOrdersFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetSearch = useCallback(() => {
    setFilters({});
    setPagination(defaultBuyOrdersPagination);
  }, []);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<{
    buyOrders: BuyOrderSchemaType[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>({
    queryKey: ['buyorders-paginated', companyId, isClient, pagination, filters],
    queryFn: async () => {
      if (!companyId) {
        return {
          buyOrders: [],
          currentPage: 1,
          total: 0,
          totalPages: 0,
        };
      }
      return getAllBuyOrdersPaginated(companyId, isClient, pagination, filters);
    },
    enabled: !!companyId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    resetSearch,
    setPagination,
    pagination,
    filters,
    setFilters,
    handleSearch,
    isFetching,
  };
}
