import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UseSse } from '@/hooks/useSse';
import { SERVER_SENT_EVENTS } from '@/lib/constants';
import { getSellPreOrders } from '@/lib/orders';
import { ORDERS_EVENTS_PROVIDER } from '@/lib/orders/endpoints';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import UseCompanyStore from '@/store/company.store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Eye, Minus } from 'lucide-react';
import { useEffect } from 'react';
import { TrafficCone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/proOrders/')({
    component: () => <Sells />
})

export default function Sells() {
    const { company } = UseCompanyStore();
    const companyId = company?.id;
    const { data: buyOrderStream } = UseSse(`${ORDERS_EVENTS_PROVIDER}${companyId}`);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['providerPreOrders', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getSellPreOrders(companyId);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });

    useEffect(() => {
        if (buyOrderStream?.message === SERVER_SENT_EVENTS.preOrderCreated) {
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
        <div className='w-full h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-2 relative'>
            <>
                <div className='w-full p-10 h-full flex flex-col'>

                    <div className='w-full h-full overflow-y-auto'>
                        <Table>
                            <TableHeader className="bg-white sticky top-0 shadow-sm">
                                <TableRow className="hover:bg-white">
                                    <TableHead>Nº de Orden</TableHead>
                                    <TableHead >Fecha</TableHead>
                                    <TableHead >Intento</TableHead>
                                    <TableHead className='text-center'>Estado</TableHead>
                                    <TableHead></TableHead>
                                    <TableHead className='text-right'>Orden de Compra</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-white">
                                {isLoading
                                    ? (
                                        Array.from({ length: 6 }).map((_, index) => (
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableCell colSpan={6} className="h-0 p-2 border-none hover:none ">
                                                    <Skeleton key={index} className="h-14 w-full opacity-10 bg-muted/30 rounded-sm" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )
                                    :
                                    (data || []).map((order: PreOrderSchemaType) => (
                                        <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                            <TableCell>{order.preOrderNumber}</TableCell>
                                            <TableCell >{formatDate(order.created)}</TableCell>
                                            <TableCell >{order.instance}</TableCell>
                                            <TableCell className={`bg-border/20`}>
                                                <div className='w-full flex justify-center'>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <Link to={`/provider/proOrders/${order.id}`}>
                                                    <Button variant='ghost'>
                                                        <Eye className='cursor-pointer' size={20} />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {order.buyOrder
                                                    ? (
                                                        <Link to={`/buyOrder/${order.buyOrder.id}`}>
                                                            <Button variant='ghost'>
                                                                Ver Ordern
                                                            </Button>
                                                        </Link>
                                                    )
                                                    : <div className='flex justify-end mr-8'>
                                                        <Minus size={15} strokeWidth={2} />
                                                    </div>
                                                }
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
                                        <p className='text-center text-2xl font-thin text-secondary/60'>No tienes Pedios!</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </>
        </div>
    )
}