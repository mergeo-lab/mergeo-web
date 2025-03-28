
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { modifyProduct } from "@/lib/products"
import { ProductSchemaType } from "@/lib/schemas"
import { cn, formatDate, formatToArgentinianPesos } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Edit, Trash, Eye } from "lucide-react"

type Props = {
    products: ProductSchemaType[],
    currentPage: string
}

export default function ProviderProductsTable({ products, currentPage }: Props) {
    const queryClient = useQueryClient();

    const handleDelete = (prductId: string) => {
        alert(`Delete product with ID: ${prductId}`)
    }
    const toggleProductStatus = useMutation({
        mutationFn: async ({ productId, isActive }: { productId: string; isActive: boolean }) => {
            return modifyProduct({ productId, isActive });
        },
        // Optimistic update
        onMutate: async ({ productId, isActive }) => {
            await queryClient.cancelQueries({ queryKey: ["products"] });

            const previousProducts = queryClient.getQueryData<ProductSchemaType[]>(["products"]);

            queryClient.setQueryData<ProductSchemaType[]>(["products"], (oldProducts) =>
                oldProducts?.map((p) => (p.id === productId ? { ...p, isActive } : p)) ?? []
            );

            return { previousProducts };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousProducts) {
                queryClient.setQueryData(["products"], context.previousProducts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const handleProductActiveChange = (productId: string, checked: boolean) => {
        toggleProductStatus.mutate({ productId, isActive: checked });
    };


    return (
        <div className="max-h-full overflow-y-auto mb-0 mx-5 border border-border rounded">
            <Table className="w-full h-fit">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                    <TableRow className="hover:bg-white">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Contenido</TableHead>
                        <TableHead>Modificado</TableHead>
                        <TableHead>
                            <div className="w-full flex justify-center items-center">
                                Producto Activo
                            </div>
                        </TableHead>
                        <TableHead className="w-60 text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product: ProductSchemaType) => (
                        <TableRow key={product.id} className={cn("m-0 [&>*]:multi-[border-0;border-collapse;h-5] transition-all", {
                            "hover:bg-muted/10 bg-muted/10 shadow-[inset_0px_0px_10px_-2px_rgba(0,_0,_0,_0.2)]": !product.isActive,
                            '[&>td]:opacity-45': !product.isActive,
                        })}>
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
                            <TableCell className="!opacity-100">
                                <div className="w-full flex justify-center items-center">
                                    <Switch
                                        className="data-[state=unchecked]:bg-destructive"
                                        checked={product.isActive}
                                        onCheckedChange={(checked) => handleProductActiveChange(product.id, checked)}
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="flex justify-end space-x-2 [&>a>button]:h-8 [&>button]:h-8 -mt-2 mr-5">
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: false, currentPage }}>
                                    <Button
                                        className="hover:multi-[bg-primary;text-white]"
                                        variant="outlineSecondary"
                                        disabled={!product.isActive}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: true, currentPage }}>
                                    <Button
                                        className="hover:multi-[bg-primary;text-white]"
                                        variant="outlineSecondary"
                                        disabled={!product.isActive}

                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    className="hover:multi-[bg-primary;text-white]"
                                    variant="outlineSecondary"
                                    onClick={() => handleDelete(product.id)}
                                    disabled={!product.isActive}
                                >
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