import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductsStats } from "@/lib/dashboard/provider";
import { formatToArgentinianPesos } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Box, Zap } from "lucide-react";
import { TbPigMoney } from "react-icons/tb";

export default function ProductsStats({ companyId }: { companyId: string }) {

    const { data, isLoading } = useQuery({
        queryKey: ['products-stats', companyId],
        queryFn: () => getProductsStats(companyId),
    });


    if (isLoading) {
        return (
            <div className="grid grid-cols-5 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-[10.356rem]" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-5 md:grid-cols-5 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between ">
                    <CardTitle className="text-sm font-medium">Productos en el Inventario</CardTitle>
                    <Box className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    {!data?.allProducts
                        ? <div className="text-3xl font-bold">0</div>
                        : <div className="text-3xl font-bold">{data?.allProducts}</div>}
                </CardContent>
            </Card>

            {/* Active Products Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between ">
                    <CardTitle className="text-sm font-medium">Products Activos</CardTitle>
                    <Zap className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    {!data?.activeProducts
                        ? <div className="text-3xl font-bold">0</div>
                        : <div className="text-3xl font-bold text-primary">{data?.activeProducts}</div>
                    }
                </CardContent>
            </Card>
            {data?.topSelledProducts && data?.topSelledProducts.length > 0
                ? data?.topSelledProducts.map((product) => (
                    <Card key={product.id}>
                        <CardHeader>
                            <CardTitle className="text-base text-black /60 font-medium">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-xl font-bold">{product.totalSold} <span className="font-light text-md">unidades</span></div>
                                    <p className="text-sm text-primary">{formatToArgentinianPesos(product.revenue)} en ventas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
                : <Card className="col-span-3">
                    <CardContent className="h-full">
                        <div className="h-full flex justify-center items-center">
                            <div className="flex flex-col items-center gap-2 mt-4">
                                <TbPigMoney size={30} />
                                <p className="text-destructive font-base">Aun no tienes ventas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            }

        </div >
    )
}