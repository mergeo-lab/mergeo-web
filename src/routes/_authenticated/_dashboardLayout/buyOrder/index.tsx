import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { UseSse } from '@/hooks/useSse';
import { ACCOUNT, SERVER_SENT_EVENTS } from '@/lib/constants';
import { getAllBuyOrders } from '@/lib/orders';
import { ORDERS_EVENTS_PROVIDER } from '@/lib/orders/endpoints';
import { BuyOrderSchemaType } from '@/lib/schemas/orders.schema';
import { formatDate, numberToTimeString } from '@/lib/utils';
import UseCompanyStore from '@/store/company.store';
import UseUserStore from '@/store/user.store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Eye, TrafficCone } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/buyOrder/')({
    component: () => <OrdenesDeCompra />
})

export default function OrdenesDeCompra() {
    const { company } = UseCompanyStore();
    const { user } = UseUserStore();
    const accountType = user?.accountType;

    const companyId = company?.id;
    const { data: buyOrderStream } = UseSse(`${ORDERS_EVENTS_PROVIDER}${companyId}`);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['buyOrders', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getAllBuyOrders(companyId, accountType === ACCOUNT.client);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });

    useEffect(() => {
        if (buyOrderStream?.message === SERVER_SENT_EVENTS.orderCreated) {
            refetch();
        }
    }, [buyOrderStream, refetch]);

    if (isError) {
        return (
            <>
                <p>Algo salio mal vuelve a intentarlo</p>
                <Button onClick={() => refetch()}>Volver a intentat</Button>
            </>
        )
    }

    return (
        <div className='w-full h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-2'>
            <>
                <div className='w-full p-10 h-full flex flex-col relative'>

                    <div className='w-full h-full overflow-y-auto'>
                        <Table>
                            <TableHeader className="bg-white sticky top-0 shadow-sm">
                                <TableRow className="hover:bg-white">
                                    <TableHead>Nº de Orden</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Sucursal</TableHead>
                                    <TableHead>Creada</TableHead>
                                    <TableHead>Ultimo dia de entrega</TableHead>
                                    <TableHead>
                                        Rango horario de entrega
                                    </TableHead>
                                    <TableHead className={`w-[15%] text-right pr-12`}>Orden de Compra</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-white">
                                {isLoading
                                    ?
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableCell colSpan={7} className="h-0 p-2 border-none hover:none ">
                                                <Skeleton key={index} className="h-14 w-full opacity-10 bg-muted/30 rounded-sm" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    :
                                    data && data.map((order: BuyOrderSchemaType) => (
                                        <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                            <TableCell>{order.orderNumber}</TableCell>
                                            <TableCell>{order.client.razonSocial}</TableCell>
                                            <TableCell>{order.branch.address.name}</TableCell>
                                            <TableCell >{formatDate(order.created)}</TableCell>
                                            <TableCell >{
                                                formatDate(order.schedule.endDay)
                                            }</TableCell>

                                            <TableCell >
                                                {numberToTimeString(order.schedule.startHour)} - {numberToTimeString(order.schedule.endHour)}
                                            </TableCell>
                                            <TableCell >
                                                <Link to={`/buyOrder/${order.id}`}>
                                                    <Button variant='ghost'>
                                                        <Eye className='cursor-pointer' size={20} />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                    {
                        data?.length === 0 && (
                            <div className='w-full h-full flex justify-center items-center absolute top-0 left-0 right-0 bottom-0'>
                                <div className='py-10 px-20 shadow rounded flex flex-col justify-center items-center gap-2'>
                                    <TrafficCone size={50} strokeWidth={1} className='text-highlight' />
                                    <div>
                                        <p className='text-center text-2xl font-thin text-secondary/60'>No tienes Ordenes de Compra!</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </>
        </div >
    )
}