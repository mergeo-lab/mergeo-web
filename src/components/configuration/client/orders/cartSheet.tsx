import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { Button } from "@/components/ui/button";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { cratePreOrder } from "@/lib/orders";
import UseSearchStore, { CartProduct } from "@/store/search.store";
import UseSearchConfigStore from "@/store/searchConfiguration.store.";
import UseUserStore from "@/store/user.store";
import { useMutation } from "@tanstack/react-query";
import { ClipboardList, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from '@tanstack/react-router'

type Props = {
    title?: string,
    subTitle?: string,
    icon?: React.ReactNode,
    callback: () => void
    triggerButton?: React.ReactNode
    isOpen?: boolean
}

export function CartSheet({
    title = "Resumen de su Pedido",
    subTitle = "Aca podras ver los productos que fuiste seleccionando!",
    icon = <ClipboardList size={25} />,
    callback,
    isOpen,
    triggerButton }: Props) {
    const mutation = useMutation({ mutationFn: cratePreOrder })
    const [open, setOpen] = useState(false);
    const { getAllSavedProducts, saveProduct, removeProduct } = UseSearchStore();
    const { getAllConfig } = UseSearchConfigStore();
    const { user } = UseUserStore();
    const products = getAllSavedProducts();
    const router = useRouter();

    const totalPrice = products
        .reduce((sum, product) => {
            const price = parseFloat(product.price) * product.quantity;
            return sum + (isNaN(price) ? 0 : price);
        }, 0)
        .toFixed(2);

    useEffect(() => {
        if (isOpen) {
            setOpen(isOpen);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mutation.isSuccess) {
            router.navigate({ to: '/client/proOrders', search: { id: mutation.data.preOrderId } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mutation.isSuccess]);

    const closeModal = useCallback(() => {
        // Close the modal
        setOpen(false);
        callback();
    }, []);

    const onSubmit = async () => {
        if (!user) return;
        const config = getAllConfig();

        console.log(" ------- PRODUCT --------")
        console.log(getAllSavedProducts())
        console.log(" ------- PRODUCT --------")

        mutation.mutate({
            userId: user?.id,
            searchParams: {
                branchId:
                    config.branch && config.branch !== null ? config.branch.id : '',
                expectedDeliveryStartDay: config.deliveryTime &&
                    config.deliveryTime?.from?.toISOString().split('T')[0],
                expectedDeliveryEndDay:
                    config.deliveryTime.to &&
                    config?.deliveryTime?.to.toISOString().split('T')[0],
                startHour: '00',
                endHour: '2400',
                isPickUp: config.pickUp,
                pickUpLat: config.pickUpLocation.location.latitude,
                pickUpLng: config.pickUpLocation.location.longitude,
                pickUpRadius: config.pickUpLocation.radius,
            },
            reacteplacementCriteria: config.replacementCriteria,
            cartProducts: getAllSavedProducts()
        })
        callback();
    }

    function checkProductsAmount() {
        const savedProducts = getAllSavedProducts();
        if (savedProducts.length < 1) {
            closeModal();
        }
    }

    function handleProductChange(product: CartProduct, quantity: number) {
        if (quantity === 0) {
            removeProduct(product.id);
        } else {
            saveProduct(product, quantity);
        }
        checkProductsAmount();
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
                {triggerButton}
            </SheetTrigger>
            <SheetContent className="w-1/3 mx-w-1/3 sm:max-w-1/3">
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
                    {
                        mutation.isPending && <OverlayLoadingIndicator />
                    }
                    <Table>
                        <TableHeader className="sticky top-0 bg-white shadow-sm">
                            <TableRow className="hover:bg-white [&>*]:text-center">
                                <TableHead className="!text-left">Producto</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio Unitario</TableHead>
                                <TableHead>Precio Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&>*]:hover:bg-white">
                            {products.map((product) => (
                                <TableRow key={product.id} className="[&>*]:text-center">
                                    <TableCell className="!text-left">
                                        <p className="text-sm text-muted-foreground">{product.name}, {product.brand} x {product.net_content}{product.measurementUnit}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center items-center gap-2">
                                            <QuantitySelector defaultValue={product.quantity} onChange={(quantity) => handleProductChange(product, quantity)} />
                                            <Button variant="ghost" className="[&>*]:hover:text-destructive" onClick={() => handleProductChange(product, 0)}>
                                                <Trash2 size={15} className="text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <p className="text-sm text-muted-foreground">${(+product.price).toFixed(2)}</p>
                                    </TableCell>
                                    <TableCell className="bg-muted/20 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            ${(+product.price * product.quantity).toFixed(2)}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="[&>*]:text-center">
                                <TableCell colSpan={3} className="bg-muted/20 !text-left">
                                    <p className="text-muted-foreground font-bold">Total</p>
                                </TableCell>
                                <TableCell className="border border-muted/40">
                                    <p className="text-muted-foreground font-bold">
                                        ${totalPrice}
                                    </p>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <SheetFooter className="p-10 items-center">
                    <SheetClose className="w-full">
                        <Button variant="secondary" className="w-full" onClick={() => { }}>Cerrar</Button>
                    </SheetClose>
                    <Button onClick={() => onSubmit()} type="submit" className="w-full">Realizar Pedido</Button>
                </SheetFooter>
            </SheetContent >
        </Sheet >
    )
}
