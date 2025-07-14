import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PreOrderSchemaType } from '@/lib/schemas';
import { formatDate, NotificationType } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import sinPedidos from '@/assets/sin-pedidos.png'
import { ConfigTabs } from '@/lib/constants';
import { LuEye, LuFileCheck } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { usePaginatedSellPreOrders } from '@/hooks/usePaginatedPreOrders';
import { PaginationCustom } from '@/components/pagination';
import UseProviderPreOrdersPaginationState, { preOrdersSortOptions, preOrdersStatusFilters } from '@/store/preOrdersPagination.store';
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

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/preOrders/')({
    component: () => <Sells />
})

export default function Sells() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const { notifications } = useNotifications();
    const tableRef = useRef<HTMLDivElement>(null);

    const { setPage, page, statusFilter, setStatusFilter, sort, setSort } = UseProviderPreOrdersPaginationState();

    const {
        data,
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

    // Handle all filter changes
    useEffect(() => {
        console.log('Filter effect triggered with sort:', sort, 'and status:', statusFilter);
        handleSearch({
            sortByCreated: true,
            sortOrder: sort.sortOrder,
            ...(statusFilter.value !== '' && { status: statusFilter.value })
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort.sortOrder, statusFilter.value]); // Depend on both sort and status filter

    // Handle status filter change
    const handleStatusFilterChange = useCallback((value: string) => {
        const selectedFilter = preOrdersStatusFilters.find(filter => filter.id === value);
        if (selectedFilter) {
            setStatusFilter(selectedFilter);
            // Don't call handleSearch here, let the useEffect handle it
        }
    }, [setStatusFilter]);

    // Handle sort change
    const handleSortChange = useCallback((value: string) => {
        const selectedSort = preOrdersSortOptions.find(sort => sort.id === value);
        if (selectedSort) {
            console.log('Changing sort to:', selectedSort);
            setSort(selectedSort);
            // Don't call handleSearch here, let the useEffect handle it
        }
    }, [setSort]);

    // Debug: Log current state
    useEffect(() => {
        console.log('Current sort state:', sort);
        console.log('Current status filter:', statusFilter);
    }, [sort, statusFilter]);

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
        <div className='w-full flex flex-col gap-2 relative'>
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
                            <div className="relative max-h-[750px] w-full overflow-y-auto" ref={tableRef}>
                                <Table>
                                    <TableHeader className='bg-white sticky top-0 z-10 shadow-sm'>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[150px]">Número de Pedido</TableHead>
                                            <TableHead className="w-[150px]">Fecha</TableHead>
                                            <TableHead className="w-[150px]">Zona</TableHead>
                                            <TableHead className="w-[150px] text-center">Instancia</TableHead>
                                            <TableHead className="w-[150px] text-center">Estado</TableHead>
                                            <TableHead className="w-[150px] text-center">Acciones</TableHead>
                                            <TableHead className="w-[200px] text-right pr-14">Orden de Compra</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white">
                                        {data.preOrders
                                            .filter((order) => order && order.id) // Filter out any null/undefined orders
                                            .map((order: PreOrderSchemaType) => {
                                                return (
                                                    <TableRow className="hover:bg-white first:border-t-none" key={order.id}>
                                                        <TableCell className="w-[150px]">{order.preOrderNumber || 'N/A'}</TableCell>
                                                        <TableCell className="w-[150px]">{safeFormatDate(order.created)}</TableCell>
                                                        <TableCell className="w-[150px]">{order.dropZoneName || 'N/A'}</TableCell>
                                                        <TableCell className="w-[150px] text-center">{order.instance || 'N/A'}</TableCell>
                                                        <TableCell className="w-[150px] text-center">
                                                            <div className="flex justify-center">
                                                                <StatusBadge className='py-2 px-6 text-sm' status={order.status || 'unknown'} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="w-[150px] text-center">
                                                            <Link to={`/provider/preOrders/$preOrderId`} params={{ preOrderId: order.id }}>
                                                                <Button variant='ghost' className='space-x-2'>
                                                                    <LuEye className='cursor-pointer' size={20} />
                                                                    <p>Ver Pedido</p>
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="w-[200px] text-right">
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
                                <div className='sticky bottom-0 bg-white py-5 shadow-[0_-4px_6px_-1px_rgb(0_0_0/0.1)]'>
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