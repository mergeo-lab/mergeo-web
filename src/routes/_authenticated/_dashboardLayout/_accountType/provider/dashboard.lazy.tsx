import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react'
import { ArrowRight, Clock, Box, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TopPerformerCard from '@/components/topPerformerCard';
import SellsInfo from '@/components/dashboard/sellsInfo';
import Chart from '@/components/dashboard/chart';

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/dashboard')({
    component: Index,
})

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
                <SellsInfo />
                <Chart />

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