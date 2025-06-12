import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useCallback, useEffect, useMemo } from "react";
import { cratePreOrder } from "@/lib/orders";
import UseSearchStore, { CartProduct, ProductWithQuantity } from "@/store/search.store";
import { LuClipboardList } from "react-icons/lu";
import { SheetWithConfirm } from "@/components/SheetWithConfirm";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from '@tanstack/react-router'
import { useAuth } from "@/context/AuthContext";
import UseSearchConfigStore from "@/store/searchConfiguration.store";
import { useMutation } from "@tanstack/react-query";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { formatToArgentinianPesos } from '../../../../lib/utils';

type Props = {
    title?: string,
    subTitle?: string,
    icon?: React.ReactNode,
    callback: () => void
    triggerButton?: React.ReactNode
    isOpen?: boolean
    onInteractOutside?: () => void
}

export function CartSheet({
    title = "Resumen de su Pedido",
    subTitle = "Aca podras ver los productos que fuiste seleccionando!",
    icon = <LuClipboardList size={25} />,
    callback,
    isOpen,
    triggerButton,
    onInteractOutside }: Props) {
    console.log('Rendering CartSheet');
    const mutation = useMutation({ mutationFn: cratePreOrder })
    const { saveProduct, removeProduct } = UseSearchStore();
    const savedProductsObj = UseSearchStore(state => state.savedProducts);
    const products = useMemo(() => Object.values(savedProductsObj).flat(), [savedProductsObj]);
    const getAllConfig = UseSearchConfigStore((state: { getAllConfig: () => any }) => state.getAllConfig);
    const { account } = useAuth();
    const user = account?.user;
    const router = useRouter();

    const totalPrice = products
        .reduce((sum: number, product: ProductWithQuantity) => {
            const price = Number(product.price) * (product.quantity || 0);
            return sum + (isNaN(price) ? 0 : price);
        }, 0)
        .toFixed(2);

    useEffect(() => {
        if (mutation.isSuccess) {
            setTimeout(() => {
                router.navigate({ to: '/client/proOrders', search: { id: mutation.data.preOrderId } });
            }, 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mutation.isSuccess]);

    useEffect(() => {
        if (products.length === 0 && isOpen) {
            callback();
        }
    }, [products.length, isOpen, callback]);

    const closeModal = useCallback(() => {
        callback();
    }, [callback]);

    const onSubmit = async () => {
        if (!user) return;
        const config = getAllConfig();

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
            cartProducts: products
        })
    }

    function checkProductsAmount() {
        const savedProducts = products;
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
        <SheetWithConfirm open={isOpen || false} onOpenChange={(open) => {
            if (!open) {
                closeModal();
            }
        }}>
            <SheetTrigger>
                {triggerButton}
            </SheetTrigger>
            <SheetContent className="w-1/2 mx-w-1/2 sm:max-w-1/2" {...(onInteractOutside && { onInteractOutside: onInteractOutside })}>
                <SheetHeader>
                    <SheetTitle className="flex gap-2 items-center">
                        {icon}
                        {title}
                    </SheetTitle>
                    <SheetDescription>
                        {subTitle}
                    </SheetDescription>
                </SheetHeader>
                <div className="h-[calc(100vh-230px)] overflow-y-auto mt-5 pr-2">
                    <div className="relative">
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
                                {mutation.isPending && <OverlayLoadingIndicator />}
                                {products.map((product) => (
                                    <TableRow key={product.id} className="[&>*]:text-center">
                                        <TableCell className="!text-left">
                                            <p className="text-sm text-muted-foreground">{product.name}, {product.brand} x {product.netContent}{product.measurementUnit}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center gap-2">
                                                <QuantitySelector defaultValue={product.quantity || 0} onChange={(quantity) => handleProductChange(product, quantity)} />
                                                <Button variant="ghost" className="[&>*]:hover:text-destructive" onClick={() => handleProductChange(product, 0)}>
                                                    <FaRegTrashAlt size={15} className="text-muted-foreground" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <p className="text-sm text-muted-foreground">${Number(product.price).toFixed(2)}</p>
                                        </TableCell>
                                        <TableCell className="bg-muted/20 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                {formatToArgentinianPesos(Number(product.price) * (product.quantity || 0))}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="sticky bottom-0 bg-white border-t border-border">
                            <Table>
                                <TableBody className="bg-white">
                                    <TableRow className="[&>*]:text-center hover:bg-white">
                                        <TableCell className="bg-muted/20 border border-muted/40 text-center">
                                            <p className="text-muted-foreground font-bold">TOTAL</p>
                                        </TableCell>
                                        <TableCell className="border border-muted/40">
                                            <p className="text-muted-foreground font-bold">
                                                {formatToArgentinianPesos(Number(totalPrice))}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <SheetFooter className="p-10 items-center">
                    <SheetClose className="w-full">
                        <Button variant="secondary" className="w-full">Cerrar</Button>
                    </SheetClose>
                    <Button onClick={() => onSubmit()} type="submit" className="w-full">Realizar Pedido</Button>
                </SheetFooter>
            </SheetContent >
        </SheetWithConfirm >
    )
}
