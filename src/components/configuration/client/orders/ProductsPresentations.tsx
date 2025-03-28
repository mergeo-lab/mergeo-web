import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ClipboardList, ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getMorePresentations } from "@/lib/products";
import { ProductSchemaType } from '../../../../lib/schemas/configuration.schema';
import { useQuery } from "@tanstack/react-query";
import { cn, formatToArgentinianPesos } from "@/lib/utils";
import UseMorePresentations from "@/store/productMorePresentations";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import UseSearchStore from "@/store/search.store";

type Props = {
    title?: string,
    subTitle?: string,
    productId: string | null,
    morePresentations: boolean,
    icon?: React.ReactNode,
    callback: () => void
}

export function ProductsPresentations({
    title = "Resumen de su Pedido",
    subTitle = "Aca podras ver los productos que fuiste seleccionando!",
    productId,
    morePresentations = false,
    icon = <ClipboardList size={25} />,
    callback,
}: Props) {
    const [open, setOpen] = useState(false);
    const { openProductId, toggleSheetOpen } = UseMorePresentations();
    const isOpen = openProductId === productId;
    const { saveProduct, removeProduct, getAllSavedProducts, saveMorePresentations, morePresentations: hasMore } = UseSearchStore();
    const allSavedProducts = getAllSavedProducts();
    const { data, isLoading } = useQuery({
        queryKey: ['more-presentations', productId],
        queryFn: () => productId ? getMorePresentations(productId) : Promise.reject(new Error('Product ID is undefined')),
        enabled: !!productId && isOpen,
    });

    useEffect(() => {
        if (isOpen) {
            console.log("DATA ::::::::>>>>", data)
            setOpen(isOpen);
        }
    }, [isOpen]);

    const closeModal = useCallback(() => {
        // Close the modal
        setOpen(false);
        callback();
    }, []);

    function handleProductChange(product: ProductSchemaType, quantity: number) {
        if (quantity === 0) {
            removeProduct(product.id);
            saveMorePresentations(hasMore.filter((id) => id !== productId))
        } else {
            saveProduct({ ...product, providerId: product.providerId! }, quantity);
            saveMorePresentations(productId ? [productId] : [])
        }
    }

    return (
        <Sheet open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                closeModal();
            } else {
                setOpen(isOpen);
            }
        }}>
            <SheetTrigger>
                {
                    morePresentations && (
                        allSavedProducts && allSavedProducts.length > 0 && hasMore.includes(productId ?? '')
                            ?
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size='xs' variant="outlineSecondary" className={cn("w-[6.8rem]", {
                                            "border-highlight text-highlight hover:bg-highlight/20": allSavedProducts.length > 0,
                                        })} onClick={() => { toggleSheetOpen(productId) }}>
                                            + presentaciones
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Seleccionaste otra presentacion de este producto
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            :
                            <Button size='xs' variant="outlineSecondary" className={cn("w-[6.8rem]")} onClick={() => { toggleSheetOpen(productId) }}>
                                + presentaciones
                            </Button>
                    )
                }
            </SheetTrigger>
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

                                            <div className="bg-border rounded p-4">
                                                <ImageIcon size={50} className="text-white" />
                                            </div>
                                            <div className="flex flex-col ml-2 items-start">
                                                <div className="font-semibold">{product.name}</div>
                                                <div className="text-muted font-thin text-sm">{product.brand}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            {product.net_content}{" "}
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
                        <Button variant="secondary" className="w-full" onClick={() => { }}>Cerrar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent >
        </Sheet >
    )
}
