import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import noProductsImage from '@/assets/no-products.png'
import { useProviderProductSearch } from '@/hooks/useProviderProductSearch'
import { useEffect } from 'react'
import UseCompanyStore from '@/store/company.store'
import ProductRow from '@/components/configuration/client/orders/productRow'
import LoadingIndicator from '@/components/loadingIndicator'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/products/')({
    component: () => <Products />,
})

export default function Products() {
    const { company } = UseCompanyStore();
    const { data, isLoading, isError, handleSearch } = useProviderProductSearch();

    useEffect(() => {
        handleSearch({ companyId: company?.id });
    }, []);

    if (isLoading) {
        return <LoadingIndicator />
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

            {data && data.length > 0 ? (
                <div className='h-full overflow-y-auto'>
                    {data && data.map(product => {
                        return <ProductRow data={{ ...product, providerId: company ? company?.id : '', unitConversionFactor: Number(product.unitConversionFactor), quantity: product.quantity ?? 0 }} key={product.id} cellsWidth='w-full' />
                    })}
                </div>
            ) : (
                <div className=" p-4  h-full overflow-y-auto z-10">
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

            )}
        </div >
    )
}