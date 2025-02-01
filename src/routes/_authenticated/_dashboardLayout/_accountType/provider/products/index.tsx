import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import noProductsImage from '@/assets/no-products.png'
import { useProviderProductSearch } from '@/hooks/useProviderProductSearch'
import { useEffect } from 'react'
import UseCompanyStore from '@/store/company.store'
import ErrorMessage from '@/components/errorMessage'
import ProviderProductsTable from '@/components/configuration/provider/products/providerProductsTable'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/products/')({
    component: () => <Products />,
})

export default function Products() {
    const { company } = UseCompanyStore();
    const { data, isLoading, isError, handleSearch } = useProviderProductSearch();

    useEffect(() => {
        handleSearch({ companyId: company?.id, includeInventory: true });
    }, [company?.id]);


    {
        isError &&
            <div className='w-full h-full flex justify-center items-center'>
                <ErrorMessage />
            </div>
    }

    return (
        <div className="grid grid-rows-[auto_1fr] h-full w-full">
            <div className="bg-accent h-20 px-10 shadow z-20 flex justify-between items-center">

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
                    ? <ProviderProductsTable products={data.products} />
                    : (
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

                    )
            }
        </div >
    )
}