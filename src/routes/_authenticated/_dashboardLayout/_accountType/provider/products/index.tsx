import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import noProductsImage from '@/assets/no-products.png'
import { useProviderProductSearch } from '@/hooks/useProviderProductSearch'
import { useEffect, useState } from 'react'
import UseCompanyStore from '@/store/company.store'
import ErrorMessage from '@/components/errorMessage'
import ProviderProductsTable from '@/components/configuration/provider/products/providerProductsTable'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { PaginationCustom } from '@/components/pagination'
import UseProviderInventoryPaginationState, { sortOptions, SortOptionsType } from '@/store/providerInventoryPagination.store'
import ProductFormFinder from '@/components/configuration/provider/products/productFormFinder'
import { ProductsFormFinderType } from '@/lib/schemas'
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
    const { data, isLoading, isError, handleSearch, setPagination } = useProviderProductSearch();
    const { currentPage } = useSearch({ from: '/_authenticated/_dashboardLayout/_accountType/provider/products/' });
    const { sort, setSort, search, setSearch, setPage } = UseProviderInventoryPaginationState()
    const [isSearching, setIsSearching] = useState(false);

    async function onSearchChange(fields: ProductsFormFinderType) {
        if (fields.name || fields.brand) setIsSearching(true)
        else setIsSearching(false)
        setSearch(fields);
        handleSearch({ companyId: company?.id, includeInventory: true, ...fields });
    }

    const sortBySelection = (value: string) => {
        if (!value) return;
        const selected = sortOptions.find(item => item.id === value) as SortOptionsType;

        setPagination(prev => ({ ...prev, orderBy: selected?.id, sortOrder: selected?.sort as "asc" | "desc" }));
        setSort(selected);
    }

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
            setPagination(prev => ({ ...prev, page: +currentPage, orderBy: selected?.id, sortOrder: selected?.sort as "asc" | "desc" }));
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
                    ? <div className='flex flex-col w-full'>
                        <div className={cn('my-5', {
                            'h-[53%]': data.totalPages > 1,
                            'h-[38rem]': data.totalPages <= 1,
                        })}>
                            <ProviderProductsTable products={data.products} currentPage={`${data.currentPage}`} />
                        </div>
                        {data.totalPages > 1 &&
                            <PaginationCustom
                                currentPage={data.currentPage}
                                prev={data.currentPage > 1}
                                next={data.currentPage < data.totalPages}
                                pages={data.totalPages}
                                onPageBack={() => {
                                    setPagination(prev => ({ ...prev, page: +data.currentPage - 1 }));
                                    setPage(+data.currentPage - 1);
                                }}
                                onPageForward={() => {
                                    setPagination(prev => ({ ...prev, page: +data.currentPage + 1 }));
                                    setPage(+data.currentPage + 1);
                                }}
                                onPageChange={(page: number) => {
                                    setPagination(prev => ({ ...prev, page }));
                                    setPage(page);
                                }}
                            />
                        }
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