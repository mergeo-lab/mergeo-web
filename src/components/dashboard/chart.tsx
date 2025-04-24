import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartData } from "@/lib/dashboard";
import { formatToArgentinianPesos } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Chart({ companyId }: { companyId: string }) {
    const productColors = {
        'bar': 'hsl(236 82% 66%)',
    };
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const { data, isLoading } = useQuery({
        queryKey: ['chart-data', companyId],
        queryFn: () => getChartData(companyId),
    });

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
                    Ventas de los últimos 6 meses
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[385px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Tooltip
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                                labelFormatter={(label) => `Mes: ${label}`}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                            />
                            <Bar dataKey="total" fill={productColors['bar']} name="Ventas" />
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
                            <div className="text-gray-500">Crecimiento</div>
                            <div className="font-semibold text-green-600">
                                {isLoading ? '0' : data.growth.toFixed(0)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500">Mejor Mes</div>
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
