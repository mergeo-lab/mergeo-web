import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllPreOrders } from '@/lib/orders';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate, NotificationType } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, Fragment, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import sinPedidos from '@/assets/sin-pedidos.png'
import { ConfigTabs, PRE_ORDER_STATUS, ACCOUNT } from '@/lib/constants';
import { LuChevronDown, LuChevronUp, LuEye } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/proOrders/')({
    component: () => <PreOrders />
})

export default function PreOrders() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const { notifications } = useNotifications();
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [contentHeights, setContentHeights] = useState<Record<string, number>>({});
    const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const { data, isLoading, isError, isFetching, refetch } = useQuery({
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
            refetch();
        }
    }, [notifications, refetch]);

    // Filter orders based on account type
    // Providers see all orders including rejected ones
    // Clients don't see rejected orders as they are no longer actionable
    const filteredOrders = (data?.preOrders || []).filter(order => {
        const accountType = account?.user?.accountType;

        // For clients, filter out rejected orders
        if (accountType === ACCOUNT.client && order.status === PRE_ORDER_STATUS.rejected) {
            return false;
        }

        // For providers, show all orders including rejected ones
        return true;
    });

    // Group only orders with a valid groupId, show others as individual rows
    const groupedOrders: Record<string, PreOrderSchemaType[]> = {};
    const ungroupedOrders: PreOrderSchemaType[] = [];

    filteredOrders.forEach(order => {
        // @ts-expect-error: orderGroupId may not exist on legacy orders
        const groupKey = order?.orderGroupId;
        if (groupKey && groupKey !== 'null' && groupKey !== null && groupKey !== undefined && groupKey !== '') {
            if (!groupedOrders[groupKey]) groupedOrders[groupKey] = [];
            groupedOrders[groupKey].push(order);
        } else {
            ungroupedOrders.push(order);
        }
    });

    // Filter out groups with only one order - they should be shown as individual rows
    const finalGroupedOrders: Record<string, PreOrderSchemaType[]> = {};
    const singleOrdersFromGroups: PreOrderSchemaType[] = [];

    Object.entries(groupedOrders).forEach(([groupId, orders]) => {
        if (orders.length === 1) {
            singleOrdersFromGroups.push(orders[0]);
        } else {
            finalGroupedOrders[groupId] = orders;
        }
    });

    // Combine single orders from groups with ungrouped orders
    const allSingleOrders = [...ungroupedOrders, ...singleOrdersFromGroups];

    // Sort all orders by order number (highest first)
    allSingleOrders.sort((a, b) => b.preOrderNumber - a.preOrderNumber);

    // Sort grouped orders by the highest order number in each group
    const sortedGroupedOrders = Object.entries(finalGroupedOrders)
        .sort(([, ordersA], [, ordersB]) => {
            const highestA = Math.max(...ordersA.map(o => o.preOrderNumber));
            const highestB = Math.max(...ordersB.map(o => o.preOrderNumber));
            return highestB - highestA; // Highest first
        });

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
                // Measure content height when expanding
                setTimeout(() => {
                    const contentElement = contentRefs.current[groupId];
                    if (contentElement) {
                        const height = contentElement.scrollHeight;
                        setContentHeights(prev => ({ ...prev, [groupId]: height }));
                    }
                }, 0);
            }
            return newSet;
        });
    };

    // Helper to get group state
    function getGroupState(orders: PreOrderSchemaType[]) {
        // If all are accepted, return 'Aceptada', else 'Pendiente'
        return orders.every(o => o.status === PRE_ORDER_STATUS.accepted) ? PRE_ORDER_STATUS.accepted : PRE_ORDER_STATUS.pending;
    }

    // Prepare a unified list for rendering, each with a type and highestOrderNumber
    type RowType = { type: 'group', groupId: string, orders: PreOrderSchemaType[], highestOrderNumber: number } | { type: 'single', order: PreOrderSchemaType, highestOrderNumber: number };

    const unifiedRows: RowType[] = [
        ...sortedGroupedOrders.map(([groupId, orders]) => ({
            type: 'group' as const,
            groupId,
            orders,
            highestOrderNumber: Math.max(...orders.map(o => o.preOrderNumber)),
        })),
        ...allSingleOrders.map(order => ({
            type: 'single' as const,
            order,
            highestOrderNumber: order.preOrderNumber,
        })),
    ];

    // Sort all rows by highestOrderNumber descending
    unifiedRows.sort((a, b) => b.highestOrderNumber - a.highestOrderNumber);

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

    if (isLoading || isFetching) {
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
            <div className='w-full p-10 h-full flex flex-col items-center -mt-5'>
                {
                    (!data?.preOrders || data?.preOrders.length === 0) ? (
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
                    ) : (
                        <div className='w-full'>
                            <div className="relative max-h-[750px] w-full overflow-y-auto">
                                <Table>
                                    <TableHeader className='bg-white sticky top-0 z-10 shadow-sm'>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[150px]">Numero de Orden</TableHead>
                                            <TableHead className="w-[150px]">Creada</TableHead>
                                            <TableHead className="w-[150px] text-center">Ordenes</TableHead>
                                            <TableHead className="w-[150px] text-center">Estado</TableHead>
                                            <TableHead className="w-[150px] text-center"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white">
                                        {/* Show grouped orders */}
                                        {unifiedRows.map((row, index) => (
                                            <Fragment key={index}>
                                                {row.type === 'group' ? (
                                                    <>
                                                        <TableRow className='bg-white hover:bg-white'>
                                                            <TableCell className="w-[150px]">
                                                                {row.orders.length === 1
                                                                    ? `${row.orders[0].preOrderNumber}`
                                                                    : row.orders.length === 2
                                                                        ? `${row.orders[0].preOrderNumber}, ${row.orders[1].preOrderNumber}`
                                                                        : `${row.orders[0].preOrderNumber}...${row.orders[row.orders.length - 1].preOrderNumber}`
                                                                }
                                                            </TableCell>
                                                            <TableCell className="w-[150px]">{formatDate(row.orders[0].created)}</TableCell>
                                                            <TableCell className="w-[150px] text-center">{row.orders.length}</TableCell>
                                                            <TableCell className="w-[150px] text-center">
                                                                <div className="flex justify-center">
                                                                    <StatusBadge className='py-2 px-6 text-sm' status={getGroupState(row.orders)} />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="w-[150px] text-center">
                                                                <Button variant='ghost' className='space-x-2' onClick={() => toggleGroup(row.groupId)}>
                                                                    {expandedGroups.has(row.groupId)
                                                                        ? <div className='flex justify-center items-center'>
                                                                            <p>Ocultar</p>
                                                                            <LuChevronUp className='cursor-pointer' size={20} />
                                                                        </div>
                                                                        : <div className='flex justify-center items-center'>
                                                                            <p>Ver Todas</p>
                                                                            <LuChevronDown className='cursor-pointer' size={20} />
                                                                        </div>
                                                                    }
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                        {/* Expanded rows with transition */}
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="p-0 border-0 bg-transparent">
                                                                <div
                                                                    className={
                                                                        "transition-all duration-500 ease-out overflow-hidden" +
                                                                        (expandedGroups.has(row.groupId) ? "" : " max-h-0")
                                                                    }
                                                                    style={{
                                                                        maxHeight: expandedGroups.has(row.groupId)
                                                                            ? `${contentHeights[row.groupId] || 0}px`
                                                                            : '0px'
                                                                    }}
                                                                >
                                                                    <div ref={el => { contentRefs.current[row.groupId] = el; }}>
                                                                        <Table className="w-full">
                                                                            <TableBody className="bg-white">
                                                                                {row.orders.map(order => (
                                                                                    <TableRow key={order.id} className='bg-gray-300/15 hover:bg-gray-300/15 h-14'>
                                                                                        <TableCell className="w-[138px] pl-5">{order.preOrderNumber}</TableCell>
                                                                                        <TableCell className="w-[150px]">{formatDate(order.created)}</TableCell>
                                                                                        <TableCell className="w-[135px]"></TableCell>
                                                                                        <TableCell className="w-[170px] text-center">
                                                                                            <div className="flex justify-center">
                                                                                                <StatusBadge className='py-2 px-6 text-sm' status={order.status} />
                                                                                            </div>
                                                                                        </TableCell>
                                                                                        <TableCell className="w-[135px] text-center">
                                                                                            <Link to="/client/proOrders/$preOrderId" params={{ preOrderId: order.id }}>
                                                                                                <Button variant='ghost' className='space-x-2 hover:bg-gray-300/45'>
                                                                                                    <LuEye className='cursor-pointer' size={20} />
                                                                                                    <p>Ver Pedido</p>
                                                                                                </Button>
                                                                                            </Link>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    </>
                                                ) : (
                                                    <TableRow className="hover:bg-white first:border-t-none" key={row.order.id}>
                                                        <TableCell className="w-[150px]">{row.order.preOrderNumber}</TableCell>
                                                        <TableCell className="w-[150px]">{formatDate(row.order.created)}</TableCell>
                                                        <TableCell className="w-[150px] text-center"> </TableCell>
                                                        <TableCell className="w-[150px] text-center">
                                                            <div className="flex justify-center">
                                                                <StatusBadge className='py-2 px-6 text-sm' status={row.order.status} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="w-[150px] text-center">
                                                            <Link to="/client/proOrders/$preOrderId" params={{ preOrderId: row.order.id }}>
                                                                <Button variant='ghost' className='space-x-2'>
                                                                    <LuEye className='cursor-pointer' size={20} />
                                                                    <p>Ver Pedido</p>
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}