import { useQuery } from '@tanstack/react-query';
import UseCompanyStore from '@/store/company.store';
import UseSearchConfigStore from '@/store/searchConfiguration.store.';
import { getProducts, SearchParams } from '@/lib/orders';

export function useProductSearch(
  searchParams: Partial<SearchParams>,
  configCompleted: boolean
) {
  const { company } = UseCompanyStore();
  const { getAllConfig } = UseSearchConfigStore();
  const config = getAllConfig();

  return useQuery({
    queryKey: ['products', company?.id, searchParams.name, searchParams.brand],
    queryFn: ({ queryKey }) => {
      const companyId = queryKey[1];

      if (!companyId) {
        return Promise.reject(new Error('Company ID is undefined'));
      }
      // There are somoe parameters that are required to get the products
      // that are comming from the search configuration
      // the other params are optional
      return getProducts(companyId, {
        branchId:
          config.branch && config.branch !== null ? config.branch.id : '',
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
      });
    },
    enabled: !!company?.id || configCompleted,
  });
}
