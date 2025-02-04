
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductSchemaType } from "@/lib/schemas"
import { formatDate, formatToArgentinianPesos } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { Edit, Trash, Eye } from "lucide-react"

type Props = {
    products: ProductSchemaType[],
    currentPage: string
}

export default function ProviderProductsTable({ products, currentPage }: Props) {

    const handleDelete = (prductId: string) => {
        alert(`Delete product with ID: ${prductId}`)
    }
    return (
        <div className="h-[85%] overflow-y-auto my-8 mx-5 border border-border rounded">
            <Table className="w-full h-fit">
                <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="hover:bg-white">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Contenido</TableHead>
                        <TableHead>Modificado</TableHead>
                        <TableHead className="w-60 text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product: ProductSchemaType) => (
                        <TableRow key={product.id} className="m-0 [&>*]:multi-[border-0;border-collapse;h-5]">
                            <TableCell className="font-semibold">
                                <p className="pl-5">
                                    {product.name}
                                </p>
                            </TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{formatToArgentinianPesos(+product.price)}</TableCell>
                            <TableCell>
                                {`${product.net_content} ${product.measurementUnit}`}
                            </TableCell>
                            <TableCell>
                                <p>{formatDate(product.updated)}</p>
                            </TableCell>
                            <TableCell className="flex justify-end space-x-2 [&>a>button]:h-8 [&>button]:h-8 -mt-2 mr-5">
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: false, currentPage }}>
                                    <Button
                                        className="hover:multi-[bg-primary;text-white]"
                                        variant="outlineSecondary"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: true, currentPage }}>
                                    <Button
                                        className="hover:multi-[bg-primary;text-white]"
                                        variant="outlineSecondary"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button className="hover:multi-[bg-primary;text-white]" variant="outlineSecondary" onClick={() => handleDelete(product.id)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >
    )
}