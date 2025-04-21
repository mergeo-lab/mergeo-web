import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react'
import { ArrowRight, Star, Clock, Calendar, MapPin, Box, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import TopPerformerCard from '@/components/topPerformerCard';

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/dashboard')({
    component: Index,
})
const chartData = [
    {
        month: 'Jan',
        'Basic Widget': 3200,
        'Standard Widget': 4500,
        'Premium Widget': 2100,
        total: 9800
    },
    {
        month: 'Feb',
        'Basic Widget': 3800,
        'Standard Widget': 5100,
        'Premium Widget': 2900,
        total: 11800
    },
    {
        month: 'Mar',
        'Basic Widget': 4100,
        'Standard Widget': 4900,
        'Premium Widget': 3100,
        total: 12100
    },
    {
        month: 'Apr',
        'Basic Widget': 3500,
        'Standard Widget': 6200,
        'Premium Widget': 3800,
        total: 13500
    },
    {
        month: 'May',
        'Basic Widget': 4200,
        'Standard Widget': 7100,
        'Premium Widget': 4700,
        total: 16000
    },
    {
        month: 'Jun',
        'Basic Widget': 3900,
        'Standard Widget': 7500,
        'Premium Widget': 5200,
        total: 16600
    }
]

// Color palette for products
const productColors = {
    'Basic Widget': 'hsl(236 82% 66%)',
}

// Complete sales data with all required properties
const salesData = {
    lastSell: {
        amount: 1245.99,
        date: '2023-06-15',
        customer: 'Acme Corp'
    },
    bestSellOfMonth: {
        amount: 5890.50,
        date: '2023-06-10',
        product: 'Premium Widget'
    },
    topProducts: [  // This array was missing in your data
        { id: 1, name: 'Standard Widget', sales: 42, revenue: 4200 },
        { id: 2, name: 'Premium Widget', sales: 38, revenue: 5890.50 },
        { id: 3, name: 'Basic Widget', sales: 25, revenue: 1250 }
    ],
    topUser: {
        name: 'Sarah Johnson',
        interactions: 47,
        ordersClosed: 23,
        avatar: 'SJ',
        performance: 'High'
    },
    pendingOrders: [
        { id: 101, customer: 'Tech Solutions', amount: 890.75, daysPending: 2 },
        { id: 102, customer: 'Global Corp', amount: 1250.00, daysPending: 1 },
        { id: 103, customer: 'Innovate LLC', amount: 575.50, daysPending: 3 }
    ],
    productsSummary: {
        totalProducts: 156,
        activeProducts: 89,
        inactiveProducts: 67
    },
    topZone: {
        name: 'North Region',
        productsSold: 78,
        totalRevenue: 9825.75,
        percentage: 42
    }
}

const userData = [{
    user: {
        name: 'Alex Johnson',
        avatar: 'AJ',
        interactions: 47,
        ordersClosed: 20,
        performance: 'High'
    }
}, {
    user: {
        name: 'Nicolas Wyler',
        avatar: 'NW',
        interactions: 30,
        ordersClosed: 26,
        performance: 'High'
    }
}]

export default function Index() {
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

    return (
        <div className="h-full bg-gray-50 p-6 overflow-auto">


            {/* Top Metrics Cards */}
            <div className="flex gap-4">
                <div className='flex flex-col gap-6 max-w-xl w-full'>
                    {/* Last Sell Total Price */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className='text-sm font-medium flex gap-2'>
                                <span>
                                    Ultima Venta
                                </span>
                                <span className="text-sm font-thin">
                                    {salesData.lastSell.date}
                                </span>
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-info" />
                        </CardHeader>
                        <CardContent className='relative'>
                            <div className="text-2xl font-bold">${salesData.lastSell.amount.toFixed(2)}</div>
                            <Button variant='link' className='absolute bottom-2 right-2'>
                                <Link to={'/buyOrder/$orderId'} params={{ orderId: "1" }}>
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
                                    {salesData.bestSellOfMonth.date}
                                </span>
                            </CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent className='relative'>
                            <div className="text-2xl font-bold">${salesData.bestSellOfMonth.amount.toFixed(2)}</div>
                            <Button variant='link' className='absolute bottom-2 right-2'>
                                <Link to={'/buyOrder/$orderId'} params={{ orderId: "1" }}>
                                    Ver Orden de Compra
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    {/* Top Selling Zone */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Zona con mas Ventas</CardTitle>
                            <MapPin className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{salesData.topZone.name}</div>
                            <div className="flex justify-between mt-2">
                                <div>
                                    <p className="text-sm text-gray-500">Productos Vendidos</p>
                                    <p className="font-medium">{salesData.topZone.productsSold}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ganancias</p>
                                    <p className="font-medium">${salesData.topZone.totalRevenue.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="my-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Porcentaje de Ventas</span>
                                    <span>{salesData.topZone.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${salesData.topZone.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="w-full mb-10">
                    <CardHeader>
                        <CardTitle className='text-md font-thin'>Ventas de los ultimos 6 meses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[385px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [`$${value}`, name]}
                                        labelFormatter={(month) => `Month: ${month}`}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value) => <span className="text-sm">{value}</span>}
                                    />

                                    {/* Stacked Bars */}
                                    <Bar
                                        dataKey="Basic Widget"
                                        stackId="a"
                                        fill={productColors['Basic Widget']}
                                        name="Ventas x Mes"
                                    />

                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-4 gap-4 mt-6 text-sm">
                            <div className="border-r pr-4">
                                <div className="text-gray-500">Total del periodo</div>
                                <div className="font-semibold">${chartData.reduce((sum, month) => sum + month.total, 0).toLocaleString()}</div>
                            </div>
                            <div className="border-r pr-4">
                                <div className="text-gray-500">Promedio Mensual</div>
                                <div className="font-semibold">${Math.round(chartData.reduce((sum, month) => sum + month.total, 0) / 6).toLocaleString()}</div>
                            </div>
                            <div className="border-r pr-4">
                                <div className="text-gray-500">Crecimiento</div>
                                <div className="font-semibold text-green-600">
                                    {Math.round(((chartData[5].total - chartData[0].total) / chartData[0].total) * 100)}%
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500">Mejor Mes</div>
                                <div className="font-semibold">
                                    {chartData.reduce((max, month) => month.total > max.total ? month : max).month} (${Math.max(...chartData.map(m => m.total)).toLocaleString()})
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div>
                {/* Top Performer Card */}
                <TopPerformerCard data={userData} />

            </div>
            {/* Products Section */}
            <div className="my-8">
                {/* Product Summary Cards */}
                <div className="grid grid-cols-5 md:grid-cols-5 gap-4 mb-6">
                    {/* Total Products Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Productos en el Inventario</CardTitle>
                            <Box className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{salesData.productsSummary.totalProducts}</div>
                        </CardContent>
                    </Card>

                    {/* Active Products Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Products Activos</CardTitle>
                            <Zap className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{salesData.productsSummary.activeProducts}</div>
                        </CardContent>
                    </Card>
                    {salesData.topProducts.map((product) => (
                        <Card
                            key={product.id}
                            className={`cursor-pointer transition-colors ${selectedProduct === product.id ? 'border-blue-500 bg-blue-50' : ''}`}
                            onClick={() => setSelectedProduct(product.id === selectedProduct ? null : product.id)}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-xl font-bold">{product.sales} units</div>
                                        <p className="text-sm text-primary">${product.revenue.toFixed(2)} en ventas</p>
                                    </div>
                                    {selectedProduct === product.id && (
                                        <Button variant="ghost" size="sm">
                                            Details <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>

            {/* Orders Awaiting Attention */}
            <div>
                <h2 className="text-md font-thin mb-4 text-gray-800">Pedidos pendientes</h2>
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {salesData.pendingOrders.map((order) => (
                                <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <div className="font-medium">Order #{order.id}</div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="font-medium">${order.amount.toFixed(2)}</div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {order.daysPending} day{order.daysPending > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Review
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}