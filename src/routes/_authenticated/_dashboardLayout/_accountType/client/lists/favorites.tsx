import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFavorites } from '@/lib/products';
import UseCompanyStore from '@/store/company.store'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ImageIcon, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/lists/favorites')({
    component: () => <Favorites />
})

export default function Favorites() {
    const { company } = UseCompanyStore();
    const companyId = company?.id;

    const { data, isLoading } = useQuery({
        queryKey: ['favorites', companyId],
        queryFn: () => companyId ? getFavorites(companyId) : Promise.reject(new Error('Company ID is undefined')),
    })


    function loadingIndicator() {
        return (
            <TableRow className="mt-12 opacity-25">
                <TableCell colSpan={100} className="p-0">
                    <div className="w-full flex flex-col space-y-2 mt-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-20 rounded-sm bg-muted/50" />
                        ))}
                    </div>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div className="relative w-full p-10">
            {/* <div className="h-1 w-full bg-transparent shadow-sm"></div> */}
            <div className="h-[calc(100vh-220px)] overflow-y-auto px-2">
                <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                        <TableRow className="hover:bg-white">
                            <TableHead className="w-96">Producto</TableHead>
                            <TableHead className={`text-center`}>Unidad</TableHead>
                            <TableHead className={`text-center`}>Unidad de Medida</TableHead>
                            <TableHead className={`text-center`}>Precio</TableHead>
                            <TableHead className={`text-center`}>Precio por Unidad de Medida</TableHead>
                            <TableHead className={`text-right`}></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&>*]:hover:bg-white">
                        {
                            isLoading
                                ? loadingIndicator()
                                : (
                                    data && data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="p-0 m-0 py-2">
                                                <div className="flex justify-start items-center w-full">

                                                    <div className="bg-border rounded p-4">
                                                        <ImageIcon size={50} className="text-white" />
                                                    </div>
                                                    <div className="flex flex-col ml-2">
                                                        <div className="font-semibold">{product.name}</div>
                                                        <div className="text-muted font-thin text-sm">{product.brand}</div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className={`text-center`}>{product.net_content}</TableCell>
                                            <TableCell className={`text-center`}>{product.measurementUnit}</TableCell>
                                            <TableCell className={`text-center`}>{product.price}</TableCell>
                                            <TableCell className={`text-center`}>{
                                                product.net_content ? (+product.price * product.net_content) : 1}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" className='hover:text-destructive'>
                                                    <Trash2 size={18} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}