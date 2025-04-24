import RemainingTime from "@/components/remainingTime";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPendingOrders } from "@/lib/dashboard";
import { cn, formatToArgentinianPesos } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { MdPendingActions } from "react-icons/md";

export default function PendingOrders({ companyId }: { companyId: string }) {

    const { data, isLoading } = useQuery({
        queryKey: ['pending-orders', companyId],
        queryFn: () => getPendingOrders(companyId),
    });

    if (isLoading) {
        const amount = 2;
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
                    <div className="p-4 flex items-center gap-2">
                        <MdPendingActions size={30} className="text-highlight" />
                        <div className="font-medium">No tienes ordenes pendientes</div>
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
                            <div>
                                <span className="mr-1 text-gray-500 font-thin">
                                    Zona:
                                </span>
                                {order.dropZoneName}
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="font-medium">{formatToArgentinianPesos(order.totalPrice)}</div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="mr-1 h-3 w-3" />
                                        expira en&nbsp;
                                        <RemainingTime time={order.responseDeadline} />
                                    </div>
                                </div>
                                <Button variant='outline'>
                                    <Link to={'/provider/proOrders/$preOrderId'} params={{ preOrderId: order.id || "" }}>
                                        Ver Orden
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