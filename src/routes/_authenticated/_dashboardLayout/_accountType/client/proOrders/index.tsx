import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UseSse } from '@/hooks/useSse';
import { SERVER_SENT_EVENTS } from '@/lib/constants';
import { getAllPreOrders } from '@/lib/orders';
import { ORDERS_EVENTS_PROVIDER } from '@/lib/orders/endpoints';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate } from '@/lib/utils';
import UseCompanyStore from '@/store/company.store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Eye, Minus } from 'lucide-react';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import sinPedidos from '../../../../../../assets/sin-pedidos.png'
import { ConfigTabs } from '@/lib/constants';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/proOrders/')({
    component: () => <Sells />
})

export default function Sells() {
    const { company } = UseCompanyStore();
    const companyId = company?.id;
    const { data: buyOrderStream } = UseSse(`${ORDERS_EVENTS_PROVIDER}${companyId}`);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['preorders', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getAllPreOrders(companyId);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
        refetchOnWindowFocus: true, // Refetch when tab becomes active
        refetchOnMount: true, // Refetch when component mounts
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
                    {
                        data?.preOrders && data?.preOrders.length === 0 ? (
                            <div className='w-full h-full flex justify-center items-center absolute top-0 left-0 right-0 bottom-0'>
                                <div className='py-10 px-20 flex flex-col justify-center items-center gap-4'>
                                    <img src={sinPedidos} alt="no tienes pedidos" />
                                    <div className='flex flex-col justify-center items-center mb-5'>
                                        <p className='text-lg font-bold mt-5'>No tienes ningún Pedido!</p>
                                        <p className='[&>span]:multi-[text-primary;font-thin]'>Revisa que tus <span>Zonas de Entrega</span> o sitios de <span>Pick Up</span> esten bien configurados.</p>
                                    </div>
                                    <Link to="/provider/configuration" search={{ tab: ConfigTabs.COMPANY }}>
                                        <Button>Ir a Configuracion</Button>
                                    </Link>
                                </div>
                            </div>
                        )
                            :
                            <div className='w-full h-full overflow-y-auto'>
                                <Table>
                                    <TableHeader className="bg-white sticky top-0 shadow-sm">
                                        <TableRow className="hover:bg-white">
                                            <TableHead>Nº de Pedido</TableHead>
                                            <TableHead >Fecha</TableHead>
                                            <TableHead >Intento</TableHead>
                                            <TableHead className='text-center'>Estado</TableHead>
                                            <TableHead></TableHead>
                                            <TableHead className='text-right pr-14'>Orden de Compra</TableHead>
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
                                            data?.preOrders && data.preOrders.map((order: PreOrderSchemaType) => (
                                                <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                                    <TableCell>{order.preOrderNumber}</TableCell>
                                                    <TableCell >{formatDate(order.created)}</TableCell>
                                                    <TableCell >{order.instance}</TableCell>
                                                    <TableCell className={`bg-border/20`}>
                                                        <div className='w-full flex justify-center'>
                                                            <StatusBadge className='py-2 px-6 text-sm w-2/3 flex justify-center' status={order.status} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='text-center'>
                                                        <Link to={`/provider/proOrders/$preOrderId`} params={{ preOrderId: order.id }}>
                                                            <Button variant='ghost' className='space-x-2'>
                                                                <Eye className='cursor-pointer' size={20} />
                                                                <p>Ver Pedido</p>
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        {order.buyOrder
                                                            ? (
                                                                <Link to={`/buyOrder/$orderId`} params={{ orderId: order.buyOrder.id }} key={order.buyOrder.id}>
                                                                    <Button variant='ghost' className='space-x-2'>
                                                                        <Eye className='cursor-pointer' size={20} />
                                                                        <p>Ver Ordern de Compra</p>
                                                                    </Button>
                                                                </Link>
                                                            )
                                                            : <div className='flex justify-end mr-20'>
                                                                <Minus size={15} strokeWidth={2} />
                                                            </div>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                    }
                </div>
            </>
        </div>
    )
}