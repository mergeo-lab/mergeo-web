import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBestZone } from "@/lib/dashboard/provider";
import { formatToArgentinianPesos } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

export default function BestZone({ companyId }: { companyId: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-best-zone', companyId],
        queryFn: () => getBestZone(companyId),
    });


    if (isLoading) {
        return (
            <Skeleton className="w-full h-full max-h-[15.1487rem]" />
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Zona con mas Ventas</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold">{data?.zoneName}</div>
                <div className="flex justify-between mt-2">
                    <div>
                        <p className="text-sm text-gray-500">Productos Vendidos</p>
                        <p className="font-medium">{data?.totalProductsSold}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ganancias</p>
                        <p className="font-medium">{formatToArgentinianPesos(data?.totalRevenue || 0)}</p>
                    </div>
                </div>
                <div className="my-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Porcentaje de Ventas</span>
                        <span>{data?.percentageOfSales}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${data?.percentageOfSales}%` }}
                        ></div>
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}