import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { SERVER_SENT_EVENTS, ACCOUNT } from '@/lib/constants';
import { ORDERS_EVENTS_PROVIDER } from '@/lib/orders/endpoints';
import { BuyOrderSchemaType } from '@/lib/schemas/orders.schema';
import { formatDate, numberToTimeString } from '@/lib/utils';
import UseCompanyStore from '@/store/company.store';
import UseUserStore from '@/store/user.store';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Eye } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import noOrders from '@/assets/no-odc.png';
import { subscribeSSE, useSSE } from '@/hooks/server-events/useSse';
import { useBuyOrders } from '@/hooks/useBuyOrders';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/buyOrder/')({
    component: () => <OrdenesDeCompra />,
});

export default function OrdenesDeCompra() {
    const { company } = UseCompanyStore();
    const { user } = UseUserStore();
    const accountType = user?.accountType;
    const companyId = company?.id;

    const queryClient = useQueryClient();

    useSSE(`${ORDERS_EVENTS_PROVIDER}${companyId}`);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useBuyOrders(companyId, accountType === ACCOUNT.client);

    useEffect(() => {
        if (!companyId) return;

        const unsubscribe = subscribeSSE(SERVER_SENT_EVENTS.orderCreated, () => {
            queryClient.invalidateQueries({ queryKey: ['buyOrders', companyId, accountType === ACCOUNT.client] });
        });

        return unsubscribe;
    }, [companyId, accountType, queryClient]);

    if (isError) {
        return (
            <>
                <p>Algo salió mal, vuelve a intentarlo</p>
                <Button onClick={() => refetch()}>Volver a intentar</Button>
            </>
        );
    }

    return (
        <div className='w-full h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-2'>
            <div className='w-full p-10 h-full flex flex-col relative'>
                {data?.length === 0 ? (
                    <div className='w-full h-full flex justify-center items-center absolute top-0 left-0 right-0 bottom-0'>
                        <div className='py-10 px-20 flex flex-col justify-center items-center gap-4'>
                            <img src={noOrders} alt='no tienes ordenes' />
                            <div className='flex flex-col justify-center items-center mb-5'>
                                <p className='text-lg font-bold mt-5'>No tienes ninguna Orden de Compra!</p>
                                <p className='[&>span]:multi-[text-primary;font-thin]'>
                                    Revisa si tienes algun <span>Pedido</span> pendiente!
                                </p>
                            </div>
                            <Link to='/provider/proOrders'>
                                <Button>Ir a Pedidos</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='w-full h-full overflow-y-auto'>
                        <Table>
                            <TableHeader className='bg-white sticky top-0 shadow-sm'>
                                <TableRow className='hover:bg-white'>
                                    <TableHead>Nº de Orden</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Sucursal</TableHead>
                                    <TableHead>Creada</TableHead>
                                    <TableHead>Ultimo dia de entrega</TableHead>
                                    <TableHead>Rango horario de entrega</TableHead>
                                    <TableHead className='text-center'>Orden de Compra</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='bg-white'>
                                {isLoading
                                    ? Array.from({ length: 6 }).map((_, index) => (
                                        <TableRow className='hover:bg-transparent border-none' key={index}>
                                            <TableCell colSpan={7} className='h-0 p-2 border-none hover:none'>
                                                <Skeleton key={index} className='h-14 w-full rounded-sm' />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : data &&
                                    data.map((order: BuyOrderSchemaType) => (
                                        <TableRow className='hover:bg-white first:border-t-none' key={order.id}>
                                            <TableCell>{order.orderNumber}</TableCell>
                                            <TableCell>{order.client.razonSocial}</TableCell>
                                            <TableCell>
                                                {order.branch?.address?.name || (
                                                    <span className='text-destructive/60'>La sucursal fue eliminada</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{formatDate(order.created)}</TableCell>
                                            <TableCell>{formatDate(order.schedule.endDay)}</TableCell>
                                            <TableCell>
                                                {numberToTimeString(order.schedule.startHour)} -{' '}
                                                {numberToTimeString(order.schedule.endHour)}
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <Link to='/buyOrder/$orderId' params={{ orderId: order.id }}>
                                                    <Button variant='ghost' className='space-x-2'>
                                                        <Eye className='cursor-pointer' size={20} />
                                                        <p>Ver Orden de Compra</p>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
