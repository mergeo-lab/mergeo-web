import { StatusBadge } from '@/components/statusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClientPreOrderSchemaType, ClientPreOrdersResponseSchemaType } from '@/lib/schemas';
import { formatDate, NotificationType } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useCallback, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import sinPedidos from '@/assets/sin-pedidos.png'
import { ConfigTabs, ProductStatus } from '@/lib/constants';
import { LuEye, LuShoppingCart } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { usePaginatedPreOrders } from '@/hooks/usePaginatedPreOrders';
import { PaginationCustom } from '@/components/pagination';
import UsePreOrdersPaginationState, { preOrdersSortOptions, preOrdersStatusFilters, PreOrdersSortOptionsType } from '@/store/preOrdersPagination.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/preOrders/')({
    component: () => <PreOrders />
})

export default function PreOrders() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const { notifications } = useNotifications();
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
    } = usePaginatedPreOrders(companyId) as {
        data: ClientPreOrdersResponseSchemaType | undefined;
        isLoading: boolean;
        isError: boolean;
        isFetching: boolean;
        refetch: () => void;
        setPagination: (pagination: any) => void;
        handleSearch: (filters: any) => void;
    };

    // Initialize pagination state - only run once on mount
    useEffect(() => {
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

    // Get all client pre-orders
    const clientOrders = data?.entities || [];

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
                        <Select onValueChange={handleSortChange} value={sort.id} disabled={!data?.entities || (data && data.entities.length === 0 && statusFilter.id === 'all')}>
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
                    (!data?.entities || data?.entities.length === 0) ? (
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
                                            <TableHead className="min-w-[80px] text-center">Sucursal</TableHead>
                                            <TableHead className="min-w-[100px] text-center">Estado</TableHead>
                                            <TableHead className="min-w-[120px] text-center">Ordenes de Compra</TableHead>
                                            <TableHead className="min-w-[160px] text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white">
                                        {clientOrders.map((clientOrder: ClientPreOrderSchemaType) => {
                                            const hasBuyOrders = clientOrder.buyOrders && clientOrder.buyOrders.length > 0;
                                            const buyOrdersCount = clientOrder.buyOrders?.length || 0;

                                            return (
                                                <TableRow className="hover:bg-white first:border-t-none" key={clientOrder.id}>
                                                    <TableCell className="min-w-[120px]">{clientOrder.clientPreOrderNumber}</TableCell>
                                                    <TableCell className="min-w-[120px]">{formatDate(clientOrder.createdAt)}</TableCell>
                                                    <TableCell className="min-w-[80px] text-center">{(clientOrder.branchName)}</TableCell>
                                                    <TableCell className="min-w-[100px] text-center">
                                                        <div className="flex justify-center">
                                                            <StatusBadge
                                                                className='py-2 px-6 text-sm'
                                                                status={clientOrder.status}
                                                                hasWarning={clientOrder.products.some(product => product.productStatus === ProductStatus.notFound)}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="min-w-[120px] text-center">
                                                        {hasBuyOrders ? (
                                                            buyOrdersCount === 1 ? (
                                                                <Link to="/buyOrder/$orderId" params={{ orderId: clientOrder.buyOrders?.[0].id || '' }}>
                                                                    <Button variant='ghost' className='space-x-2'>
                                                                        <LuShoppingCart className='cursor-pointer' size={20} />
                                                                        <p>Ver orden {clientOrder.buyOrders?.[0].buyOrderNumber}</p>
                                                                    </Button>
                                                                </Link>
                                                            ) : (
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant='ghost' className='space-x-2'>
                                                                            <LuShoppingCart className='cursor-pointer' size={20} />
                                                                            <p>Ver ordenes ({buyOrdersCount})</p>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        {clientOrder.buyOrders?.map((buyOrder) => (
                                                                            <DropdownMenuItem key={buyOrder.id}>
                                                                                <Link to="/buyOrder/$orderId" params={{ orderId: buyOrder.id }}>
                                                                                    <div className='flex items-center space-x-2'>
                                                                                        <LuShoppingCart size={16} />
                                                                                        <span>Ver orden {buyOrder.buyOrderNumber}</span>
                                                                                    </div>
                                                                                </Link>
                                                                            </DropdownMenuItem>
                                                                        ))}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            )
                                                        ) : (
                                                            <span className='text-muted text-sm'>Sin ordenes</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="min-w-[160px] text-center">
                                                        <Link to="/client/preOrders/$preOrderId" params={{ preOrderId: clientOrder.id }}>
                                                            <Button variant='ghost' className='space-x-2'>
                                                                <LuEye className='cursor-pointer' size={20} />
                                                                <p>Ver Pedido</p>
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
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
                                            setPagination((prev: any) => ({ ...prev, page: page - 1 }));
                                            setPage(page - 1);
                                            scrollToTop();
                                        }}
                                        onPageForward={() => {
                                            setPagination((prev: any) => ({ ...prev, page: page + 1 }));
                                            setPage(page + 1);
                                            scrollToTop();
                                        }}
                                        onPageChange={(page: number) => {
                                            setPagination((prev: any) => ({ ...prev, page }));
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