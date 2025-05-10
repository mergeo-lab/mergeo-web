import RemainingTime from "@/components/remainingTime";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatToArgentinianPesos } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { MdPendingActions } from "react-icons/md";
import { StatusBadge } from '@/components/statusBadge';
import { ACCOUNT } from "@/lib/constants";
import { getPendingOrders, getLatestOrders } from "@/lib/dashboard";

type Props = {
    companyId: string;
    accountType: ACCOUNT,
    queryKey: string;
    itemsCount?: number;
}

export default function DashboardOrders({ companyId, accountType, queryKey, itemsCount }: Props) {

    const { data, isLoading } = useQuery({
        queryKey: [queryKey, companyId, accountType],
        queryFn: () => accountType === ACCOUNT.provider ? getPendingOrders(companyId) : getLatestOrders(companyId),
    });

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
            <CardContent className="p-0">
                <div className="divide-y">
                    {data && data.map((order) => (
                        <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                            <div className="font-medium">Order #{order.preOrderNumber}</div>
                            <div className="flex items-center">
                                <span className="mr-1 text-gray-500 font-thin">
                                    Cantidad de Productos:
                                </span>
                                {order.productsCount}
                            </div>
                            {
                                accountType === ACCOUNT.provider && order.dropZoneName ?
                                    <div>
                                        <span className="mr-1 text-gray-500 font-thin">
                                            Zona:
                                        </span>
                                        {order.dropZoneName}
                                    </div>
                                    :
                                    <StatusBadge className='py-1 font-black text-sm' status={order?.status || ""} />
                            }
                            <div className="flex items-center justify-end space-x-4 min-w-60">
                                <div className="flex flex-col justify-end items-end">
                                    <div className="font-medium">{formatToArgentinianPesos(order.totalPrice)}</div>
                                    {order?.status === 'pending' &&
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="mr-1 h-3 w-3" />
                                            <RemainingTime time={order.responseDeadline} />
                                        </div>
                                    }
                                </div>
                                <Button variant='outline'>
                                    <Link to={'/provider/proOrders/$preOrderId'} params={{ preOrderId: order.id || "" }}>
                                        Ver Pedido
                                    </Link>
                                </Button>
                                <Button variant='outline'>
                                    <Link to={`/buyOrder/$orderId`} params={{ orderId: order?.buyOrderId || "" }}>
                                        Ver Orden de compra
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}