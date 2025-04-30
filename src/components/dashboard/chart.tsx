import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCOUNT } from "@/lib/constants";
import { getClientChartData } from "@/lib/dashboard";
import { getChartData } from "@/lib/dashboard/provider";
import { formatToArgentinianPesos } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
    companyId: string;
    accountType: ACCOUNT,
    queryKey: string;
};

export default function Chart({ companyId, accountType, queryKey }: Props) {
    const productColors = {
        'bar': 'hsl(236 82% 66%)',
    };
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const { data, isLoading } = useQuery({
        queryKey: [queryKey, companyId, accountType],
        queryFn: () => accountType === ACCOUNT.provider ? getChartData(companyId) : getClientChartData(companyId),
    });

    // We only use this to show the chart when there is no data
    const dummyChartData = [
        { month: 1, monthLabel: 'Ene', total: 0 },
        { month: 2, monthLabel: 'Feb', total: 0 },
        { month: 3, monthLabel: 'Mar', total: 0 },
        { month: 4, monthLabel: 'Abr', total: 0 },
        { month: 5, monthLabel: 'May', total: 0 },
        { month: 6, monthLabel: 'Jun', total: 0 },
    ];

    const chartData = isLoading || !data
        ? dummyChartData
        : data.chartData.map((d) => ({
            ...d,
            monthLabel: monthLabels[d.month - 1] ?? `M${d.month}`,
        }));

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-md font-thin">
                    {accountType === ACCOUNT.provider ? 'Ventas ' : 'Compras '}de los últimos 6 meses
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[385px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                            barCategoryGap={30}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                                labelFormatter={(label) => `Mes: ${label}`}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                                filterNull={true}
                                isAnimationActive={false}
                                wrapperStyle={{ visibility: 'visible' }}
                                content={({ payload }) => {
                                    if (!payload || payload.length === 0 || payload[0].value === 0) return null;
                                    return (
                                        <div className="bg-white p-2 rounded shadow">
                                            <p className="text-sm font-medium">Mes: {payload[0].payload.monthLabel}</p>
                                            <p className="text-sm">Total: ${payload[0]?.value?.toLocaleString() ?? 0}</p>
                                        </div>
                                    );
                                }}
                            />
                            <Bar activeBar={false} dataKey="total" fill={productColors['bar']} name={accountType === ACCOUNT.provider ? "Ventas" : "Compras"} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                {data && (
                    <div className="grid grid-cols-4 gap-4 mt-6 text-sm">
                        <div className="border-r pr-4">
                            <div className="text-gray-500">Total del periodo</div>
                            <div className="font-semibold">
                                {isLoading ? '$ 0' : formatToArgentinianPesos(data.totalPeriod)}
                            </div>
                        </div>
                        <div className="border-r pr-4">
                            <div className="text-gray-500">Promedio Mensual</div>
                            <div className="font-semibold">
                                {isLoading ? '$ 0' : formatToArgentinianPesos(data.averageMonthly)}
                            </div>
                        </div>
                        <div className="border-r pr-4">
                            <div className="text-gray-500">{accountType === ACCOUNT.provider ? "Crecimiento" : "Porcentaje de Gastos"}</div>
                            <div className="font-semibold text-green-600">
                                {isLoading ? '0' : data.growth.toFixed(0)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500">{accountType === ACCOUNT.provider ? "Mejor Mes" : "Mes con mas compras"}</div>
                            <div className="font-semibold">
                                {isLoading
                                    ? `${monthLabels[0]} ($ 0)`
                                    : `${monthLabels[data.bestMonth.month - 1]} (${formatToArgentinianPesos(data.bestMonth.total)})`
                                }
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
