import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllPreOrders } from '@/lib/orders';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate, NotificationType } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import sinPedidos from '@/assets/sin-pedidos.png'
import { ConfigTabs } from '@/lib/constants';
import { LuEye, LuMinus } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/proOrders/')({
    component: () => <PreOrders />
})

export default function PreOrders() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const { notifications } = useNotifications();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['preorders', companyId],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getAllPreOrders(companyId);
        },
        enabled: !!companyId,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    // Listen for pre-order notifications
    useEffect(() => {
        const relevantNotifications = notifications.filter(
            notification =>
                notification.type === NotificationType.PRE_ORDER_CREATED ||
                notification.type === NotificationType.PRE_ORDER_UPDATED
        );

        if (relevantNotifications.length > 0) {
            // If we have any new or updated pre-order notifications, refetch the list
            refetch();
        }
    }, [notifications, refetch]);

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-lg text-gray-600">Algo salió mal, vuelve a intentarlo</p>
                <Button onClick={() => refetch()} variant="outline">
                    Volver a intentar
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full p-10">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col gap-2 relative'>
            <>
                <div className='w-full p-10 h-full flex flex-col items-center -mt-5'>
                    {
                        data?.preOrders && data?.preOrders.length === 0 ? (
                            <div className='w-full h-[calc(100vh-10rem)] flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 '>
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
                            <div className='w-full'>
                                <div className="relative max-h-[750px] w-full overflow-y-auto">
                                    <Table>
                                        <TableHeader className='bg-white sticky top-0 z-10 shadow-sm'>
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="w-[150px]">Número</TableHead>
                                                <TableHead className="w-[150px]">Fecha</TableHead>
                                                <TableHead className="w-[150px] text-center">Instancia</TableHead>
                                                <TableHead className="w-[150px] text-center">Estado</TableHead>
                                                <TableHead className="w-[150px] text-center">Ver Pedido</TableHead>
                                                <TableHead className="w-[200px] text-right pr-14">Ver Orden de Compra</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="bg-white">
                                            {isLoading
                                                ? (
                                                    Array.from({ length: 6 }).map((_, index) => (
                                                        <TableRow key={"tr-" + index} className="hover:bg-transparent border-none">
                                                            <TableCell colSpan={6} className="h-0 p-2 border-none hover:none ">
                                                                <Skeleton key={index} className="h-14 w-full rounded-sm" />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )
                                                :
                                                data?.preOrders && data.preOrders.map((order: PreOrderSchemaType) => (
                                                    <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                                        <TableCell className="w-[150px]">{order.preOrderNumber}</TableCell>
                                                        <TableCell className="w-[150px]">{formatDate(order.created)}</TableCell>
                                                        <TableCell className="w-[150px] text-center">{order.instance}</TableCell>
                                                        <TableCell className="w-[150px] text-center">
                                                            <div className="flex justify-center">
                                                                <StatusBadge className='py-2 px-6 text-sm' status={order.status} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="w-[150px] text-center">
                                                            <Link to={`/provider/proOrders/$preOrderId`} params={{ preOrderId: order.id }}>
                                                                <Button variant='ghost' className='space-x-2'>
                                                                    <LuEye className='cursor-pointer' size={20} />
                                                                    <p>Ver Pedido</p>
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="w-[200px] text-right">
                                                            {order?.orderId
                                                                ? (
                                                                    <Link to={`/buyOrder/$orderId`} params={{ orderId: order?.orderId }} key={order?.orderId}>
                                                                        <Button variant='ghost' className='space-x-2'>
                                                                            <LuEye className='cursor-pointer' size={20} />
                                                                            <p>Ver Orden de Compra</p>
                                                                        </Button>
                                                                    </Link>
                                                                )
                                                                : <div className='flex justify-end mr-20'>
                                                                    <LuMinus size={15} strokeWidth={2} />
                                                                </div>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                    }
                </div>
            </>
        </div>
    )
}