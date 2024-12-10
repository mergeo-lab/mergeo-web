import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Search } from 'lucide-react'
import noProductsImage from '@/assets/no-products.png'
import UseProductListStore from '@/store/productsList.store'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/products/')({
    component: () => <Products />,
})

export default function Products() {
    const { removeSelectedList } = UseProductListStore();

    useEffect(() => {
        removeSelectedList();
    }, []);

    return (
        <div className="grid grid-rows-[auto_1fr] h-full w-full">
            <div className="bg-accent py-4 px-10 shadow z-20 flex justify-between items-center">
                <div className='flex justify-center items-center w-fit gap-2'>
                    <Label className='w-fit text-nowrap font-light'>Buscar Productos</Label>
                    <Input className='w-[300px]' />
                    <Button>
                        <Search size={20} strokeWidth={3} />
                    </Button>
                </div>
                <div className='flex justify-center items-center w-fit gap-2'>
                    <Link to="/provider/products/newProducts">
                        <Button className='flex gap-2'>
                            <Plus size={20} strokeWidth={3} />
                            <p>Agregar Productos</p>
                        </Button>
                    </Link>
                </div>
            </div>

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
        </div >
    )
}