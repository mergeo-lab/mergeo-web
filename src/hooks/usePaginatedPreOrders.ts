import { useQuery } from '@tanstack/react-query';
import {
  getAllPreOrdersPaginated,
  getSellPreOrdersPaginated,
  getSellPreOrders,
} from '@/lib/orders';
import { PreOrderSchemaType } from '@/lib/schemas';
import { useState, useCallback } from 'react';

export const defaultPreOrdersPagination = {
  page: 1,
  take: 30,
};

export type PreOrdersFilters = {
  status?: string;
  zone?: string; // This will be the dropZoneId
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
    refetchOnWindowFocus: false,
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

  // Query for all preOrders (without filters) to get available zones
  const {
    data: allPreOrdersData,
    isLoading: isLoadingAllPreOrders,
    error: allPreOrdersError,
  } = useQuery<PreOrderSchemaType[]>({
    queryKey: ['sell-preorders-all', companyId],
    queryFn: async () => {
      console.log('Fetching all preOrders for companyId:', companyId);
      if (!companyId) {
        console.log('No companyId provided');
        return [];
      }
      try {
        const result = await getSellPreOrders(companyId);
        console.log('getSellPreOrders result:', result);
        // Handle case where backend might return { preOrders: [...] } instead of [...]
        if (result && typeof result === 'object' && 'preOrders' in result) {
          const preOrders = (result as any).preOrders || [];
          console.log('Extracted preOrders from object:', preOrders);
          return preOrders;
        }
        const finalResult = Array.isArray(result) ? result : [];
        console.log('Final result:', finalResult);
        return finalResult;
      } catch (error) {
        console.error('Error fetching all preOrders:', error);
        return [];
      }
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale
  });

  return {
    data,
    allPreOrdersData, // Add this to access all preOrders for zone extraction
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
    isLoadingAllPreOrders,
    allPreOrdersError,
  };
}
