
import { DeleteConfirmationDialog } from "@/components/deleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteProvidersProduct, modifyProduct } from "@/lib/products"
import { ProductSchemaType } from "@/lib/schemas"
import { cn, formatDate, formatToArgentinianPesos } from "@/lib/utils"
import UseCompanyStore from "@/store/company.store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Edit, Trash2, Eye } from "lucide-react"

type Props = {
    products: ProductSchemaType[],
    currentPage: string,
    tableRef: React.RefObject<HTMLDivElement> | null,
    deleteCallback?: () => void,
}

export default function ProviderProductsTable({ products, currentPage, tableRef, deleteCallback }: Props) {
    const queryClient = useQueryClient();
    const { company } = UseCompanyStore();
    const companyId = company?.id ?? "";

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

    function deleteComplete() {
        deleteCallback && deleteCallback();
    }

    return (
        <div className="max-h-full overflow-y-auto mb-0 mx-5 border border-border rounded" ref={tableRef}>
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
                                {`${product.netContent} ${product.measurementUnit}`}
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
                                        className="hover:multi-[bg-info;text-white;border-info;] text-info"
                                        variant="outlineSecondary"
                                        disabled={!product.isActive}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: true, currentPage }}>
                                    <Button
                                        className="hover:multi-[bg-highlight;text-white;border-highlight;] text-highlight"
                                        variant="outlineSecondary"
                                        disabled={!product.isActive}

                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>


                                <DeleteConfirmationDialog<ProductSchemaType>
                                    id={product.id}
                                    title={"Borrar producto del inventario"}
                                    question={<p>Estas seguro de eliminar el producto <span className="font-bold">{product.name}</span>?</p>}
                                    mutationFn={(product) => deleteProvidersProduct(companyId, product.id)}
                                    callback={deleteComplete}
                                    triggerButton={
                                        <Button
                                            className="hover:multi-[bg-destructive;text-white;border-destructive;] text-destructive h-8"
                                            variant="outlineSecondary"
                                            disabled={!product.isActive}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >
    )
}