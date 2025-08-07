import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate, NotificationType } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, Fragment, useRef, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import sinPedidos from '@/assets/sin-pedidos.png'
import { ConfigTabs, PRE_ORDER_STATUS } from '@/lib/constants';
import { LuChevronDown, LuChevronUp, LuEye, LuFileCheck } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { usePaginatedPreOrders } from '@/hooks/usePaginatedPreOrders';
import { PaginationCustom } from '@/components/pagination';
import UsePreOrdersPaginationState, { preOrdersSortOptions, preOrdersStatusFilters, PreOrdersSortOptionsType } from '@/store/preOrdersPagination.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/preOrders/')({
    component: () => <PreOrders />
})

export default function PreOrders() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const { notifications } = useNotifications();
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [contentHeights, setContentHeights] = useState<Record<string, number>>({});
    const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const tableRef = useRef<HTMLDivElement>(null);

    const { setPage, page, statusFilter, setStatusFilter, sort, setSort } = UsePreOrdersPaginationState();

    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
        setPagination,
        handleSearch,
    } = usePaginatedPreOrders(companyId);

    // Initialize pagination state - only run once on mount
    useEffect(() => {
        console.log('Initializing search with sort:', sort);
        handleSearch({
            sortByCreated: true,
            sortOrder: sort.sortOrder
        });
    }, [handleSearch, sort.sortOrder]); // Include dependencies to satisfy linter

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

    // Handle status filter change
    const handleStatusFilterChange = useCallback((value: string) => {
        const selectedFilter = preOrdersStatusFilters.find(filter => filter.id === value);
        if (selectedFilter) {
            setStatusFilter(selectedFilter);
            // No llamar a handleSearch aquí
        }
    }, [setStatusFilter]);

    // Handle sort change
    const handleSortChange = useCallback((value: string) => {
        const selectedSort = preOrdersSortOptions.find(option => option.id === value) as PreOrdersSortOptionsType;
        if (selectedSort) {
            setSort(selectedSort);
            // No llamar a handleSearch aquí
        }
    }, [setSort]);

    // useEffect para disparar la búsqueda cuando cambian los filtros
    useEffect(() => {
        handleSearch({
            status: statusFilter.value,
            sortByCreated: true,
            sortOrder: sort.sortOrder
        });
    }, [statusFilter, sort, handleSearch]);

    // Scroll to top function
    const scrollToTop = useCallback(() => {
        tableRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    // Group only orders with a valid groupId, show others as individual rows
    // Use Map to preserve insertion order
    const groupedOrders = new Map<string, PreOrderSchemaType[]>();
    const ungroupedOrders: PreOrderSchemaType[] = [];

    console.log('Received preOrders data:', data?.preOrders);

    data?.preOrders?.forEach(order => {
        // @ts-expect-error: orderGroupId may not exist on legacy orders
        const groupKey = order?.orderGroupId;
        if (groupKey && groupKey !== 'null' && groupKey !== null && groupKey !== undefined && groupKey !== '') {
            if (!groupedOrders.has(groupKey)) groupedOrders.set(groupKey, []);
            groupedOrders.get(groupKey)!.push(order);
        } else {
            ungroupedOrders.push(order);
        }
    });

    // Filter out groups with only one order - they should be shown as individual rows
    const finalGroupedOrders = new Map<string, PreOrderSchemaType[]>();
    const singleOrdersFromGroups: PreOrderSchemaType[] = [];

    groupedOrders.forEach((orders, groupId) => {
        if (orders.length === 1) {
            singleOrdersFromGroups.push(orders[0]);
        } else {
            finalGroupedOrders.set(groupId, orders);
        }
    });

    // Eliminar variables y tipos no usados
    // const allSingleOrders = [...ungroupedOrders, ...singleOrdersFromGroups];
    // const sortedGroupedOrders = Array.from(finalGroupedOrders.entries());

    // --- Agrupamiento preservando el orden original del backend ---
    // Map para saber si ya mostramos un grupo
    const renderedGroups = new Set<string>();
    // Map para agrupar órdenes por groupId
    const groupMap = new Map<string, PreOrderSchemaType[]>();
    data?.preOrders?.forEach((order: PreOrderSchemaType) => {
        // @ts-expect-error: orderGroupId puede no existir
        const groupKey = order?.orderGroupId;
        if (groupKey && groupKey !== 'null' && groupKey !== null && groupKey !== undefined && groupKey !== '') {
            if (!groupMap.has(groupKey)) groupMap.set(groupKey, []);
            groupMap.get(groupKey)!.push(order);
        }
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
        // Check if all internal orders are finished (rejected, accepted, or partially accepted)
        const allFinished = orders.every(order =>
            order.status === PRE_ORDER_STATUS.rejected ||
            order.status === PRE_ORDER_STATUS.accepted ||
            order.status === PRE_ORDER_STATUS.partialyAccepted ||
            order.status === PRE_ORDER_STATUS.processed
        );

        // Check if any internal orders are pending
        const hasPending = orders.some(order =>
            order.status === PRE_ORDER_STATUS.pending
        );

        // If all orders are finished, return 'Procesada'
        if (allFinished) {
            return PRE_ORDER_STATUS.processed;
        }

        // If any order is pending, return 'Pendiente'
        if (hasPending) {
            return PRE_ORDER_STATUS.pending;
        }

        // Default fallback - if all are accepted, return 'Aceptada', else 'Pendiente'
        return orders.every(o => o.status === PRE_ORDER_STATUS.accepted)
            ? PRE_ORDER_STATUS.accepted
            : PRE_ORDER_STATUS.pending;
    }

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
        <div className='w-full flex flex-col gap-2 relative h-full'>
            {/* Header with filters */}
            <div className="bg-accent h-20 w-full pl-14 shadow z-20 flex justify-between items-center sticky top-0 left-0 right-0">
                <div className='w-full flex gap-4'>
                    <div className='flex items-center gap-2 [&>p]:text-nowrap'>
                        <p>Estado</p>
                        <Select onValueChange={handleStatusFilterChange} value={statusFilter.id}>
                            <SelectTrigger className='px-5 w-fit'>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {preOrdersStatusFilters.map((filter) => (
                                    <SelectItem key={filter.id} value={filter.id}>
                                        {filter.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2 [&>p]:text-nowrap'>
                        <p>Ordenar por</p>
                        <Select onValueChange={handleSortChange} value={sort.id} disabled={!data?.preOrders || (data && data.preOrders.length === 0 && statusFilter.id === 'all')}>
                            <SelectTrigger className='px-5 w-fit'>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {preOrdersSortOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className='w-full p-10 flex-1 flex flex-col items-center -mt-5 overflow-hidden'>
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
                        <div className='w-full h-full flex flex-col'>
                            <div className={`flex-1 overflow-y-auto overflow-x-auto ${data && data.totalPages > 1 ? 'pb-20' : ''}`} ref={tableRef}>
                                <Table className="min-w-full">
                                    <TableHeader className='bg-white sticky top-0 z-10 shadow-sm'>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="min-w-[120px]">Numero de Orden</TableHead>
                                            <TableHead className="min-w-[120px]">Creada</TableHead>
                                            <TableHead className="min-w-[80px] text-center">Ordenes</TableHead>
                                            <TableHead className="min-w-[100px] text-center">Estado</TableHead>
                                            <TableHead className="min-w-[160px] text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white">
                                        {/* Recorrer la lista original y renderizar según corresponda */}
                                        {data?.preOrders?.map((order: PreOrderSchemaType) => {
                                            // @ts-expect-error: orderGroupId puede no existir
                                            const groupKey = order?.orderGroupId;
                                            if (groupKey && groupKey !== 'null' && groupKey !== null && groupKey !== undefined && groupKey !== '') {
                                                if (renderedGroups.has(groupKey)) {
                                                    // Ya se mostró este grupo
                                                    return null;
                                                }
                                                renderedGroups.add(groupKey);
                                                const groupOrders = groupMap.get(groupKey)!;
                                                if (groupOrders.length === 1) {
                                                    // Grupo de 1: mostrar como individual
                                                    return (
                                                        <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                                            <TableCell className="min-w-[120px]">{order.preOrderNumber}</TableCell>
                                                            <TableCell className="min-w-[120px]">{formatDate(order.created)}</TableCell>
                                                            <TableCell className="min-w-[80px] text-center"> </TableCell>
                                                            <TableCell className="min-w-[100px] text-center">
                                                                <div className="flex justify-center">
                                                                    <StatusBadge className='py-2 px-6 text-sm' status={order.status} />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="min-w-[160px] text-center">
                                                                <Link to="/client/preOrders/$preOrderId" params={{ preOrderId: order.id }}>
                                                                    <Button variant='ghost' className='space-x-2'>
                                                                        <LuEye className='cursor-pointer' size={20} />
                                                                        <p>Ver Pedido</p>
                                                                    </Button>
                                                                </Link>
                                                                {order.buyOrder && (
                                                                    <Link to="/buyOrder/$orderId" params={{ orderId: order.buyOrder?.id || '' }}>
                                                                        <Button variant='ghost' className='space-x-2'>
                                                                            <LuEye className='cursor-pointer' size={20} />
                                                                            <p>Ver Orden de compra</p>
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                } else {
                                                    // Grupo de varios
                                                    return (
                                                        <Fragment key={groupKey}>
                                                            <TableRow className='bg-white hover:bg-white'>
                                                                <TableCell className="min-w-[120px]">
                                                                    {groupOrders.map((o: PreOrderSchemaType) => o.preOrderNumber).join(', ')}
                                                                </TableCell>
                                                                <TableCell className="min-w-[120px]">{formatDate(groupOrders[0].created)}</TableCell>
                                                                <TableCell className="min-w-[80px] text-center">{groupOrders.length}</TableCell>
                                                                <TableCell className="min-w-[100px] text-center">
                                                                    <div className="flex justify-center">
                                                                        <StatusBadge className='py-2 px-6 text-sm' status={getGroupState(groupOrders)} />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="min-w-[160px] text-center">
                                                                    <Button variant='ghost' className='space-x-2' onClick={() => toggleGroup(groupKey)}>
                                                                        {expandedGroups.has(groupKey)
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
                                                            {/* Expanded rows con transición */}
                                                            <TableRow>
                                                                <TableCell colSpan={6} className="p-0 border-0 bg-transparent">
                                                                    <div
                                                                        className={
                                                                            "transition-all duration-500 ease-out overflow-hidden" +
                                                                            (expandedGroups.has(groupKey) ? "" : " max-h-0")
                                                                        }
                                                                        style={{
                                                                            maxHeight: expandedGroups.has(groupKey)
                                                                                ? `${contentHeights[groupKey] || 0}px`
                                                                                : '0px'
                                                                        }}
                                                                    >
                                                                        <div ref={el => { contentRefs.current[groupKey] = el; }}>
                                                                            <Table className="w-full">
                                                                                <TableBody className="bg-white">
                                                                                    {groupOrders.map((order: PreOrderSchemaType) => (
                                                                                        <TableRow key={order.id} className='bg-gray-300/25 hover:bg-gray-300/15 h-14'>
                                                                                            <TableCell className="min-w-[120px] pl-5">{order.preOrderNumber}</TableCell>
                                                                                            <TableCell className="min-w-[120px]">{formatDate(order.created)}</TableCell>
                                                                                            <TableCell className="min-w-[80px]"></TableCell>
                                                                                            <TableCell className="min-w-[100px] text-center">
                                                                                                <div className="flex justify-center">
                                                                                                    <StatusBadge className='py-2 px-6 text-sm' status={order.status} />
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell className="min-w-[160px] text-center p-0">
                                                                                                <Link to="/client/preOrders/$preOrderId" params={{ preOrderId: order.id }}>
                                                                                                    <Button variant='ghost' className='space-x-2 hover:bg-gray-300/45'>
                                                                                                        <LuEye className='cursor-pointer' size={20} />
                                                                                                        <p>Ver Pedido</p>
                                                                                                    </Button>
                                                                                                </Link>
                                                                                                {order.buyOrder && (
                                                                                                    <Link to="/buyOrder/$orderId" params={{ orderId: order.buyOrder?.id || '' }}>
                                                                                                        <Button variant='ghost' className='space-x-2'>
                                                                                                            <LuFileCheck className='cursor-pointer' size={20} />
                                                                                                            <p>Ver Orden de Compra</p>
                                                                                                        </Button>
                                                                                                    </Link>
                                                                                                )}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </Fragment>
                                                    );
                                                }
                                            } else {
                                                // Orden individual
                                                return (
                                                    <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                                        <TableCell className="min-w-[120px]">{order.preOrderNumber}</TableCell>
                                                        <TableCell className="min-w-[120px]">{formatDate(order.created)}</TableCell>
                                                        <TableCell className="min-w-[80px] text-center"> </TableCell>
                                                        <TableCell className="min-w-[100px] text-center">
                                                            <div className="flex justify-center">
                                                                <StatusBadge className='py-2 px-6 text-sm' status={order.status} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="min-w-[160px] text-center">
                                                            <Link to="/client/preOrders/$preOrderId" params={{ preOrderId: order.id }}>
                                                                <Button variant='ghost' className='space-x-2'>
                                                                    <LuEye className='cursor-pointer' size={20} />
                                                                    <p>Ver Pedido</p>
                                                                </Button>
                                                            </Link>
                                                            {order.buyOrder && (
                                                                <Link to="/buyOrder/$orderId" params={{ orderId: order.buyOrder?.id || '' }}>
                                                                    <Button variant='ghost' className='space-x-2'>
                                                                        <LuEye className='cursor-pointer' size={20} />
                                                                        <p>Ver Orden de compra</p>
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Pagination */}
                            {data && data.totalPages > 1 && (
                                <div className='absolute bottom-0 left-0 right-0 bg-white py-5 shadow-[0_-4px_6px_-1px_rgb(0_0_0/0.1)] border-t'>
                                    <PaginationCustom
                                        currentPage={page}
                                        prev={page > 1}
                                        next={page < data.totalPages}
                                        pages={data.totalPages}
                                        onPageBack={() => {
                                            setPagination(prev => ({ ...prev, page: page - 1 }));
                                            setPage(page - 1);
                                            scrollToTop();
                                        }}
                                        onPageForward={() => {
                                            setPagination(prev => ({ ...prev, page: page + 1 }));
                                            setPage(page + 1);
                                            scrollToTop();
                                        }}
                                        onPageChange={(page: number) => {
                                            setPagination(prev => ({ ...prev, page }));
                                            setPage(page);
                                            scrollToTop();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    )
}