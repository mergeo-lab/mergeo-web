import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { getSellInfo } from "@/lib/dashboard/provider";
import { formatDate, formatToArgentinianPesos } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router"
import { Calendar, Star } from "lucide-react"

export default function SellsInfo({ companyId }: { companyId: string }) {

    const { data: salesData, isLoading } = useQuery({
        queryKey: ['dashboard-best-sells', companyId],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Order ID is undefined'));
            }
            return getSellInfo(companyId);
        },
        enabled: !!companyId, // Ensure the query runs only if company ID exists
    });

    if (isLoading) {
        return Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="w-full h-full max-h-[133px]" />
        ))
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className='text-sm font-medium flex gap-2'>
                        <span>
                            Ultima Venta
                        </span>
                        <span className="text-sm font-thin">
                            {formatDate(salesData?.lastSell.created || "")}
                        </span>
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-info" />
                </CardHeader>
                <CardContent className='relative'>
                    <div className="text-2xl font-bold">{formatToArgentinianPesos(salesData?.lastSell?.totalPrice || 0)}</div>
                    <Button variant='link' className='absolute bottom-2 right-2'>
                        <Link to={'/buyOrder/$orderId'} params={{ orderId: salesData?.lastSell.id || "" }}>
                            Ver Orden de Compra
                        </Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium flex gap-2">
                        <span>
                            Mejor venta del mes
                        </span>
                        <span className='font-thin'>
                            {formatDate(salesData?.bestMonthSell.created || "")}
                        </span>
                    </CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent className='relative'>
                    <div className="text-2xl font-bold">{formatToArgentinianPesos(salesData?.bestMonthSell.totalPrice || 0)}</div>
                    <Button variant='link' className='absolute bottom-2 right-2'>
                        <Link to={'/buyOrder/$orderId'} params={{ orderId: salesData?.bestMonthSell.id || "" }}>
                            Ver Orden de Compra
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </>
    )

}