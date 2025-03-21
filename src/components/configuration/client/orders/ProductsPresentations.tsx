import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ClipboardList, ImageIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getMorePresentations } from "@/lib/products";
import { ProductSchemaType } from '../../../../lib/schemas/configuration.schema';
import { useQuery } from "@tanstack/react-query";
import { formatToArgentinianPesos } from "@/lib/utils";

type Props = {
    title?: string,
    subTitle?: string,
    prodcutId: string | null,
    icon?: React.ReactNode,
    callback: () => void
    triggerButton?: React.ReactNode
    isOpen?: boolean
}

export function ProductsPresentations({
    title = "Resumen de su Pedido",
    subTitle = "Aca podras ver los productos que fuiste seleccionando!",
    prodcutId,
    icon = <ClipboardList size={25} />,
    callback,
    isOpen,
    triggerButton }: Props) {
    const [open, setOpen] = useState(false);

    const { data: presentations, isLoading } = useQuery({
        queryKey: ['more-presentations', prodcutId],
        queryFn: () => prodcutId ? getMorePresentations(prodcutId) : Promise.reject(new Error('Product ID is undefined')),
    });

    useEffect(() => {
        if (isOpen) {
            setOpen(isOpen);
        }
    }, [isOpen]);

    const closeModal = useCallback(() => {
        // Close the modal
        setOpen(false);
        callback();
    }, []);

    return (
        <Sheet open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                closeModal();
            } else {
                setOpen(isOpen);
            }
        }}>
            <SheetTrigger>
                {triggerButton}
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
                            {presentations && presentations.map((product: ProductSchemaType) => (
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
                                    <TableCell className="bg-muted/20 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {(formatToArgentinianPesos(+product.price))}
                                        </p>
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
