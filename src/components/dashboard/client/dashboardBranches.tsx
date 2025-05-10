import PercentBar from "@/components/percentBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardBranches } from "@/lib/dashboard";
import { useQuery } from "@tanstack/react-query";
import { ImTrophy } from "react-icons/im";

export default function DashboardBranches({ companyId }: { companyId: string }) {

    const { data, isLoading } = useQuery({
        queryKey: ["client-dashbord-branches", companyId],
        queryFn: () => getDashboardBranches(companyId),
    });

    if (isLoading) {
        return (
            <div className='flex gap-4 max-w-xl w-full h-56'>
                <Skeleton className="w-[18rem] h-[14rem]" />
                <Skeleton className="w-[17rem] h-[14rem]" />
            </div>
        )
    }

    return (
        <div className='flex gap-4 max-w-xl w-full h-56'>
            <Card className="w-1/2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className='text-sm font-medium flex gap-2 h-8'>
                        Sucursales
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex justify-center items-center relative'>
                    <Carousel className="w-full relative">
                        {data?.branches && data?.branches.length > 1 &&
                            <div className="absolute -top-8 right-10 z-10">
                                <CarouselPrevious className="rounded-r-none rounded-l-md w-8 ml-8" />
                                <CarouselNext className="rounded-l-none rounded-r-md w-8" />
                            </div>
                        }

                        <CarouselContent>
                            {data?.branches.map((branch) => (
                                <CarouselItem key={branch.branchId} className="w-full m-0">
                                    <div className="w-full">
                                        <p className="text-2xl max-w-full overflow-hidden truncate">
                                            {branch.branchName}
                                        </p>
                                        <p className="text-sm">Productos comprados: {branch.orderCount}</p>
                                        <PercentBar percent={branch.percent} label="Porcentaje de Compras" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </CardContent>
            </Card>
            {data && data?.topBranch?.percentage > 0

                ? <Card className="w-1/2">
                    <CardHeader className="flex flex-row items-center justify-between -mt-2 pb-2">
                        <CardTitle className='text-sm font-medium flex gap-2'>
                            <div className="bg-highlight rounded-xl p-2">
                                <ImTrophy className="text-white" />
                            </div>
                            Sucursal con mejor tasa de aprobación
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='relative'>
                        <p className="text-2xl max-w-full overflow-hidden truncate">
                            {data?.topBranch.branchName}
                        </p>
                        <p className="text-sm">
                            Ordenes Aceptadas:
                            {" "}{data?.topBranch.orderCount}/{data?.topBranch.preOrderCount}
                        </p>
                        <PercentBar
                            percent={data?.topBranch.approvalPercent ? (data.topBranch.approvalPercent > 100 ? 100 : data.topBranch.approvalPercent) : 0}
                            label="Ordenes Aceptadas"
                        />
                    </CardContent>
                </Card>
                : <Card className="w-1/2">
                    <CardContent className='h-full flex flex-col justify-center items-center pt-5'>
                        <ImTrophy size={100} className="text-black/10" />
                        <p className="text-sm text-center font-normal">Aun no se puede calcular la sucursal con mejor tasa de aprobación</p>
                    </CardContent>
                </Card>
            }
        </div>
    )
}