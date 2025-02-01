
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductSchemaType } from "@/lib/schemas"
import { formatDate, formatToArgentinianPesos } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { Edit, Trash, Eye } from "lucide-react"

type Props = {
    products: ProductSchemaType[]
}

export default function ProviderProductsTable({ products }: Props) {

    const handleDelete = (prductId: string) => {
        alert(`Delete product with ID: ${prductId}`)
    }
    return (
        <div className="max-h-[40rem] overflow-y-auto mt-5 mx-5 border border-border rounded">
            <Table className="w-full">
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
                        <TableRow key={product.id} className="h-12 p-0 m-0 [&>*]:h-0 [&>*]:p-0 [&>*]:border-0 [&>*]:border-collapse">
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
                            <TableCell className="flex justify-end space-x-2 [&>a>button]:h-8 [&>button]:h-8 mt-2 mr-5">
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: false }}>
                                    <Button
                                        className="hover:multi-[bg-primary;text-white]"
                                        variant="outlineSecondary"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: true }}>
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