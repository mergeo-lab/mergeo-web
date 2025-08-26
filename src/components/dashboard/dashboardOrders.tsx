import RemainingTime from "@/components/remainingTime";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatToArgentinianPesos, NotificationType } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MdPendingActions } from "react-icons/md";
import { StatusBadge } from '@/components/statusBadge';
import { ACCOUNT, PRE_ORDER_STATUS } from "@/lib/constants";
import { getPendingOrders, getLatestOrders } from "@/lib/dashboard";
import { useEffect } from "react";
import { useNotifications } from "@/context/NotificationsContext";

type Props = {
    companyId: string;
    accountType: ACCOUNT,
    queryKey: string;
    itemsCount?: number;
}

export default function DashboardOrders({ companyId, accountType, queryKey, itemsCount }: Props) {
    const { notifications } = useNotifications()

    const { data, isLoading, refetch } = useQuery({
        queryKey: [queryKey, companyId, accountType],
        queryFn: () => accountType === ACCOUNT.provider ? getPendingOrders(companyId) : getLatestOrders(companyId),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const relevantNotifications = notifications.filter(
            notification =>
                notification.type === NotificationType.PRE_ORDER_CREATED ||
                notification.type === NotificationType.PRE_ORDER_UPDATED
        );

        if (relevantNotifications.length > 0) {
            // If we have any new or updated pre-order notifications, refetch the list
            refetch();
        }
    }, [notifications, refetch]);

    if (isLoading) {
        const amount = itemsCount || 2;
        return (
            Array.from({ length: amount }).map((_, index) => (
                <Skeleton key={index} className={cn('h-[4.82438rem]', {
                    'rounded-b-none': index === 0,
                    'rounded-t-none': index === amount - 1,
                })} />
            ))
        )
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="p-0">
                    <div className="p-4 flex flex-col items-center justify-center gap-2">
                        <MdPendingActions size={30} />
                        <div className="font-base text-destructive">No tienes ordenes pendientes</div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className={cn("p-0 h-fit max-h-64 overflow-y-auto")}>
                <div className="divide-y">
                    {data && data
                        .filter(order => {
                            // For clients, hide rejected orders
                            // For providers, show all orders including rejected ones
                            if (accountType === ACCOUNT.client && order.status === PRE_ORDER_STATUS.rejected) {
                                return false;
                            }
                            return true;
                        })
                        .map((order) => (
                            <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div className="font-medium w-32">Order #{order.preOrderNumber}</div>
                                <div className="flex items-center w-56">
                                    <span className="mr-1 text-gray-500 font-thin">
                                        Cantidad de Productos:
                                    </span>
                                    {order.productsCount}
                                </div>
                                {
                                    accountType === ACCOUNT.provider && order.dropZoneName ?
                                        <div className="flex flex-col justify-center">
                                            <div>
                                                <span className="mr-1 text-gray-500 font-thin">
                                                    Zona:
                                                </span>
                                                {order.dropZoneName}
                                            </div>
                                            <RemainingTime time={order.responseDeadline} />
                                        </div>
                                        :
                                        <div className="flex flex-col min-w-44 justify-center items-center gap-2">
                                            <StatusBadge className='py-1 text-sm' status={order?.status || ""} />
                                            {
                                                order.responseDeadline && order.status === PRE_ORDER_STATUS.pending && accountType === ACCOUNT.provider &&
                                                <RemainingTime time={order.responseDeadline} />
                                            }
                                        </div>
                                }
                                <div className="flex items-center justify-end space-x-4 w-60">
                                    <div className="flex flex-col justify-end items-end">
                                        <div className="font-medium">{formatToArgentinianPesos(order.totalPrice)}</div>
                                    </div>
                                    <Button variant='outline'>
                                        <Link to={'/provider/preOrders/$preOrderId'} params={{ preOrderId: order.id || "" }}>
                                            Ver Pedido
                                        </Link>
                                    </Button>
                                    {order?.status === PRE_ORDER_STATUS.accepted &&
                                        <Button variant='outline'>
                                            <Link to={`/buyOrder/$orderId`} params={{ orderId: order?.buyOrderId || "" }}>
                                                Ver Orden de compra
                                            </Link>
                                        </Button>
                                    }
                                </div>
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    )
}