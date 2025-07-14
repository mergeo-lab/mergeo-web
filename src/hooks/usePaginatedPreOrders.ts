import { useQuery } from '@tanstack/react-query';
import {
  getAllPreOrdersPaginated,
  getSellPreOrdersPaginated,
} from '@/lib/orders';
import { PreOrderSchemaType } from '@/lib/schemas';
import { useState, useCallback } from 'react';

export const defaultPreOrdersPagination = {
  page: 1,
  take: 30,
};

export type PreOrdersFilters = {
  status?: string;
  sortByCreated?: boolean;
  sortOrder?: 'ASC' | 'DESC';
};

export function usePaginatedPreOrders(companyId: string) {
  const [pagination, setPagination] = useState<
    typeof defaultPreOrdersPagination
  >(defaultPreOrdersPagination);
  const [filters, setFilters] = useState<PreOrdersFilters>({});

  const handleSearch = useCallback((newFilters: PreOrdersFilters) => {
    console.log(
      'usePaginatedPreOrders - handleSearch called with:',
      newFilters
    );
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetSearch = useCallback(() => {
    setFilters({});
    setPagination(defaultPreOrdersPagination);
  }, []);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<{
    preOrders: PreOrderSchemaType[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>({
    queryKey: ['preorders-paginated', companyId, pagination, filters],
    queryFn: async () => {
      console.log(
        'usePaginatedPreOrders - queryFn called with filters:',
        filters
      );
      if (!companyId) {
        return {
          preOrders: [],
          currentPage: 1,
          total: 0,
          totalPages: 0,
        };
      }
      return getAllPreOrdersPaginated(companyId, pagination, filters);
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

export function usePaginatedSellPreOrders(companyId: string) {
  const [pagination, setPagination] = useState<
    typeof defaultPreOrdersPagination
  >(defaultPreOrdersPagination);
  const [filters, setFilters] = useState<PreOrdersFilters>({});

  const handleSearch = useCallback((newFilters: PreOrdersFilters) => {
    console.log(
      'usePaginatedSellPreOrders - handleSearch called with:',
      newFilters
    );
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetSearch = useCallback(() => {
    setFilters({});
    setPagination(defaultPreOrdersPagination);
  }, []);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<{
    preOrders: PreOrderSchemaType[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>({
    queryKey: ['sell-preorders-paginated', companyId, pagination, filters],
    queryFn: async () => {
      console.log(
        'usePaginatedSellPreOrders - queryFn called with filters:',
        filters
      );
      if (!companyId) {
        return {
          preOrders: [],
          currentPage: 1,
          total: 0,
          totalPages: 0,
        };
      }
      return getSellPreOrdersPaginated(companyId, pagination, filters);
    },
    enabled: !!companyId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale
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
