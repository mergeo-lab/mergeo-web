import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartData } from "@/lib/dashboard";
import UseCompanyStore from "@/store/company.store";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Chart() {
    // Color palette for products
    const { getCompanyId } = UseCompanyStore();
    const companyId = getCompanyId();

    const productColors = {
        'bar': 'hsl(236 82% 66%)',
    }
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const { data, isLoading } = useQuery({
        queryKey: ['chart-data', companyId],
        queryFn: () => getChartData(companyId),
    });

    if (isLoading || !data) return <div className="h-[385px]"></div>;
    else {
        return (
            <Card className="w-full mb-10">
                <CardHeader>
                    <CardTitle className='text-md font-thin'>Ventas de los ultimos 6 meses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[385px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.chartData.map((d) => ({
                                    ...d,
                                    monthLabel: monthLabels[d.month - 1] ?? `M${d.month}`,
                                }))}
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
                    <div className="grid grid-cols-4 gap-4 mt-6 text-sm">
                        <div className="border-r pr-4">
                            <div className="text-gray-500">Total del periodo</div>
                            <div className="font-semibold">${data.chartData.reduce((sum, month) => sum + month.total, 0).toLocaleString()}</div>
                        </div>
                        <div className="border-r pr-4">
                            <div className="text-gray-500">Promedio Mensual</div>
                            <div className="font-semibold">${Math.round(data.chartData.reduce((sum, month) => sum + month.total, 0) / 6).toLocaleString()}</div>
                        </div>
                        <div className="border-r pr-4">
                            <div className="text-gray-500">Crecimiento</div>
                            <div className="font-semibold text-green-600">
                                {Math.round(((data.chartData[data.chartData.length - 1].total - data.chartData[0].total) / data.chartData[0].total) * 100)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500">Mejor Mes</div>
                            <div className="font-semibold">
                                {data.chartData.reduce((max, month) => month.total > max.total ? month : max).month} (${Math.max(...data.chartData.map(m => m.total)).toLocaleString()})
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
}