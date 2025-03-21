import { useQuery } from '@tanstack/react-query';
import UseCompanyStore from '@/store/company.store';
import UseSearchConfigStore from '@/store/searchConfiguration.store.';
import { getProducts, SearchParams } from '@/lib/orders';
import { useEffect, useState } from 'react';
import {
  PaginationSort,
  PaginationType,
  ProductSchemaType,
} from '@/lib/schemas';

export const defaultPagination = {
  page: 1,
  pageSize: 20,
  orderBy: 'created',
  sortOrder: PaginationSort.DESC,
};

export function useProductSearch(searchParams: Partial<SearchParams>) {
  const { company } = UseCompanyStore();
  const { getAllConfig, resetConfig, getConfigDone } = UseSearchConfigStore();
  const configDone = getConfigDone();
  const config = getAllConfig();
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);

  useEffect(() => {
    console.log('pagination changes: ', pagination);
  }, [pagination]);

  const { data, isLoading, isError, error, refetch } = useQuery<{
    products: ProductSchemaType[];
    currentPage: number;
    total: number;
    totalPages: number;
  }>({
    queryKey: ['client-products', { ...searchParams, pagination }, 'favorites'],
    queryFn: async () => {
      const companyId = company?.id;
      const branchId = config.branch?.id;

      const result =
        !searchParams || !companyId
          ? {
              products: [],
              currentPage: 1,
              total: 0,
              totalPages: 0,
            }
          : await getProducts(
              companyId,
              {
                branchId: branchId,
                expectedDeliveryStartDay:
                  config.deliveryTime &&
                  config.deliveryTime?.from?.toISOString().split('T')[0],
                expectedDeliveryEndDay:
                  config.deliveryTime.to &&
                  config?.deliveryTime?.to.toISOString().split('T')[0],
                startHour: '00',
                endHour: '2400',
                name: searchParams.name ?? '',
                brand: searchParams.brand,
                isPickUp: config.pickUp,
                pickUpLat: config.pickUpLocation.location.latitude,
                pickUpLng: config.pickUpLocation.location.longitude,
                pickUpRadius: config.pickUpLocation.radius,
                onlyFavorites: searchParams.onlyFavorites,
              },
              pagination
            );

      console.log('RESULT: ', result);

      return {
        products: result.products,
        currentPage: result.currentPage || 1,
        total: result.total || 0,
        totalPages: result.totalPages,
      };
    },
    enabled: !!company?.id && configDone,
  });

  const resetSearch = () => {
    resetConfig();
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
    refetch,
    resetSearch,
    setPagination,
    pagination,
  };
}
