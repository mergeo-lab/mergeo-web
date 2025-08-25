import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import noProductsImage from '@/assets/no-products.png'
import { usePaginatedSearch } from '@/hooks/usePaginatedSearch'
import { useEffect, useRef, useState } from 'react'
import UseCompanyStore from '@/store/company.store'
import ErrorMessage from '@/components/errorMessage'
import ProviderProductsTable from '@/components/configuration/provider/products/providerProductsTable'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { PaginationCustom } from '@/components/pagination'
import UseProviderInventoryPaginationState, { sortOptions, SortOptionsType } from '@/store/providerInventoryPagination.store'
import ProductFormFinder from '@/components/configuration/provider/products/productFormFinder'
import { PaginationSort, ProductSchemaType, ProductsFormFinderType, ProviderProductSearchType } from '@/lib/schemas'
import NoProductsFound from '@/components/configuration/provider/products/noProductsFound'
import NoInactiveProductsFound from '@/components/configuration/provider/products/noInactiveProductsFound'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaPlus } from 'react-icons/fa'
import { providerProductsSearch } from '@/lib/products'
import { Toggle } from '@/components/ui/toggle'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/products/')({
    component: () => <Products />,
    validateSearch: (search: Record<string, unknown>) => {
        return ({
            currentPage: search.currentPage as string
        })
    }
})

export default function Products() {
    const { company } = UseCompanyStore();
    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
        handleSearch,
        setPagination,
    } = usePaginatedSearch<ProviderProductSearchType, {
        products: ProductSchemaType[];
        currentPage: number;
        total: number;
        totalPages: number;
    }>({
        queryKeyPrefix: 'products',
        queryFn: providerProductsSearch,
    });

    const { currentPage } = useSearch({ from: '/_authenticated/_dashboardLayout/_accountType/provider/products/' });
    const { sort, setSort, search, setSearch, setPage, page, showOnlyInactive, setShowOnlyInactive } = UseProviderInventoryPaginationState()
    const [isSearching, setIsSearching] = useState(false);
    const tableRef = useRef<HTMLDivElement>(null);

    async function onSearchChange(fields: ProductsFormFinderType) {
        if (fields.name || fields.brand) setIsSearching(true)
        else setIsSearching(false)
        setSearch(fields);
        handleSearch({ companyId: company?.id, includeInventory: true, showOnlyInactive, ...fields });
    }

    const handleShowOnlyInactiveChange = (checked: boolean) => {
        setShowOnlyInactive(checked);
        handleSearch({ companyId: company?.id, includeInventory: true, showOnlyInactive: checked, ...search });
    };

    const sortBySelection = (value: string) => {
        if (!value) return;
        const selected = sortOptions.find(item => item.id === value) as SortOptionsType;

        setPagination(prev => ({ ...prev, orderBy: selected?.id, sortOrder: selected?.sort as PaginationSort.ASC | PaginationSort.DESC }));
        setSort(selected);
    }

    const scrollToTop = () => {
        tableRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (search.brand != "" || search.name != "") {
            handleSearch({ companyId: company?.id, includeInventory: true, showOnlyInactive, ...search });
        } else {
            handleSearch({ companyId: company?.id, includeInventory: true, showOnlyInactive });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company?.id, search, showOnlyInactive]);

    useEffect(() => {
        if (currentPage) {
            const selected = sortOptions.find(item => item.id === sort.id) as SortOptionsType;
            setPagination(prev => ({ ...prev, page: +currentPage, orderBy: selected?.id, sortOrder: selected?.sort as PaginationSort.ASC | PaginationSort.DESC }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Show loading when the query is loading, fetching, or when we don't have data yet
    const shouldShowLoading = isLoading || isFetching || !data;

    if (isError) {
        return (
            <div className='w-full h-full flex justify-center items-center'>
                <ErrorMessage />
            </div>
        )
    }

    return (
        <div className="grid grid-rows-[auto_1fr] h-full w-full overflow-hidden">
            <div className="bg-accent h-fit py-2 w-full px-5 shadow z-20 flex justify-between items-center">

                <div className='w-full flex gap-2'>
                    <ProductFormFinder
                        onChange={onSearchChange}
                        disabled={shouldShowLoading || (!data?.products || data.products.length === 0) && !showOnlyInactive}
                        defaults={search}
                        inputWidth='60px'
                        inputHeight='h-[28px]'
                    />
                    <div className='flex items-center gap-2 [&>p]:text-nowrap'>
                        <p>Ordenar por</p>
                        <Select onValueChange={sortBySelection} value={sort.id} disabled={shouldShowLoading || (!data?.products || data.products.length === 0) && !showOnlyInactive}>
                            <SelectTrigger className='px-5 w-fit h-[28px] '>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((item) => (
                                    <SelectItem key={item.id} value={item.id || ''}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2 [&>p]:text-nowrap'>
                        <Toggle
                            pressed={showOnlyInactive}
                            onPressedChange={handleShowOnlyInactiveChange}
                            disabled={shouldShowLoading}
                            className={cn(
                                "transition-all duration-200",
                                "h-[28px]",
                                {
                                    "!bg-info !text-white hover:!bg-info/90": showOnlyInactive,
                                    "bg-gray-200 text-gray-600 hover:bg-gray-300": !showOnlyInactive,
                                }
                            )}
                        >
                            Mostrar solo productos inactivos
                        </Toggle>
                    </div>
                </div>

                <div className='flex justify-center items-center w-fit'>
                    <Link to="/provider/products/newProducts">
                        <Button className='flex gap-2 h-[28px]'>
                            <FaPlus size={12} />
                            <p>Agregar Productos</p>
                        </Button>
                    </Link>
                </div>
            </div>

            {shouldShowLoading
                ? <div className="space-y-2 p-5">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full rounded-sm" />
                    ))}
                </div>
                : data && data.products.length > 0
                    ? <div className='flex flex-col h-full w-full overflow-hidden'>
                        <div className={`flex-1 min-h-0 overflow-hidden ${data.totalPages > 1 ? 'pb-0' : ''}`}>
                            <ProviderProductsTable
                                products={data.products}
                                currentPage={`${data.currentPage}`}
                                tableRef={tableRef as React.RefObject<HTMLDivElement>}
                                deleteCallback={() => refetch()}
                                showOnlyInactive={showOnlyInactive}
                                refetchCallback={() => refetch()}
                            />
                        </div>
                        {data.totalPages > 1 && (
                            <div className='flex-shrink-0 bg-white py-5 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/0.1)] border-t'>
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
                    : isSearching ? <NoProductsFound />
                        : showOnlyInactive && (!data?.products || data.products.length === 0) && !search.name && !search.brand ? <NoInactiveProductsFound />
                            :
                            <div className={cn("p-4 h-full overflow-y-auto z-10", {
                                "visible": !shouldShowLoading,
                                "hidden": shouldShowLoading,
                            })}>
                                <div className='w-full h-full flex flex-col gap-2 justify-center items-center'>
                                    <img src={noProductsImage} alt="no products" />
                                    <p className='text-lg font-bold mt-5'>No tienes ningún producto cargado!</p>
                                    <p className='font-light mb-5'>Puedes hacerlo manualmete o subir una lista</p>
                                    <Link to="/provider/products/newProducts">
                                        <Button className='flex gap-2'>
                                            <FaPlus size={12} />
                                            <p>Agregar Productos</p>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
            }
        </div >
    )
}