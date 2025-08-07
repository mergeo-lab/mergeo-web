import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate, NotificationType } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import sinPedidos from '@/assets/sin-pedidos.png'
import { ConfigTabs } from '@/lib/constants';
import { LuEye, LuFileCheck } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { usePaginatedSellPreOrders } from '@/hooks/usePaginatedPreOrders';
import { PaginationCustom } from '@/components/pagination';
import UseProviderPreOrdersPaginationState, { preOrdersSortOptions, preOrdersStatusFilters, preOrdersZoneFilters } from '@/store/preOrdersPagination.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Safe formatDate wrapper to handle invalid dates
const safeFormatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Fecha inválida';
        return formatDate(dateString);
    } catch {
        return 'Fecha inválida';
    }
};

// Format delivery date range
const formatDeliveryDateRange = (startDay: string | undefined, endDay: string | undefined): React.ReactNode => {
    if (!startDay || !endDay) return 'N/A';

    try {
        const startDate = new Date(startDay);
        const endDate = new Date(endDay);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'Fecha inválida';

        const formatDay = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            return `${day}/${month}`;
        };

        const startFormatted = formatDay(startDate);
        const endFormatted = formatDay(endDate);

        return (<p>Desde el {startFormatted}<br />  Hasta el {endFormatted}</p >);
    } catch {
        return 'Fecha inválida';
    }
};

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/preOrders/')({
    component: () => <Sells />
})

export default function Sells() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const { notifications } = useNotifications();
    const tableRef = useRef<HTMLDivElement>(null);

    const { setPage, page, statusFilter, setStatusFilter, zoneFilter, setZoneFilter, sort, setSort } = UseProviderPreOrdersPaginationState();

    const {
        data,
        allPreOrdersData,
        isLoading,
        isError,
        refetch,
        setPagination,
        handleSearch,
    } = usePaginatedSellPreOrders(companyId);

    // Listen for pre-order created notifications
    useEffect(() => {
        const preOrderCreatedNotifications = notifications.filter(
            notification => notification.type === NotificationType.PRE_ORDER_CREATED || notification.type === NotificationType.PRE_ORDER_UPDATED
        );

        if (preOrderCreatedNotifications.length > 0) {
            // If we have any new pre-order notifications, refetch the list
            refetch();
        }
    }, [notifications, refetch]);

    // Temporary: use filtered data to test if the logic works
    const testData = allPreOrdersData || data?.preOrders || [];

    const uniqueZones = (() => {
        if (!testData || !Array.isArray(testData)) {
            return [];
        }
        const zones = Array.from(
            new Map(
                testData
                    .filter(order => order && order.dropZoneId && order.dropZoneName)
                    .map(order => [order.dropZoneId, { id: order.dropZoneId, name: order.dropZoneName }])
            ).values()
        );

        return zones;
    })();

    // Create dynamic zone filters based on available data
    const availableZoneFilters = useMemo(() => [
        ...preOrdersZoneFilters,
        ...uniqueZones.map(zone => ({
            id: zone.id,
            name: zone.name,
            value: zone.id,
        }))
    ], [uniqueZones]);

    // Handle all filter changes
    useEffect(() => {
        handleSearch({
            sortByCreated: true,
            sortOrder: sort.sortOrder,
            ...(statusFilter.value !== '' && { status: statusFilter.value }),
            ...(zoneFilter.value !== '' && { zone: zoneFilter.value })
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort.sortOrder, statusFilter.value, zoneFilter.value]); // Depend on sort, status filter, and zone filter

    // Handle status filter change
    const handleStatusFilterChange = useCallback((value: string) => {
        const selectedFilter = preOrdersStatusFilters.find(filter => filter.id === value);
        if (selectedFilter) {
            setStatusFilter(selectedFilter);
            // Don't call handleSearch here, let the useEffect handle it
        }
    }, [setStatusFilter]);

    // Handle zone filter change
    const handleZoneFilterChange = useCallback((value: string) => {
        const selectedFilter = availableZoneFilters.find(filter => filter.id === value);
        if (selectedFilter) {
            setZoneFilter(selectedFilter);
            // Don't call handleSearch here, let the useEffect handle it
        }
    }, [setZoneFilter, availableZoneFilters]);

    // Handle sort change
    const handleSortChange = useCallback((value: string) => {
        const selectedSort = preOrdersSortOptions.find(sort => sort.id === value);
        if (selectedSort) {
            setSort(selectedSort);
            // Don't call handleSearch here, let the useEffect handle it
        }
    }, [setSort]);


    const scrollToTop = useCallback(() => {
        tableRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

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
        <div className='w-full flex flex-col gap-2 relative h-full'>
            {/* Sticky header with filters */}
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
                        <p>Zona</p>
                        <Select onValueChange={handleZoneFilterChange} value={zoneFilter.id}>
                            <SelectTrigger className='px-5 w-fit'>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableZoneFilters.map((filter) => (
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
                                            <TableHead className="min-w-[120px]">Número de Pedido</TableHead>
                                            <TableHead className="min-w-[120px]">Fecha</TableHead>
                                            <TableHead className="min-w-[120px]">Zona</TableHead>
                                            <TableHead className="min-w-[100px] text-center">Instancia</TableHead>
                                            <TableHead className="min-w-[140px] text-center">Fecha de Entrega</TableHead>
                                            <TableHead className="min-w-[100px] text-center">Estado</TableHead>
                                            <TableHead className="min-w-[120px] text-center">Acciones</TableHead>
                                            <TableHead className="min-w-[160px] text-right pr-14">Orden de Compra</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white">
                                        {data.preOrders
                                            .filter((order) => order && order.id) // Filter out any null/undefined orders
                                            .map((order: PreOrderSchemaType) => {
                                                return (
                                                    <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                                        <TableCell className="min-w-[120px]">{order.preOrderNumber || 'N/A'}</TableCell>
                                                        <TableCell className="min-w-[120px]">{safeFormatDate(order.created)}</TableCell>
                                                        <TableCell className="min-w-[120px]">{order.dropZoneName || 'N/A'}</TableCell>
                                                        <TableCell className="min-w-[100px] text-center">{order.instance || 'N/A'}</TableCell>
                                                        <TableCell className="min-w-[140px] text-center">
                                                            {order.criteria?.expectedDeliveryStartDay && order.criteria?.expectedDeliveryEndDay
                                                                ? formatDeliveryDateRange(order.criteria.expectedDeliveryStartDay, order.criteria.expectedDeliveryEndDay)
                                                                : 'N/A'
                                                            }
                                                        </TableCell>
                                                        <TableCell className="min-w-[100px] text-center">
                                                            <div className="flex justify-center">
                                                                <StatusBadge className='py-2 px-6 text-sm' status={order.status || 'unknown'} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="min-w-[120px] text-center">
                                                            <Link to={`/provider/preOrders/$preOrderId`} params={{ preOrderId: order.id }}>
                                                                <Button variant='ghost' className='space-x-2'>
                                                                    <LuEye className='cursor-pointer' size={20} />
                                                                    <p>Ver Pedido</p>
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="min-w-[160px] text-right">
                                                            {order.buyOrder
                                                                ? (
                                                                    <Link to={`/buyOrder/$orderId`} params={{ orderId: order.buyOrder.id }} key={order.buyOrder.id}>
                                                                        <Button variant='ghost' className='space-x-2'>
                                                                            <LuFileCheck className='cursor-pointer' size={20} />
                                                                            <p>Ver Orden de Compra</p>
                                                                        </Button>
                                                                    </Link>
                                                                )
                                                                : <div className='flex justify-end mr-20'>
                                                                    <span className="text-gray-400">-</span>
                                                                </div>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
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
    );
}