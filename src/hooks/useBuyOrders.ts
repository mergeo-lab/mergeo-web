// src/hooks/orders/useBuyOrders.ts
import { useQuery } from '@tanstack/react-query';
import { BuyOrderSchemaType } from '@/lib/schemas/orders.schema';
import { getAllBuyOrders } from '@/lib/orders';

export const useBuyOrders = (companyId?: string, isClient?: boolean) => {
  return useQuery<BuyOrderSchemaType[]>({
    queryKey: ['buyOrders', companyId, isClient],
    queryFn: () => getAllBuyOrders(companyId!, isClient!),
    enabled: !!companyId && typeof isClient === 'boolean', // solo ejecuta cuando ambos existen
  });
};
