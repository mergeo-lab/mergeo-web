import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import noProductsImage from '@/assets/no-products.png'
import { useProviderProductSearch } from '@/hooks/useProviderProductSearch'
import { useEffect, useRef, useState } from 'react'
import UseCompanyStore from '@/store/company.store'
import ErrorMessage from '@/components/errorMessage'
import ProviderProductsTable from '@/components/configuration/provider/products/providerProductsTable'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { PaginationCustom } from '@/components/pagination'
import UseProviderInventoryPaginationState, { sortOptions, SortOptionsType } from '@/store/providerInventoryPagination.store'
import ProductFormFinder from '@/components/configuration/provider/products/productFormFinder'
import { PaginationSort, ProductsFormFinderType } from '@/lib/schemas'
import NoProductsFound from '@/components/configuration/provider/products/noProductsFound'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    const { data, isLoading, isError, handleSearch, setPagination, refetch } = useProviderProductSearch();
    const { currentPage } = useSearch({ from: '/_authenticated/_dashboardLayout/_accountType/provider/products/' });
    const { sort, setSort, search, setSearch, setPage, page } = UseProviderInventoryPaginationState()
    const [isSearching, setIsSearching] = useState(false);
    const tableRef = useRef<HTMLDivElement>(null);

    async function onSearchChange(fields: ProductsFormFinderType) {
        if (fields.name || fields.brand) setIsSearching(true)
        else setIsSearching(false)
        setSearch(fields);
        handleSearch({ companyId: company?.id, includeInventory: true, ...fields });
    }

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
            handleSearch({ companyId: company?.id, includeInventory: true, ...search });
        } else {
            handleSearch({ companyId: company?.id, includeInventory: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company?.id, search]);

    useEffect(() => {
        if (currentPage) {
            const selected = sortOptions.find(item => item.id === sort.id) as SortOptionsType;
            setPagination(prev => ({ ...prev, page: +currentPage, orderBy: selected?.id, sortOrder: selected?.sort as PaginationSort.ASC | PaginationSort.DESC }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    {
        isError &&
            <div className='w-full h-full flex justify-center items-center'>
                <ErrorMessage />
            </div>
    }

    return (
        <div className="grid grid-rows-[auto_1fr] h-full w-full">
            <div className="bg-accent h-20 px-10 shadow z-20 flex justify-between items-center">

                <div className='w-full flex gap-5'>
                    <ProductFormFinder onChange={onSearchChange} disabled={isLoading} defaults={search} />
                    <div className='flex items-center gap-2 [&>p]:text-nowrap'>
                        <p>Ordenar por</p>
                        <Select onValueChange={sortBySelection} value={sort.id}>
                            <SelectTrigger className='px-5 w-fit'>
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
                </div>

                <div className='flex justify-center items-center w-fit'>
                    <Link to="/provider/products/newProducts">
                        <Button className='flex gap-2'>
                            <Plus size={20} strokeWidth={3} />
                            <p>Agregar Productos</p>
                        </Button>
                    </Link>
                </div>
            </div>

            {isLoading
                ?
                <div className="space-y-2 p-5">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full opacity-10 bg-muted/30 rounded-sm" />
                    ))}
                </div>
                :
                data && data.products.length > 0
                    ? <div className='grid grid-rows-[1fr_auto] h-full w-full gap-4 overflow-auto pt-5'>
                        <ProviderProductsTable
                            products={data.products}
                            currentPage={`${data.currentPage}`}
                            tableRef={tableRef as React.RefObject<HTMLDivElement>}
                            deleteCallback={() => refetch()}
                        />
                        {data.totalPages > 1 && (
                            <div className='sticky bottom-0 bg-white py-5 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/0.1)]'>
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
                        :
                        <div className={cn("p-4 h-full overflow-y-auto z-10 hidden", {
                            "visible": !isLoading
                        })}>
                            <div className='w-full h-full flex flex-col gap-2 justify-center items-center'>
                                <img src={noProductsImage} alt="no products" />
                                <p className='text-lg font-bold mt-5'>No tienes ningún producto cargado!</p>
                                <p className='font-light mb-5'>Puedes hacerlo manualmete o subir una lista</p>
                                <Link to="/provider/products/newProducts">
                                    <Button className='flex gap-2'>
                                        <Plus size={20} strokeWidth={3} />
                                        <p>Agregar Productos</p>
                                    </Button>
                                </Link>
                            </div>
                        </div>
            }
        </div >
    )
}