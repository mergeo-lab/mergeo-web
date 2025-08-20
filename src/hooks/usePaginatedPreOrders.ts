import { useQuery } from '@tanstack/react-query';
import {
  getMyClientPreOrders,
  getSellPreOrdersPaginated,
  getSellPreOrders,
} from '@/lib/orders';
import {
  PreOrderSchemaType,
  ClientPreOrdersResponseSchemaType,
} from '@/lib/schemas';
import { useState, useCallback, useEffect } from 'react';

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
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetSearch = useCallback(() => {
    setFilters({});
    setPagination(defaultPreOrdersPagination);
  }, []);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useQuery<ClientPreOrdersResponseSchemaType>({
      queryKey: ['preorders-paginated', companyId, pagination, filters],
      queryFn: async () => {
        if (!companyId) {
          return {
            entities: [],
            total: 0,
            count: 0,
            page: 1,
            pageSize: 30,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
            message: '',
          };
        }
        const result = await getMyClientPreOrders(pagination, filters);
        return result;
      },
      enabled: !!companyId,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    });

  // Log errors when they occur
  useEffect(() => {
    if (error) {
      console.error('usePaginatedPreOrders - Query error:', error);
    }
  }, [error]);

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
      if (!companyId) {
        console.log('No companyId provided');
        return [];
      }
      try {
        const result = await getSellPreOrders(companyId);
        // Handle case where backend might return { preOrders: [...] } instead of [...]
        if (result && typeof result === 'object' && 'preOrders' in result) {
          const preOrders = (result as any).preOrders || [];
          return preOrders;
        }
        const finalResult = Array.isArray(result) ? result : [];
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
