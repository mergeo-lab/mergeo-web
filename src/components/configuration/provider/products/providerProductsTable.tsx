
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
import { useState } from "react"
import { FaRegTrashAlt } from "react-icons/fa"
import { LuSquarePen, LuEye } from "react-icons/lu";

type Props = {
    products: ProductSchemaType[],
    currentPage: string,
    tableRef: React.RefObject<HTMLDivElement> | null,
    deleteCallback?: () => void,
    showOnlyInactive?: boolean,
    refetchCallback?: () => void,
}

type OptimisticType = {
    [key: string]: boolean
}

export default function ProviderProductsTable({ products, currentPage, tableRef, deleteCallback, showOnlyInactive, refetchCallback }: Props) {
    const queryClient = useQueryClient();
    const { company } = UseCompanyStore();
    const companyId = company?.id ?? "";
    const [optimisticStatus, setOptimisticStatus] = useState<OptimisticType>({});

    const toggleProductStatus = useMutation<
        unknown, // mutation result type
        unknown, // error type
        { productId: string; isActive: boolean }, // variables type
        { previousProducts?: ProductSchemaType[] } // context type
    >({
        mutationFn: async ({ productId, isActive }) => {
            return modifyProduct({ productId, isActive, companyId });
        },

        onMutate: async ({ productId, isActive }) => {
            await queryClient.cancelQueries({ queryKey: ["products"] });

            const previousProducts = queryClient.getQueryData<ProductSchemaType[]>(["products"]);

            // Optimistically update cache
            queryClient.setQueryData<ProductSchemaType[]>(["products"], (old) =>
                old?.map((p) =>
                    p.id === productId ? { ...p, isActive } : p
                ) ?? []
            );

            return { previousProducts };
        },

        onError: (_error, _variables, context) => {
            // Rollback to previous data if error
            if (context?.previousProducts) {
                queryClient.setQueryData(["products"], context.previousProducts);
            }
        },

        onSuccess: (_data, variables) => {
            // Ensure the product remains correctly updated in cache
            queryClient.setQueryData<ProductSchemaType[]>(["products"], (old) =>
                old?.map((p) =>
                    p.id === variables.productId ? { ...p, isActive: variables.isActive } : p
                ) ?? []
            );

            // If we're showing only inactive products and we just activated a product, refetch to update the list
            if (showOnlyInactive && variables.isActive && refetchCallback) {
                refetchCallback();
            }
        },

        onSettled: () => {
            // Optional: revalidate later if needed
            // queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });


    const handleProductActiveChange = (productId: string, checked: boolean) => {
        setOptimisticStatus((prev: OptimisticType) => ({ ...prev, [productId]: checked }));
        toggleProductStatus.mutate({ productId, isActive: checked });
    };

    function deleteComplete() {
        deleteCallback && deleteCallback();
    }

    return (
        <div className="h-full overflow-y-auto border border-border rounded" ref={tableRef}>
            {showOnlyInactive && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
                    <p className="text-sm text-yellow-800 font-medium">
                        Mostrando solo productos inactivos
                    </p>
                </div>
            )}
            <Table className="w-full h-fit">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                    <TableRow className="hover:bg-white">
                        <TableHead>NOMBRE</TableHead>
                        <TableHead>MARCA</TableHead>
                        <TableHead>PRECIO</TableHead>
                        <TableHead>PUM</TableHead>
                        <TableHead>CONTENIDO</TableHead>
                        <TableHead>MODIFICADO</TableHead>
                        <TableHead>
                            <div className="w-full flex justify-center items-center">
                                PRODUCTO ACTIVO
                            </div>
                        </TableHead>
                        <TableHead className="w-60 text-center">ACCIONES</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product: ProductSchemaType) => (
                        <TableRow key={product.id} className={cn("m-0 [&>*]:multi-[border-0;border-collapse;h-5] transition-all", {
                            "hover:bg-muted/10 bg-muted/10 shadow-[inset_0px_0px_10px_-2px_rgba(0,_0,_0,_0.2)]": !(optimisticStatus[product.id] ?? product.isActive),
                            '[&>td]:opacity-45': !(optimisticStatus[product.id] ?? product.isActive),
                        })}>
                            <TableCell className="font-semibold">
                                <div className="flex flex-col">
                                    <p>
                                        {product.name}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground/70">
                                        {product.variety}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{formatToArgentinianPesos(+product.price)}</TableCell>
                            <TableCell>{formatToArgentinianPesos(+product.pricePerBaseUnit)}</TableCell>
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
                                        checked={optimisticStatus[product.id] ?? product.isActive}
                                        onCheckedChange={(checked) => handleProductActiveChange(product.id, checked)}
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="flex justify-end space-x-2 [&>a>button]:h-8 [&>button]:h-8 mr-5">
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: false, currentPage }}>
                                    <Button
                                        className="hover:multi-[bg-info;text-white;border-info;] text-info"
                                        variant="outlineSecondary"
                                        disabled={!(optimisticStatus[product.id] ?? product.isActive)}
                                    >
                                        <LuEye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/provider/products/$productId" params={{ productId: product.id }} search={{ edit: true, currentPage }}>
                                    <Button
                                        className="hover:multi-[bg-highlight;text-white;border-highlight;] text-highlight"
                                        variant="outlineSecondary"
                                        disabled={!(optimisticStatus[product.id] ?? product.isActive)}

                                    >
                                        <LuSquarePen className="h-4 w-4" />
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
                                            disabled={!(optimisticStatus[product.id] ?? product.isActive)}
                                        >
                                            <FaRegTrashAlt className="h-4 w-4" />
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