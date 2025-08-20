import ClientProductList from '@/components/configuration/client/orders/clientProductList';
import { StatusBadge } from '@/components/statusBadge';
import { getClientPreOrderById } from '@/lib/orders';
import { cn, formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'

import { PRE_ORDER_STATUS } from '@/lib/constants';

import BackLink from '@/components/backLink';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/preOrders/$preOrderId')({
    component: () => <SellsDetail />,
})

export function SellsDetail() {
    const { preOrderId } = useParams({ from: '/_authenticated/_dashboardLayout/_accountType/client/preOrders/$preOrderId' });





    const { data: order, isLoading, error } = useQuery({
        queryKey: ['clientPreOrderDetail', preOrderId],
        queryFn: async () => {
            if (!preOrderId) {
                throw new Error('Order ID is undefined');
            }
            console.log('Query function executing with preOrderId:', preOrderId);
            const result = await getClientPreOrderById(preOrderId);
            console.log('Query function result:', result);
            return result;
        },
        enabled: !!preOrderId,
        refetchOnWindowFocus: false,
    });

    // Debug logs
    console.log('Client PreOrder Debug:', {
        preOrderId,
        isLoading,
        error,
        order,
        orderProducts: order?.products,
        orderProductsLength: order?.products?.length,
        orderStatus: order?.status,
        orderTotalPrice: order?.totalPrice
    });

    if (error) {
        console.error('Query error:', error);
    }

    return (
        <>
            <div className='p-4 shadow overflow-auto'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-2 pb-1'>
                        <BackLink />
                        <div className='h-5 w-1 border-l-2 border-secondary/50 mr-2'></div>
                        <div className='flex justify-between items-center text-sm font-thin border-border border rounded pl-2'>
                            <p>Numero de pedido</p>
                            <span className='font-semibold bg-muted/20 px-2 py-1 rounded-r ml-2'>{order?.clientPreOrderNumber}</span>
                        </div>
                        <StatusBadge className='py-1 font-black text-sm' status={order?.status || ""} />
                    </div>
                    <div className='font-thin text-secondary/80 mr-4 mt-2'>{order?.createdAt && formatDate(order?.createdAt)}</div>
                </div>
            </div>
            <div className='flex flex-col items-stretch'>
                <div className={cn('bg-border/30 py-5 relative', {
                    'h-[calc(100vh-225px)]': order?.status !== PRE_ORDER_STATUS.pending,
                    'h-fit overflow-auto': order?.status === PRE_ORDER_STATUS.pending
                })}>

                    <ClientProductList
                        isProvider={false}
                        isLoading={isLoading}
                        orderStatus={order?.status as PRE_ORDER_STATUS}
                        dropZoneId={order?.dropZoneId}
                        data={order?.products || []}
                        totalPrice={Number(order?.totalPrice || 0)}
                    />

                </div>
            </div>
        </>
    )
}