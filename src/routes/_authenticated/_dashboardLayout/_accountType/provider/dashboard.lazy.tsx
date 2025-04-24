import { createLazyFileRoute } from '@tanstack/react-router';
import TopPerformerCard from '@/components/dashboard/topPerformerCard';
import SellsInfo from '@/components/dashboard/sellsInfo';
import Chart from '@/components/dashboard/chart';
import UseCompanyStore from '@/store/company.store';
import ProductsStats from '@/components/dashboard/productsStats';
import BestZone from '@/components/dashboard/bestZone';
import PendingOrders from '@/components/dashboard/pendingOrders';

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/dashboard')({
    component: Index,
})

export default function Index() {
    const { getCompanyId } = UseCompanyStore();
    const companyId = getCompanyId();

    return (
        <div className="h-full bg-gray-50 p-6 overflow-auto">
            <div>
                <h2 className=" text-info/70 text-md font-thin mb-4 text-gray-800 ml-3">Pedidos pendientes</h2>
                <PendingOrders companyId={companyId} />
            </div>
            <h2 className=" text-info/70 text-md font-thin my-4 text-gray-800 ml-3">Ventas</h2>
            <div className="flex gap-4">
                <div className='flex flex-col gap-6 max-w-xl w-full'>
                    <SellsInfo companyId={companyId} />
                    <BestZone companyId={companyId} />
                </div>
                <Chart companyId={companyId} />
            </div>
            <div className='mt-6'>
                <div className='flex items-center'>
                    <h2 className=" text-info/70 text-md font-thin mb-4 text-gray-800 ml-3 w-[39.5rem]">Productos</h2>
                    <h2 className=" text-info/70 text-md font-thin mb-4 text-gray-800 ml- text-nowrap">Productos mas vendidos</h2>
                </div>
                <ProductsStats companyId={companyId} />
            </div>
            <div className='mt-6'>
                <h2 className=" text-info/70 text-md font-thin mb-4 text-gray-800 ml-3">Usuarios</h2>
                <TopPerformerCard companyId={companyId} />
            </div>
        </div>
    )
}