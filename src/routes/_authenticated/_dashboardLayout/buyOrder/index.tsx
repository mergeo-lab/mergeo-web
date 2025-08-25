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
import { LuFileCheck } from 'react-icons/lu';
import { RiCheckboxMultipleBlankLine } from 'react-icons/ri';
import { useAuth } from '@/context/AuthContext';
import { useMarkBuyOrderAsViewed } from '@/hooks/useMarkBuyOrderAsViewed';
import AnimatedCheck from '@/components/animatedCheck';
import { usePaginatedBuyOrders } from '@/hooks/usePaginatedBuyOrders';
import { PaginationCustom } from '@/components/pagination';
import UseBuyOrdersPaginationState, { buyOrdersSortOptions, buyOrdersViewedFilters, BuyOrdersSortOptionsType } from '@/store/buyOrdersPagination.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useRef, useCallback, useState } from 'react';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/buyOrder/')({
    component: () => <OrdenesDeCompra />,
});

export default function OrdenesDeCompra() {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const accountType = account?.user?.accountType;
    const isClient = accountType === ACCOUNT.client;

    const { setPage, page, viewedFilter, setViewedFilter, sort, setSort } = UseBuyOrdersPaginationState();

    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
        setPagination,
        handleSearch,
    } = usePaginatedBuyOrders(companyId, isClient);

    // Track if this is the initial load
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const markAsViewedMutation = useMarkBuyOrderAsViewed();
    const tableRef = useRef<HTMLDivElement>(null);

    
    // Enable filter if we have any data and it's not the initial load
    const shouldEnableFilters = !isInitialLoad && data?.buyOrders !== undefined;

    // Initialize pagination state - only run once on mount
    useEffect(() => {
        handleSearch({
            sortByCreated: true,
            sortOrder: sort.sortOrder
        });
    }, [handleSearch, sort.sortOrder]);

    // Track initial load completion
    useEffect(() => {
        if (data && isInitialLoad) {
            setIsInitialLoad(false);
        }
    }, [data, isInitialLoad]);

    // Handle viewed filter change
    const handleViewedFilterChange = useCallback((value: string) => {
        const selectedFilter = buyOrdersViewedFilters.find(filter => filter.id === value);
        if (selectedFilter) {
            setViewedFilter(selectedFilter);
            if (selectedFilter.value !== undefined) {
                handleSearch({ viewed: selectedFilter.value });
            } else {
                handleSearch({});
            }
        }
    }, [handleSearch, setViewedFilter]);

    // Handle sort change
    const handleSortChange = useCallback((value: string) => {
        const selectedSort = buyOrdersSortOptions.find(option => option.id === value) as BuyOrdersSortOptionsType;
        if (selectedSort) {
            setSort(selectedSort);
            handleSearch({
                sortByCreated: true,
                sortOrder: selectedSort.sortOrder
            });
        }
    }, [handleSearch, setSort]);

    // Scroll to top function
    const scrollToTop = useCallback(() => {
        tableRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const handleMarkAsViewed = (orderId: string) => {
        markAsViewedMutation.mutate(orderId);
    };

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
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Header with filters */}
            <div className="bg-accent h-20 w-full px-5 py-2 shadow z-20 flex justify-between items-center">
                <div className='w-full flex gap-4'>
                    <div className='flex items-center gap-2 [&>p]:text-nowrap'>
                        <p>Estado</p>
                        <Select onValueChange={handleViewedFilterChange} value={viewedFilter.id} disabled={!shouldEnableFilters}>
                            <SelectTrigger className='px-5 w-fit h-8'>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {buyOrdersViewedFilters.map((filter) => (
                                    <SelectItem key={filter.id} value={filter.id}>
                                        {filter.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2 [&>p]:text-nowrap'>
                        <p>Ordenar por</p>
                        <Select onValueChange={handleSortChange} value={sort.id} disabled={isInitialLoad}>
                            <SelectTrigger className='px-5 w-fit h-8'>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {buyOrdersSortOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {data?.buyOrders?.length === 0 ? (
                <div className='w-full h-full flex justify-center items-center'>
                    <div className='py-10 px-20 flex flex-col justify-center items-center gap-4'>
                        <img src={noOrders} alt='no tienes ordenes' />
                        <div className='flex flex-col justify-center items-center mb-5'>
                            <p className='text-lg font-bold mt-5'>No tienes ninguna Orden de Compra!</p>
                            <p className='[&>span]:multi-[text-primary;font-thin]'>
                                Revisa si tienes algun <span>Pedido</span> pendiente!
                            </p>
                        </div>
                        <Link to='/provider/preOrders'>
                            <Button>Ir a Pedidos</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col flex-1 w-full pt-5 relative'>
                    <div className={`h-[calc(100vh-130px)] overflow-y-auto ${data && data.totalPages > 1 ? 'pb-20' : ''}`} ref={tableRef}>
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
                                    <TableHead className='text-center'>Procesada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='bg-white'>
                                {data &&
                                    data.buyOrders.map((order: BuyOrderSchemaType) => (
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
            )}
        </div>
    );
}
