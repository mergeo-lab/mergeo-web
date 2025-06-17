import { useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { PaginationSort, PaginationType } from '@/lib/schemas';

type UsePaginatedSearchProps<TParams, TData> = {
  queryKeyPrefix: (string | number)[] | string | number;
  queryFn: (params: TParams, pagination: PaginationType) => Promise<TData>;
  defaultSort?: PaginationSort;
  defaultOrderBy?: string;
  getEnabled?: (params: TParams | null) => boolean;
};

export function usePaginatedSearch<TParams, TData>({
  queryKeyPrefix,
  queryFn,
  defaultSort = PaginationSort.DESC,
  defaultOrderBy = 'updated',
  getEnabled = (params) => !!params,
}: UsePaginatedSearchProps<TParams, TData>) {
  const [params, setParams] = useState<TParams | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 20,
    orderBy: defaultOrderBy,
    sortOrder: defaultSort,
  });

  const query: UseQueryResult<TData> = useQuery({
    queryKey: [queryKeyPrefix, { ...params, pagination }],
    queryFn: async () => {
      if (!params) {
        throw new Error('Params are required for search');
      }
      return await queryFn(params, pagination);
    },
    enabled: getEnabled(params),
  });

  const handleSearch = (newParams: TParams) => {
    console.log('handleSearch', newParams);
    setParams(newParams);
    setPagination((prev) => ({ ...prev, page: 1 })); // reset to first page on new search
  };

  const resetSearch = () => {
    setParams(null);
    setPagination({
      page: 1,
      pageSize: 20,
      orderBy: defaultOrderBy,
      sortOrder: defaultSort,
    });
  };

  return {
    ...query,
    handleSearch,
    resetSearch,
    setPagination,
    params,
    pagination,
  };
}
