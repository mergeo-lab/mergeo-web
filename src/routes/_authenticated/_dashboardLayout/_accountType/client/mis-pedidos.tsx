import { Skeleton } from '@/components/ui/skeleton';
import { getAllPreOrders } from '@/lib/orders'
import { PreOrderSchemaType } from '@/lib/schemas';
import UseCompanyStore from '@/store/company.store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { formatDate } from '@/lib/utils';
import { UseSse } from '@/hooks/useSse';
import { ORDERS_EVENTS } from '@/lib/orders/endpoints';
import { useEffect } from 'react';
import { Table, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { PreOrderProductsSheet } from '@/components/configuration/client/orders/preOrderProducts.sheet';
import { Button } from '@/components/ui/button';
import { PRE_ORDER_STATUS, SERVER_SENT_EVENTS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import sinPedidos from '@/assets/sinPedidos.png'
import NewOrderButton from '@/components/dashboard/newOrderButton';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/mis-pedidos')({
    component: () => <Pedidos />
})


export default function Pedidos() {
    const { company } = UseCompanyStore();
    const companyId = company?.id;
    const { data: preOrderStream } = UseSse(`${ORDERS_EVENTS}${companyId}`);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['preOrders', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getAllPreOrders(companyId);
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });

    useEffect(() => {
        refetch();
    }, [preOrderStream, refetch]);

    if (data?.preOrders?.length === 0) {
        return (
            <div className={
                "w-full h-full flex flex-col gap-10 pt-28 items-center [&>p]:multi-[font-thin;text-secondary/80;text-center;leading-3;p-0;m-0]"}>
                <img className="h-[250px]" src={sinPedidos} alt="sin pedidos" />
                <h1 className="text-3xl font-thin text-secondary text-wrap text-center leading-3 py-0">Aun no tienes pedidos!</h1>
                <p>Puedes crear un pedido con tus productos favoritos</p>
                <div className='w-52'>
                    <NewOrderButton showArrow={false} />
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <>
                <div>
                    <div className="space-y-4 mt-5 mx-6 opacity-25">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-20 rounded-sm bg-muted/50" />
                        ))}
                    </div>
                </div>
            </>
        )
    }

    function getBadegeForStatus(status: string) {
        switch (status) {
            case PRE_ORDER_STATUS.pending:
                return <Badge className='bg-highlight hover:bg-highlight'>Pendiente</Badge>
            case PRE_ORDER_STATUS.accepted:
                return <Badge>Aceptada</Badge>
            case PRE_ORDER_STATUS.rejected:
                return <Badge variant='destructive'>Rechazada</Badge>
            case PRE_ORDER_STATUS.partialyAccepted:
                return <Badge variant='outline' className='border-dashed border-primary text-primary'>Parcialmente Aceptada</Badge>
            case PRE_ORDER_STATUS.timeout:
                return <Badge className='bg-secondary-background hover:bg-secondary-background'>Expirada</Badge>
            case PRE_ORDER_STATUS.fail:
                return <Badge variant='outline' className='border-destructive text-destructive'>Fallida</Badge>
            default:
                return "bg-gray-500"
        }
    }

    return (
        <>
            <div className='w-full p-10 h-full flex flex-col'>
                <Table>
                    <TableHeader className="bg-white">
                        <TableRow className="hover:bg-white">
                            <TableHead className='w-[120px]'>Nº de Orden</TableHead>
                            <TableHead className={`w-[250px] text-center`}>Fecha</TableHead>
                            <TableHead className={`w-[300px] text-center`}>Proveedor</TableHead>
                            <TableHead className={`w-[100px] text-center`}>Intento</TableHead>
                            <TableHead className={`w-[300px] text-center `}>Estado</TableHead>
                            <TableHead className={`w-[150px] text-center`}>Productos</TableHead>
                            <TableHead className={`w-[15%] text-right pr-12`}>Orden de Compra</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>

                <div className='w-full h-[calc(100%-60px)] overflow-y-scroll'>
                    <Table>
                        <TableHeader className="bg-white">
                            {
                                data && data?.preOrders.map((order: PreOrderSchemaType) => (
                                    <TableRow className="hover:bg-white">
                                        <TableCell className='w-[120px] text-left pl-10'>{order.preOrderNumber}</TableCell>
                                        <TableCell className={`w-[250px] text-center`}>{formatDate(order.created)}</TableCell>
                                        <TableCell className={`w-[300px] text-center`}>{order.provider.razonSocial}</TableCell>
                                        <TableCell className={`w-[100px] text-center`}>{order.instance}</TableCell>
                                        <TableCell className={`w-[300px] text-center bg-border/20 px-0`}>
                                            <div className='w-full flex justify-center'>
                                                {getBadegeForStatus(order.status)}
                                            </div>
                                        </TableCell>
                                        <TableCell className={`w-[150px]`}>
                                            <div className='w-full flex justify-center'>
                                                {order.preOrderProducts &&
                                                    <PreOrderProductsSheet
                                                        triggerButton={
                                                            <Button variant='ghost'>
                                                                <Eye className='cursor-pointer' size={20} />
                                                            </Button>
                                                        }
                                                        orderStatus={order.status as PRE_ORDER_STATUS}
                                                        products={order.preOrderProducts}
                                                    />
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell className={`w-[200px] text-center`}>-</TableCell>
                                    </TableRow>
                                ))}
                        </TableHeader>
                    </Table>
                </div>
            </div>
        </>
    )
}
