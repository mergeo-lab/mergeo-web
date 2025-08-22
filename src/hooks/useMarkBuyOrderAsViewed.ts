import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markBuyOrderAsViewed } from '@/lib/orders';
import { BuyOrderSchemaType } from '@/lib/schemas/orders.schema';

export const useMarkBuyOrderAsViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markBuyOrderAsViewed,
    onMutate: async (orderId: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['buyOrders'] });
      await queryClient.cancelQueries({ queryKey: ['buyorders-paginated'] });

      // Snapshot the previous value - we need to get all buyOrders queries
      const previousBuyOrders = queryClient.getQueriesData<
        BuyOrderSchemaType[]
      >({
        queryKey: ['buyOrders'],
      });

      const previousPaginatedBuyOrders = queryClient.getQueriesData<{
        buyOrders: BuyOrderSchemaType[];
        currentPage: number;
        total: number;
        totalPages: number;
      }>({
        queryKey: ['buyorders-paginated'],
      });

      // Optimistically update all buyOrders queries
      queryClient.setQueriesData<BuyOrderSchemaType[]>(
        { queryKey: ['buyOrders'] },
        (old) => {
          if (!old) return old;
          return old.map((order) =>
            order.id === orderId ? { ...order, markedAsViewd: true } : order
          );
        }
      );

      // Optimistically update all paginated buyOrders queries
      queryClient.setQueriesData<{
        buyOrders: BuyOrderSchemaType[];
        currentPage: number;
        total: number;
        totalPages: number;
      }>({ queryKey: ['buyorders-paginated'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          buyOrders: old.buyOrders.map((order) =>
            order.id === orderId ? { ...order, markedAsViewd: true } : order
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousBuyOrders, previousPaginatedBuyOrders };
    },
    onError: (err, orderId, context) => {
      console.log(err, orderId, context);
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBuyOrders) {
        context.previousBuyOrders.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousPaginatedBuyOrders) {
        context.previousPaginatedBuyOrders.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['buyOrders'] });
      queryClient.invalidateQueries({ queryKey: ['buyorders-paginated'] });
    },
  });
};
