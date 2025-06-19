import ProductList from '@/components/configuration/provider/sells/productList';
import { StatusBadge } from '@/components/statusBadge';
import { getSellPreOrdersById, preOrderProviderResponse } from '@/lib/orders';
import { cn, formatDate } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UseProviderSellStore from '@/store/providerSell';
import { SellProductSchemaType } from '@/lib/schemas/sell.schema';
import { PreOrderProductSchemaType } from '@/lib/schemas';
import { PRE_ORDER_STATUS } from '@/lib/constants';
import LoadingIndicator from '@/components/loadingIndicator';
import BackLink from '@/components/backLink';
import { useAuth } from '@/context/AuthContext';
import { BsBoxArrowInRight } from 'react-icons/bs';
import { isPast, parseISO } from 'date-fns';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/proOrders/$preOrderId')({
    component: () => <SellsDetail />,
})

// Utility function to check if response deadline has passed
function isResponseDeadlineExpired(deadline: string): boolean {
    try {
        const deadlineDate = parseISO(deadline);
        return isPast(deadlineDate);
    } catch {
        return false;
    }
}

export function SellsDetail() {
    const { preOrderId } = useParams({ from: '/_authenticated/_dashboardLayout/_accountType/provider/proOrders/$preOrderId' });

    const {
        acceptedProducts,
        rejectedProducts,
        addAllAcceptedProducts,
        toggleAllProducts,
        toggleProductAcceptance,
    } = UseProviderSellStore();

    const { account } = useAuth();
    const companyId = account?.company.id;

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

    // Check if response deadline has passed
    const isDeadlineExpired = order?.responseDeadline ? isResponseDeadlineExpired(order.responseDeadline) : false;

    async function handleProviderResponse() {
        if (!order || mutation.isPending || isDeadlineExpired) return;
        mutation.mutateAsync({
            orderId: order.id,
            acceptedProducts,
            rejectedProducts,
        }).finally(() => {
            refetch();
        })
    }

    async function handleReceptedResponse() {
        if (!order || mutation.isPending || isDeadlineExpired) return;

        mutation.mutateAsync({
            orderId: order.id,
            acceptedProducts: [],
            rejectedProducts: order.preOrderProducts.map((item: PreOrderProductSchemaType): SellProductSchemaType => {
                return {
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    providerId: companyId || '',
                    dropZoneId: order.dropZoneId || '',
                }
            })
        }).finally(() => {
            refetch();
        })
    }

    const sellProduct = useCallback(() => {
        if (!companyId || !order) return;
        return order?.preOrderProducts.map((item: PreOrderProductSchemaType): SellProductSchemaType => {
            return {
                id: item.id,
                quantity: item.quantity,
                price: item.product.price,
                providerId: companyId,
                dropZoneId: order.dropZoneId || '',
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
                        {order?.status === PRE_ORDER_STATUS.accepted || order?.status === PRE_ORDER_STATUS.partialyAccepted &&
                            <Link to={`/buyOrder/$orderId`} params={{ orderId: order?.orderId || '' }}>
                                <Button variant='link' className='space-x-2'>
                                    <BsBoxArrowInRight size={20} />
                                    <p>Ir a Orden de Compra</p>
                                </Button>
                            </Link>
                        }
                    </div>
                    <div className='font-thin text-secondary/80 mr-4 mt-2'>{order?.created && formatDate(order?.created)}</div>
                </div>
            </div>
            <div className='flex flex-col items-stretch'>
                <div className={cn('bg-border/30 py-5 relative', {
                    'h-fit': order?.status !== PRE_ORDER_STATUS.pending,
                    'h-[calc(100vh-275px)] ': order?.status === PRE_ORDER_STATUS.pending
                })}>
                    {mutation.isPending &&
                        <div className='absolute inset-0 bg-white/60 w-full h-full z-20 flex justify-center items-center pointer-events-none'>
                        </div>
                    }
                    <ProductList
                        isLoading={isLoading}
                        orderStatus={order?.status as PRE_ORDER_STATUS}
                        providerId={order?.buyerId}
                        dropZoneId={order?.dropZoneId}
                        data={order?.preOrderProducts}
                        acceptedProducts={acceptedProducts}
                        onSelect={(item) => toggleProductAcceptance(item)}
                        toggleAllProducts={() => toggleAllProducts(sellProduct())}
                        isProvider={true}
                        disabled={isDeadlineExpired} />

                </div>
                {
                    order?.status === PRE_ORDER_STATUS.pending &&
                    <div className='flex justify-end gap-2 pr-10 border-t-2 border-border pt-6'>
                        <Button
                            onClick={handleReceptedResponse}
                            disabled={mutation.isPending || isDeadlineExpired}
                            variant="ghost"
                            className='text-destructive hover:text-destructive'>
                            Rechazar Pedido
                        </Button>
                        <Button
                            onClick={handleProviderResponse}
                            className={cn('w-48', {
                                'cursor-wait': mutation.isPending
                            })}
                            disabled={acceptedProducts.length === 0 || isDeadlineExpired}>
                            {mutation.isPending ? <LoadingIndicator className='text-white w-4 h-4' /> : "Aceptar Pedido"}
                        </Button>
                    </div>
                }
            </div>
        </>
    )
}