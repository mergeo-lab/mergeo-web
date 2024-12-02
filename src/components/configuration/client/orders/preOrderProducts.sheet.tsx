import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { PreOrderProductSchema } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { PRE_ORDER_STATUS } from "@/lib/constants";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    triggerButton?: React.ReactNode
    isOpen?: boolean,
    products: PreOrderProductSchema[]
    orderStatus: PRE_ORDER_STATUS
}

export function PreOrderProductsSheet({
    title = "Productos",
    subTitle = "",
    icon = <ClipboardList size={25} />,
    isOpen,
    triggerButton,
    products,
    orderStatus
}: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setOpen(isOpen);
        }
    }, [isOpen]);

    console.log("products", products)

    return (
        <Sheet open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setOpen(false);
            } else {
                setOpen(isOpen);
            }
        }}>
            <SheetTrigger>
                {triggerButton}
            </SheetTrigger>
            <SheetContent className="w-[800px] mx-w-1/3 sm:max-w-1/3">
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
                                <TableHead>Unidad de Medida</TableHead>
                                <TableHead>Precio Unitario</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Precio Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&>*]:hover:bg-white">
                            {products.map((item) => (
                                <TableRow className="hover:bg-white [&>*]:text-center">
                                    <TableCell className="text-left">
                                        <div className="flex flex-col items-start">
                                            <span>{item.product.name}</span>
                                            <span className="text-muted">{item.product.brand}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.product.measurementUnit}</TableCell>
                                    <TableCell>{item.product.price}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{
                                        orderStatus === PRE_ORDER_STATUS.pending ? <Badge className="bg-yellow-500 hover:bg-yellow-500">Pendiente</Badge> :
                                            item.accepted ? <Badge>Aceptado</Badge> : <Badge variant='destructive'>Rechazado</Badge>}
                                    </TableCell>
                                    <TableCell>{(item.quantity * +item.product.price).toFixed(2)}</TableCell>
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
