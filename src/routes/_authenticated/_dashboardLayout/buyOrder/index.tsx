import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { ACCOUNT } from '@/lib/constants';
import { BuyOrderSchemaType } from '@/lib/schemas/orders.schema';
import { formatDate, numberToTimeString } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import noOrders from '@/assets/no-odc.png';
import { useBuyOrders } from '@/hooks/useBuyOrders';
import { LuFileCheck } from 'react-icons/lu';
import { RiCheckboxMultipleBlankLine } from 'react-icons/ri';
import { useAuth } from '@/context/AuthContext';
import { useMarkBuyOrderAsViewed } from '@/hooks/useMarkBuyOrderAsViewed';
import AnimatedCheck from '@/components/animatedCheck';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/buyOrder/')({
    component: () => <OrdenesDeCompra />,
});

export default function OrdenesDeCompra() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const accountType = account?.user?.accountType;

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useBuyOrders(companyId, accountType === ACCOUNT.client);

    const markAsViewedMutation = useMarkBuyOrderAsViewed();

    const handleMarkAsViewed = (orderId: string) => {
        markAsViewedMutation.mutate(orderId);
    };


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
                                    <TableHead className='w-[20%]'>Sucursal</TableHead>
                                    <TableHead>Creada</TableHead>
                                    <TableHead>Ultimo dia de entrega</TableHead>
                                    <TableHead>Rango horario de entrega</TableHead>
                                    <TableHead className='text-center'>Detalle</TableHead>
                                    <TableHead className='text-center'>Vista</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='bg-white'>
                                {isLoading
                                    ? Array.from({ length: 6 }).map((_, index) => (
                                        <TableRow className='hover:bg-transparent border-none' key={index}>
                                            <TableCell colSpan={8} className='h-0 p-2 border-none hover:none'>
                                                <Skeleton key={index} className='h-14 w-full rounded-sm' />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : data &&
                                    data.map((order: BuyOrderSchemaType) => (
                                        <TableRow className='hover:bg-white first:border-t-none' key={order.id}>
                                            <TableCell>{order.orderNumber}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <p>{order.client.name}</p>
                                                    <p className='text-xs'>{order.client.razonSocial.toLocaleUpperCase()}</p>
                                                </div>
                                            </TableCell>
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
                                                        <LuFileCheck className='cursor-pointer' size={20} />
                                                        <p>Ver Orden de Compra</p>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                {order.markedAsViewd === true ? (
                                                    <AnimatedCheck />
                                                ) : (
                                                    <Button
                                                        variant='ghost'
                                                        onClick={() => handleMarkAsViewed(order.id)}
                                                        disabled={markAsViewedMutation.isPending}
                                                        className='w-fit h-fit'
                                                    >
                                                        <RiCheckboxMultipleBlankLine className='text-gray-400' size={20} />
                                                    </Button>
                                                )}
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
