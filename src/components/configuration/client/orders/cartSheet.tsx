import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cratePreOrder } from "@/lib/orders";
import UseSearchStore, { CartProduct, ProductWithQuantity } from "@/store/search.store";
import { LuClipboardList } from "react-icons/lu";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from '@tanstack/react-router'
import { useAuth } from "@/context/AuthContext";
import UseSearchConfigStore from "@/store/searchConfiguration.store";
import { useMutation } from "@tanstack/react-query";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { formatToArgentinianPesos } from '../../../../lib/utils';
import { SaveOrderAsListDialog } from "./saveOrderAsListDialog";
import { toast } from "@/components/ui/use-toast";
import LoadingIndicator from "@/components/loadingIndicator";

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
    const { saveProduct, removeProduct, reset } = UseSearchStore();
    const savedProductsObj = UseSearchStore(state => state.savedProducts);
    const products = useMemo(() => Object.values(savedProductsObj).flat(), [savedProductsObj]);
    const getAllConfig = UseSearchConfigStore((state: { getAllConfig: () => any }) => state.getAllConfig);
    const [showCountdown, setShowCountdown] = useState(false);
    const { account } = useAuth();
    const user = account?.user;
    const router = useRouter();

    // State for save list dialog and processing
    const [showSaveListDialog, setShowSaveListDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const totalPrice = products
        .reduce((sum: number, product: ProductWithQuantity) => {
            const price = Number(product.price) * (product.quantity || 0);
            return sum + (isNaN(price) ? 0 : price);
        }, 0)
        .toFixed(2);

    // Debug effect for processing state
    useEffect(() => {
        console.log('Processing state changed:', { isProcessing });
    }, [isProcessing]);

    const closeModal = useCallback(() => {
        callback();
    }, [callback]);

    const navigateToPedidos = () => {
        setShowCountdown(true);
        const timeout = setTimeout(() => {
            // Clear cart when order is successfully created
            reset();
            router.navigate({ to: '/client/proOrders', search: { id: mutation.data?.preOrderId } });
            setIsProcessing(false);
            clearTimeout(timeout);
            setShowCountdown(false);
        }, 3000);
    };

    const handleOrderSubmission = async (saveList: boolean, listName?: string) => {
        console.log('handleOrderSubmission called with:', { saveList, listName });
        if (!user) return;

        // Close dialog immediately and show loading in sheet
        setShowSaveListDialog(false);
        setIsProcessing(true);

        const config = getAllConfig();
        console.log('Config:', config);

        // Helper function to safely convert to date string
        const getDateString = (dateValue: any) => {
            if (!dateValue) return undefined;
            const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
            return isNaN(date.getTime()) ? undefined : date.toISOString().split('T')[0];
        };

        try {
            console.log('Starting order creation...');
            // Create order
            const orderPromise = mutation.mutateAsync({
                userId: user?.id,
                searchParams: {
                    branchId:
                        config.branch && config.branch !== null ? config.branch.id : '',
                    expectedDeliveryStartDay: getDateString(config.deliveryTime?.from),
                    expectedDeliveryEndDay: getDateString(config.deliveryTime?.to),
                    startHour: '2400',
                    endHour: '0000',
                    isPickUp: config.pickUp,
                    pickUpLat: config.pickUpLocation.location.latitude,
                    pickUpLng: config.pickUpLocation.location.longitude,
                    pickUpRadius: config.pickUpLocation.radius,
                },
                reacteplacementCriteria: config.replacementCriteria,
                cartProducts: products
            });

            // If user wants to save list, create it in parallel
            let listPromise = null;
            if (saveList && listName) {
                console.log('Starting list creation...');
                const { newSearchList } = await import("@/lib/searchLists/searchLists");
                const { default: UseCompanyStore } = await import("@/store/company.store");
                const company = UseCompanyStore.getState().company;

                if (company?.id) {
                    const listProducts = products.map(product => ({
                        name: product.name + ' ' + product.variety,
                        category: product.segment,
                    }));

                    listPromise = newSearchList({
                        companyId: company.id,
                        body: {
                            name: listName.trim(),
                            createdBy: user.name,
                            products: listProducts
                        }
                    });
                }
            }

            console.log('Waiting for operations to complete...');
            // Wait for both operations to complete
            await Promise.all([orderPromise, listPromise].filter(Boolean));
            console.log('Operations completed successfully');

            // Navigate immediately after operations complete
            navigateToPedidos();

        } catch (error: any) {
            console.error('Error processing order:', error);
            setIsProcessing(false);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al procesar el pedido. Inténtelo de nuevo.",
            });
        }
    };

    const onSubmit = () => {
        setShowSaveListDialog(true);
    }

    function handleProductChange(product: CartProduct, quantity: number) {
        if (quantity === 0) {
            removeProduct(product.id);
        } else {
            saveProduct(product, quantity);
        }
    }

    return (
        <>
            <Sheet open={isOpen || false} onOpenChange={(open) => {
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
                        {
                            showCountdown
                                ? <div className="flex flex-col justify-center items-center h-full animate-fade-in">
                                    <p className="text-lg font-bold text-muted-foreground">Pedido Realizado!</p>
                                    <p className="text-sm text-muted-foreground mb-5">Redirigiendo a la página de pedidos...</p>
                                    <LoadingIndicator />
                                </div>
                                : (
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
                                                {(mutation.isPending) && <OverlayLoadingIndicator />}
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
                                )}
                    </div>
                    <SheetFooter className="p-10 items-center">
                        <SheetClose className="w-full" disabled={showCountdown}>
                            <Button variant="secondary" className="w-full" disabled={showCountdown}>Volver</Button>
                        </SheetClose>
                        <Button
                            onClick={() => onSubmit()}
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending || isProcessing || showCountdown}
                        >
                            {mutation.isPending || isProcessing ? 'Procesando...' : 'Realizar Pedido'}
                        </Button>
                    </SheetFooter>
                </SheetContent >
            </Sheet >

            {/* Save List Dialog */}
            <SaveOrderAsListDialog
                isOpen={showSaveListDialog}
                onClose={() => setShowSaveListDialog(false)}
                onSaveList={(listName) => handleOrderSubmission(true, listName)}
                onSkipList={() => handleOrderSubmission(false)}
                _products={products}
                _userName={user?.name || ''}
                isProcessing={isProcessing}
            />
        </>
    )
}
