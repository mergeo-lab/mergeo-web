import ProductList from '@/components/configuration/provider/sells/productList';
import { StatusBadge } from '@/components/statusBadge';
import { getSellPreOrdersById, preOrderProviderResponse } from '@/lib/orders';
import { cn, formatDate } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UseProviderSellStore from '@/store/providerSell';
import { SellProductSchemaType } from '@/lib/schemas/sell.schema';
import { PreOrderProductSchemaType } from '@/lib/schemas';
import { PRE_ORDER_STATUS } from '@/lib/constants';
import LoadingIndicator from '@/components/loadingIndicator';
import UseCompanyStore from '@/store/company.store';
import BackLink from '@/components/backLink';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/proOrders/$preOrderId')({
    component: () => <SellsDetail />,
})

export function SellsDetail() {
    const { preOrderId } = useParams({ from: '/_authenticated/_dashboardLayout/_accountType/provider/proOrders/$preOrderId' });

    const {
        acceptedProducts,
        rejectedProducts,
        addAllAcceptedProducts,
        toggleAllProducts,
        toggleProductAcceptance,
    } = UseProviderSellStore();

    const { company } = UseCompanyStore();
    const companyId = company?.id;

    const { data: order, isLoading, refetch } = useQuery({
        queryKey: ['proOrderDetail', preOrderId],
        queryFn: ({ queryKey }) => {
            const preOrderId = queryKey[1];
            if (!preOrderId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Order ID is undefined'));
            }
            return getSellPreOrdersById(preOrderId);
        },
        enabled: !!preOrderId, // Ensure the query runs only if company ID exists
    });

    const mutation = useMutation({ mutationFn: preOrderProviderResponse });

    async function handleProviderResponse() {
        if (!order || mutation.isPending) return;
        mutation.mutateAsync({
            orderId: order.id,
            acceptedProducts,
            rejectedProducts,
        }).finally(() => {
            refetch();
        })
    }

    async function handleReceptedResponse() {
        if (!order || mutation.isPending) return;
        const allProducts = [...acceptedProducts, ...rejectedProducts];
        mutation.mutateAsync({
            orderId: order.id,
            acceptedProducts: [],
            rejectedProducts: allProducts,
        }).finally(() => {
            refetch();
        })
    }

    const sellProduct = useCallback(() => {
        if (!companyId || !order) return;
        console.log("order ======> ", order)
        return order?.preOrderProducts.map((item: PreOrderProductSchemaType): SellProductSchemaType => {
            return {
                id: item.id,
                quantity: item.quantity,
                providerId: companyId,
            };
        });
    }, [order, companyId]);

    const toggleAllAcceptedProducts = useCallback(() => {
        const acceptedProdcut = sellProduct();
        addAllAcceptedProducts(acceptedProdcut || []);
    }, [addAllAcceptedProducts, sellProduct]);

    useEffect(() => {
        if (order) {
            toggleAllAcceptedProducts();
        }
    }, [order, toggleAllAcceptedProducts]);

    return (
        <>
            <div className='p-4 shadow'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-2 pb-1'>
                        <BackLink />
                        <div className='h-5 w-1 border-l-2 border-secondary/50 mr-2'></div>
                        <div className='flex justify-between items-center text-sm font-thin border-border border rounded pl-2'>
                            <p>Numero de pedido</p>
                            <span className='font-semibold bg-muted/20 px-2 py-1 rounded-r ml-2'>{order?.preOrderNumber}</span>
                        </div>
                        <StatusBadge className='py-1 font-black text-sm' status={order?.status || ""} />
                    </div>
                    <div className='font-thin text-secondary/80 mr-4 mt-2'>{order?.created && formatDate(order?.created)}</div>
                </div>
            </div>
            <div className='flex flex-col items-stretch'>
                <div className={cn('bg-border/30 py-5 relative', {
                    'h-[calc(100vh-225px)]': order?.status !== PRE_ORDER_STATUS.pending,
                    'h-fit': order?.status === PRE_ORDER_STATUS.pending
                })}>
                    {mutation.isPending &&
                        <div className='absolute inset-0 bg-white/60 w-full h-full z-20 flex justify-center items-center pointer-events-none'>
                        </div>
                    }
                    <ProductList
                        isLoading={isLoading}
                        orderStatus={order?.status as PRE_ORDER_STATUS}
                        providerId={order?.buyerId}
                        data={order?.preOrderProducts}
                        acceptedProducts={acceptedProducts}
                        onSelect={(item) => toggleProductAcceptance(item)}
                        toggleAllProducts={() => toggleAllProducts(sellProduct())}
                    />

                </div>
                {
                    order?.status === PRE_ORDER_STATUS.pending &&
                    <div className='flex justify-end gap-2 pr-10 border-t-2 border-border pt-6'>
                        <Button
                            onClick={handleReceptedResponse}
                            disabled={mutation.isPending}
                            variant="ghost"
                            className='text-destructive hover:text-destructive'>
                            Rechazar Pedido
                        </Button>
                        <Button
                            onClick={handleProviderResponse}
                            className={cn('w-48', {
                                'cursor-wait': mutation.isPending
                            })}
                            disabled={acceptedProducts.length === 0}>
                            {mutation.isPending ? <LoadingIndicator className='text-white w-4 h-4' /> : "Aceptar Pedido"}
                        </Button>
                    </div>
                }
            </div>
        </>
    )
}