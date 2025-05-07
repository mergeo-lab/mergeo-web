import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { RiMedalFill } from "react-icons/ri";
import { MdGppGood } from "react-icons/md";
import { MdDoNotDisturbOn } from "react-icons/md";
import { cn } from "@/lib/utils";
import { TbProgressBolt } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import { getUsersPerformance } from "@/lib/dashboard/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { LiaUserClockSolid } from "react-icons/lia";

const performance = {
    "excelent": {
        style: "text-primary",
        icon: <RiMedalFill size={60} />,
        label: "Excelente Vendedor"
    },
    "good": {
        style: "text-orange-500",
        icon: <MdGppGood size={60} />,
        label: "Buen desempeño"
    },
    "improve": {
        style: "text-highlight",
        icon: <TbProgressBolt size={60} />,
        label: "Puede Mejorar"
    },
    "bad": {
        style: "text-destructive",
        icon: <MdDoNotDisturbOn size={60} />,
        label: "Muy bajo desempeño"
    }
}

export default function TopPerformerCard({ companyId }: { companyId: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ['users-performance', companyId],
        queryFn: () => getUsersPerformance(companyId),
    });

    if (isLoading) {
        const amount = 2;
        return (
            <div className="flex flex-col w-full h-fit">
                {Array.from({ length: amount }).map((_, index) => {
                    const isFirst = index === 0;
                    const isLast = index === amount - 1;
                    return (
                        <Skeleton key={index} className={cn("w-full h-[7.8125rem]",
                            {
                                "rounded-t-xl rounded-b-none border-b-0": isFirst,
                                "rounded-b-xl rounded-t-none border-t-1": isLast,
                                "rounded-none": !isFirst && !isLast
                            }
                        )} />
                    )
                }
                )}
            </div>
        )
    }

    const hasData = data && data?.some(salesData => salesData.closedOrders > 0);

    if (!data || data.length === 0 || hasData === false) {
        return (
            <Card>
                <CardContent className="p-10 flex flex-col justify-center items-center gap-4">
                    <LiaUserClockSolid size={30} />
                    <p className="text-destructive">Aun no tienens estadisticas sobre los usuarios</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="flex flex-col">
            {data && data.map((salesData, index) => {
                const successRate = salesData.percentage;
                const isFirst = index === 0;
                const isLast = index === data.length - 1;

                return (
                    <Card
                        key={salesData.userId}
                        className={cn("w-full", {
                            "rounded-t-xl rounded-b-none border-b-0": isFirst,
                            "rounded-b-xl rounded-t-none border-t-1": isLast,
                            "rounded-none": !isFirst && !isLast
                        })}
                    >
                        <CardContent className="flex py-5">
                            {/* User Profile Section */}
                            <div className="flex items-center justify-between w-2/3">
                                <div className="flex items-center space-x-4 w-full">
                                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 text-md font-medium">
                                        {salesData.firstName.charAt(0) + salesData.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-nowrap">{`${salesData.firstName} ${salesData.lastName}`}</div>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Ordenes cerradas</p>
                                        <div className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                            <p className="text-2xl font-bold">{salesData.closedOrders}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Success Rate Section */}
                            <div className="flex w-full">
                                <div className="gap-2 flex flex-col justify-center w-3/4 mr-10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Porcentaje de Ventas</span>
                                        <span className="font-bold">{successRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={cn(
                                            "h-2 rounded-full overflow-hidden w-full"
                                        )}>
                                            <div
                                                className="w-full h-full bg-gradient-to-r from-red-800 from-25% via-orange-500 via-50% to-primary to-100%"
                                                style={{ maskImage: `linear-gradient(to right, black ${successRate}%, transparent ${successRate}%)` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/4 h-full flex justify-center items-center">
                                    {successRate > 75 && (
                                        <div className="flex flex-col justify-center items-center">
                                            <span>{performance["excelent"].label}</span>
                                            <span className={performance["excelent"].style}>{performance["excelent"].icon}</span>
                                        </div>
                                    )}
                                    {successRate > 50 && successRate < 75 && (
                                        <div className="flex flex-col justify-center items-center">
                                            <span>{performance["good"].label}</span>
                                            <span className={performance["good"].style}>{performance["good"].icon}</span>
                                        </div>
                                    )}
                                    {successRate > 30 && successRate < 50 && (
                                        <div className="flex flex-col justify-center items-center">
                                            <span>{performance["improve"].label}</span>
                                            <span className={performance["improve"].style}>{performance["improve"].icon}</span>
                                        </div>
                                    )}
                                    {successRate == 0 && successRate < 30 && (
                                        <div className="flex flex-col justify-center items-center">
                                            <span>{performance["bad"].label}</span>
                                            <span className={performance["bad"].style}>{performance["bad"].icon}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                )
            }
            )}
        </div>
    )
}