import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useCallback, useMemo } from "react";
import { getMorePresentations } from "@/lib/products";
import { ProductSchemaType } from '../../../../lib/schemas/configuration.schema';
import { useQuery } from "@tanstack/react-query";
import { cn, formatToArgentinianPesos } from "@/lib/utils";
import UseMorePresentations from "@/store/productMorePresentations";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import UseSearchStore from "@/store/search.store";
import { LuClipboardList, LuImage } from "react-icons/lu";
import { SheetWithConfirm } from "@/components/SheetWithConfirm";
import { useAuth } from "@/context/AuthContext";

type Props = {
    title?: string,
    subTitle?: string,
    productId: string | null,
    morePresentations: boolean,
    icon?: React.ReactNode,
    callback: () => void,
    dropZoneId?: string
}

export function ProductsPresentations({
    title = "Resumen de su Pedido",
    subTitle = "Aca podras ver los productos que fuiste seleccionando!",
    productId,
    morePresentations = false,
    icon = <LuClipboardList size={25} />,
    callback,
    dropZoneId,
}: Props) {
    const { openProductId, toggleSheetOpen } = UseMorePresentations();
    const isOpen = openProductId === productId;
    const { saveProduct, removeProduct, saveMorePresentations, morePresentations: hasMore } = UseSearchStore();
    const savedProducts = UseSearchStore(state => state.savedProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const allSavedProducts = useMemo(() => UseSearchStore.getState().getAllSavedProducts(), [savedProducts]);

    // Get providerId from auth context and dropZoneId from search config
    const { account } = useAuth();
    const providerId = account?.company?.id || '';

    const { data, isLoading } = useQuery({
        queryKey: ['more-presentations', productId],
        queryFn: () => productId ? getMorePresentations(productId) : Promise.reject(new Error('Product ID is undefined')),
        enabled: !!productId && isOpen,
    });

    const closeModal = useCallback(() => {
        // Close the modal by toggling the global state
        toggleSheetOpen(null);
        callback();
    }, [callback, toggleSheetOpen]);

    function handleProductChange(product: ProductSchemaType, quantity: number) {
        if (quantity === 0) {
            removeProduct(product.id);
            saveMorePresentations(hasMore.filter((id) => id !== productId))
        } else {
            // Use providerId from auth context
            const productProviderId = providerId;

            // Try to get dropZoneId from props, search config, or existing saved products
            let productDropZoneId = dropZoneId || '';

            if (!productDropZoneId) {
                // Try to get it from any existing saved product (they should all have the same dropZoneId)
                const existingProduct = allSavedProducts.find(p => p.dropZoneId);
                if (existingProduct) {
                    productDropZoneId = existingProduct.dropZoneId;
                }
            }

            if (!productProviderId) {
                console.error('Missing providerId. User company ID not found.');
                return;
            }

            if (!productDropZoneId) {
                console.error('Missing dropZoneId. Please ensure search configuration has a branch with dropZoneId or provide dropZoneId as a prop.');
                return;
            }

            console.log('Saving product with providerId:', productProviderId, 'dropZoneId:', productDropZoneId);

            saveProduct({ ...product, providerId: productProviderId, dropZoneId: productDropZoneId }, quantity);
            saveMorePresentations(productId ? [productId] : [])
        }
    }

    return (
        <SheetWithConfirm open={isOpen} onOpenChange={(open) => {
            if (!open) {
                closeModal();
            } else {
                toggleSheetOpen(productId);
            }
        }}>
            {morePresentations && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SheetTrigger asChild>
                                <Button
                                    size='xs'
                                    variant="outlineSecondary"
                                    className={cn("w-[6.8rem]", {
                                        "border-highlight text-highlight hover:bg-highlight/20": allSavedProducts && allSavedProducts.length > 0 && hasMore.includes(productId ?? ''),
                                    })}
                                >
                                    + presentaciones
                                </Button>
                            </SheetTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            {allSavedProducts && allSavedProducts.length > 0 && hasMore.includes(productId ?? '')
                                ? "Seleccionaste otra presentacion de este producto"
                                : "Ver otras presentaciones de este producto"
                            }
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            <SheetContent className="w-1/2 mx-w-1/2 sm:max-w-1/2">
                <SheetHeader>
                    <SheetTitle className="flex gap-2 items-center">
                        {icon}
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                        {subTitle}
                    </SheetDescription>
                </SheetHeader>
                <div className="h-[calc(100vh-210px)] overflow-y-auto mt-5">
                    <Table>
                        <TableHeader className="sticky top-0 bg-white shadow-sm">
                            <TableRow className="hover:bg-white [&>*]:text-center">
                                <TableHead className="!text-left">Producto</TableHead>
                                <TableHead>Contenido Neto</TableHead>
                                <TableHead>Precio Unitario</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&>*]:hover:bg-white">
                            {isLoading && Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index} className="[&>*]:text-center">
                                    <TableCell colSpan={4}>
                                        <p className="text-sm text-muted-foreground">Cargando...</p>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                            {data && data.map((product: ProductSchemaType) => (
                                <TableRow key={product.id} className="[&>*]:text-center">
                                    <TableCell className="p-0 m-0 py-2">
                                        <div className="flex justify-start items-center w-full">

                                            <div className={cn("rounded w-20 h-20 flex justify-center items-center", {
                                                "bg-border": !product.image
                                            })}>
                                                {product.image
                                                    ? <div className="w-full h-full bg-contain bg-no-repeat bg-center" style={{ backgroundImage: (`URL(${product.image})`) }}>
                                                    </div>
                                                    : <LuImage size={50} className="text-white" />
                                                }
                                            </div>
                                            <div className="flex flex-col items-start ml-2 max-w-[17rem]">
                                                <p title={product.name.toUpperCase()} className="font-semibold truncate">{product.name.toUpperCase()}</p>
                                                <p title={product.variety?.toUpperCase()} className="font-base truncate">{product.variety?.toUpperCase()}</p>
                                                <p className="text-info font-thin text-sm">{product.brand}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            {product.netContent}{" "}
                                            {product.measurementUnit}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            {formatToArgentinianPesos(+product.pricePerBaseUnit, { maximumFractionDigits: 4 })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {(formatToArgentinianPesos(+product.price))}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <QuantitySelector
                                            defaultValue={allSavedProducts.find((item) => item.id === product.id)?.quantity}
                                            onChange={(quantity: number) => handleProductChange(product, quantity)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <SheetFooter className="p-10 items-center">
                    <SheetClose className="w-full">
                        <Button variant="secondary" className="w-full" >Cerrar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent >
        </SheetWithConfirm >
    )
}
