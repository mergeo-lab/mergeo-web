import { createLazyFileRoute } from '@tanstack/react-router';
import Chart from '@/components/dashboard/chart';
import UseCompanyStore from '@/store/company.store';
import DashboardOrders from '@/components/dashboard/dashboardOrders';
import { ACCOUNT } from '@/lib/constants';
import DashboardBranches from '@/components/dashboard/client/dashboardBranches';
import DashboardListsCount from '@/components/dashboard/client/dashboardListsCount';
import ClientProductsStats from '@/components/dashboard/client/clientProductsStats';

export const Route = createLazyFileRoute('/_authenticated/_dashboardLayout/_accountType/client/dashboard')({
    component: Index,
})

export default function Index() {
    const { getCompanyId } = UseCompanyStore();
    const companyId = getCompanyId();

    return (
        <div className="h-full bg-gray-50 p-6 overflow-auto">
            <div>
                <h2 className=" text-info/70 text-md font-thin mb-4 text-gray-800 ml-3">Ultimos Pedidos</h2>
                <DashboardOrders
                    companyId={companyId}
                    accountType={ACCOUNT.client}
                    queryKey='dashboard-latest-orders'
                    itemsCount={3}
                />
            </div>
            <h2 className=" text-info/70 text-md font-thin my-4 text-gray-800 ml-3">Compras</h2>
            <div className="flex gap-4">
                <div className='flex flex-col gap-4 max-w-xl w-full h-56'>
                    <DashboardBranches companyId={companyId} />
                    <DashboardListsCount companyId={companyId} />
                </div>
                <Chart
                    companyId={companyId}
                    accountType={ACCOUNT.client}
                    queryKey='client-chart' />
            </div>
            <div className='mt-6'>
                <div className='flex items-center'>
                    <h2 className=" text-info/70 text-md font-thin mb-4 text-gray-800 ml-3 w-[39.5rem]">Productos</h2>
                    <h2 className=" text-info/70 text-md font-thin mb-4 text-gray-800 ml- text-nowrap">Productos mas comprados</h2>
                </div>
                <ClientProductsStats companyId={companyId} />
            </div>

        </div>
    )
}