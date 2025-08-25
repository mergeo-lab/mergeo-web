import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useState } from "react";
import { createClientPreOrder } from "@/lib/orders";
import UseSearchStore, { ProductWithQuantity } from "@/store/search.store";
import { LuClipboardList } from "react-icons/lu";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from '@tanstack/react-router'
import { useAuth } from "@/context/AuthContext";
import UseSearchConfigStore from "@/store/searchConfiguration.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { formatToArgentinianPesos, getDateString } from '../../../../lib/utils';
import { toast } from "@/components/ui/use-toast";
import LoadingIndicator from "@/components/loadingIndicator";
import { GiShoppingCart } from "react-icons/gi";
import { TbCalendarTime, TbReplace } from "react-icons/tb";
import { DeliveryDateDialog } from "./deliveryDateDialog";
import { cn } from "@/lib/utils";
import { RxCross2 } from "react-icons/rx";
import { ReplacementDialog } from "./replacementDialog";
import { ReplacementCriteriaLabel } from "./ReplacementCriteriaBadge";
import { ReplacementCriteria } from "@/lib/constants";
import { useScrollRestore } from "@/hooks/useScrollRestore";

import { SaveOrderList } from "./saveOrderList";

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
    const queryClient = useQueryClient();
    const mutation = useMutation({ mutationFn: createClientPreOrder })
    const { getAllSavedProducts, removeProduct, updateProductDeliveryDate, updateProductReplacementCriteria, updateProductQuantity, reset: resetStore } = UseSearchStore();
    const { getAllConfig } = UseSearchConfigStore();
    const { account } = useAuth();
    const user = account?.user;
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [deliveryDateDialogOpen, setDeliveryDateDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithQuantity | null>(null);
    const [replacementDialogOpen, setReplacementDialogOpen] = useState(false);
    const [selectedProductForReplacement, setSelectedProductForReplacement] = useState<ProductWithQuantity | null>(null);

    // Estados para la funcionalidad de guardar lista
    const [showSaveListSection, setShowSaveListSection] = useState(false);
    const [listName, setListName] = useState('');
    const [selectedExistingList, setSelectedExistingList] = useState<string>('');
    const [listType, setListType] = useState<'new' | 'existing'>('new');
    const [isModalAnimating, setIsModalAnimating] = useState(false);

    // Usar el hook personalizado para restaurar el scroll
    const { restoreScroll } = useScrollRestore(isOpen || false);

    const config = getAllConfig();

    const products = getAllSavedProducts();
    const totalPrice = products.reduce((total, product) => {
        return total + (Number(product.price) * (product.quantity || 0));
    }, 0);

    const closeModal = () => {
        if (showSaveListSection) {
            setIsModalAnimating(true);
            setTimeout(() => {
                setShowSaveListSection(false);
                setListName('');
                setSelectedExistingList('');
                setListType('new');
                setIsModalAnimating(false);
            }, 200);
        }
        
        // Restaurar scroll usando el hook
        restoreScroll();
        
        callback();
    };

    const navigateToPedidos = () => {
        setShowCountdown(true);
        const timeout = setTimeout(() => {
            // Clear cart when order is successfully created
            resetStore();
            // Clear saved configuration
            const { clearConfig } = UseSearchConfigStore.getState();
            clearConfig();

            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['preorders-paginated'] });
            queryClient.invalidateQueries({ queryKey: ['sell-preorders-paginated'] });
            queryClient.invalidateQueries({ queryKey: ['sell-preorders-all'] });

            router.navigate({ to: '/client/preOrders', search: { id: mutation.data?.preOrderId } });
            setIsProcessing(false);
            clearTimeout(timeout);
            setShowCountdown(false);
        }, 3000);
    };

    const handleOrderSubmission = async (saveList: boolean, listName?: string) => {
        console.log('handleOrderSubmission called with:', { saveList, listName });
        if (!user) return;

        // Hide save list section and show loading
        setShowSaveListSection(false);
        setIsProcessing(true);

        try {
            console.log('Starting order creation...');

            // Create order with products (individual delivery dates are stored locally for now)
            const orderPromise = mutation.mutateAsync({
                userId: user?.id,
                searchParams: {
                    branchId:
                        config.branch && config.branch !== null ? config.branch.id : '',
                    expectedDeliveryStartDay: getDateString(config.deliveryTime?.from, 'iso'),
                    expectedDeliveryEndDay: getDateString(config.deliveryTime?.to, 'iso'),
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

        } catch (error) {
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
        // Ahora onSubmit solo hace el pedido directamente, sin mostrar el dialog de guardar lista
        handleOrderSubmission(false);
    }





    const handleCancelSaveList = () => {
        setIsModalAnimating(true);
        setTimeout(() => {
            setShowSaveListSection(false);
            setListName('');
            setSelectedExistingList('');
            setListType('new');
            setIsModalAnimating(false);
        }, 200);
    };

    const handleShowSaveListDialog = () => {
        setShowSaveListSection(true);
        setIsModalAnimating(true);
        setListName('');
        setSelectedExistingList('');
        setListType('new'); // Por defecto siempre empieza en 'new'
        // Iniciar animación de entrada después de un pequeño delay
        setTimeout(() => {
            setIsModalAnimating(false);
        }, 10);
    };

    function handleProductChange(product: ProductWithQuantity, quantity: number) {
        if (quantity === 0) {
            // Remove product completely from the store
            removeProduct(product.id);
            // Also remove delivery date when product is removed
            removeDeliveryDate(product.id);
            // Also remove replacement criteria when product is removed
            removeReplacementCriteria(product.id);
        } else {
            // Use the specific update function to avoid duplication
            updateProductQuantity(product.id, quantity);
        }
    }

    const handleDeliveryDateChange = (productId: string, deliveryDate: Date) => {
        updateProductDeliveryDate(productId, deliveryDate);
    };

    const removeDeliveryDate = (productId: string) => {
        console.log('[removeDeliveryDate] called with productId:', productId);
        updateProductDeliveryDate(productId, null);
    };

    const openDeliveryDateDialog = (product: ProductWithQuantity) => {
        setSelectedProduct(product);
        setDeliveryDateDialogOpen(true);
    };

    const handleReplacementCriteriaChange = (productId: string, replacementCriteria: ReplacementCriteria) => {
        console.log(`[CartSheet] Updating replacement criteria for ${productId} to:`, replacementCriteria);
        updateProductReplacementCriteria(productId, replacementCriteria);
    };

    const removeReplacementCriteria = (productId: string) => {
        console.log(`[CartSheet] Removing replacement criteria for ${productId}`);
        updateProductReplacementCriteria(productId, null);
    };

    const handleRemoveProduct = (product: ProductWithQuantity) => {
        console.log(`[CartSheet] Removing product completely:`, {
            productId: product.id,
            productName: product.name,
            totalProductsBefore: products.length
        });
        // Remove product completely from the store
        removeProduct(product.id);
    };

    const openReplacementDialog = (product: ProductWithQuantity) => {
        setSelectedProductForReplacement(product);
        setReplacementDialogOpen(true);
    };

    return (
        <>
            <Sheet open={isOpen || false} onOpenChange={(open) => {
                if (!open) {
                    // Restaurar scroll usando el hook
                    restoreScroll();
                    closeModal();
                }
            }}>

                <SheetTrigger>
                    {triggerButton}
                </SheetTrigger>
                <SheetContent 
                    className="w-[800px] min-w-[800px]" 
                    disableScrollLock={true}
                    {...(onInteractOutside && { onInteractOutside: onInteractOutside })}
                >
                    <div className="relative">
                        <SheetHeader>
                            <SheetTitle className="relative">
                                <div className="flex gap-2 items-center">
                                    {icon}
                                    {title}
                                </div>
                                <Button
                                    variant="outline"
                                    className="text-destructive gap-2 border-destructive hover:bg-destructive/20 absolute right-5 top-5"
                                    onClick={() => resetStore()}
                                    disabled={products.length === 0 || mutation.isPending || isProcessing || showCountdown}
                                >
                                    <FaRegTrashAlt size={15} className={cn("text-destructive", {
                                        "text-muted-foreground": products.length === 0 || mutation.isPending || isProcessing || showCountdown
                                    })} />
                                    Vaciar carrito
                                </Button>
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
                                    : products.length === 0
                                        ? <div className="h-full flex flex-col justify-center items-center relative pb-24">
                                            <GiShoppingCart size={300} className="text-muted-foreground/10" />
                                            <div className="absolute w-full h-full flex flex-col justify-center items-center">
                                                <p className="text-lg font-bold text-muted-foreground">No tenes productos en el carrito!</p>
                                                <p className="text-sm text-info">Agrega productos para continuar</p>
                                            </div>
                                        </div>
                                        : (
                                            <div className="relative">
                                                <Table>
                                                    <TableHeader className="sticky top-0 bg-white shadow-sm">
                                                        <TableRow className="hover:bg-white [&>*]:text-center">
                                                            <TableHead className="!text-left">PRODUCTO</TableHead>
                                                            <TableHead>CONTENIDO NETO</TableHead>
                                                            <TableHead>FECHA DE ENTREGA</TableHead>
                                                            <TableHead>PUM</TableHead>
                                                            <TableHead>PRECIO</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="[&>*]:hover:bg-white">
                                                        {(mutation.isPending) && <OverlayLoadingIndicator />}
                                                        {products.map((product) => (
                                                            <TableRow key={product.id} className="[&>*]:text-center">
                                                                <TableCell className="!text-left">
                                                                    <div className="flex flex-col gap-1">
                                                                        <p className="text-sm text-muted-foreground">{product.name}, {product.brand} x {product.netContent}{product.measurementUnit}</p>
                                                                        <div className="flex items-center gap-1">
                                                                            {product?.replacementCriteria && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => removeReplacementCriteria(product.id)}
                                                                                    className="text-xs w-6 h-6 p-0"
                                                                                    title="Eliminar criterio de reemplazo"
                                                                                >
                                                                                    <RxCross2 size={16} className="text-destructive" />
                                                                                </Button>
                                                                            )}
                                                                            <Button
                                                                                variant="ghost"
                                                                                onClick={() => openReplacementDialog(product)}
                                                                                className={cn("text-xs w-auto h-6 p-0 flex items-center gap-1 px-2", {
                                                                                    "text-info": product?.replacementCriteria,
                                                                                    "text-muted-foreground": !product.replacementCriteria
                                                                                })}
                                                                                title={product?.replacementCriteria ? "Cambiar criterio de reemplazo" : "Establecer criterio de reemplazo"}
                                                                            >
                                                                                <TbReplace size={16} />
                                                                                {product?.replacementCriteria ? (
                                                                                    <ReplacementCriteriaLabel
                                                                                        criteria={product.replacementCriteria}
                                                                                        className="text-[0.75rem]"
                                                                                    />
                                                                                ) : (
                                                                                    <span className="text-muted-foreground text-[0.75rem]">
                                                                                        cambiar criterio de reemplso
                                                                                    </span>
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex justify-center items-center gap-2">
                                                                        <QuantitySelector key={product.id} defaultValue={product.quantity || 0} onChange={(quantity) => handleProductChange(product, quantity)} />
                                                                        <Button
                                                                            variant="ghost"
                                                                            className="[&>*]:hover:text-destructive"
                                                                            onClick={() => {
                                                                                console.log('[CartSheet] Trash button clicked for product:', product.id);
                                                                                handleRemoveProduct(product);
                                                                            }}
                                                                        >
                                                                            <FaRegTrashAlt size={15} className="text-muted-foreground" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-1 text-[0.7rem] items-center">
                                                                        {product?.deliveryDate && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => removeDeliveryDate(product.id)}
                                                                                className="text-xs w-6 h-6 p-0"
                                                                                title="Eliminar fecha de entrega"
                                                                            >
                                                                                <RxCross2 size={16} className="text-destructive" />
                                                                            </Button>
                                                                        )}
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => openDeliveryDateDialog(product)}
                                                                            className={cn("text-xs w-6 h-6 p-0", {
                                                                                "text-info": product?.deliveryDate,
                                                                                "text-muted-foreground": !product.deliveryDate
                                                                            })}
                                                                            title={product?.deliveryDate ? "Cambiar fecha de entrega" : "Establecer fecha de entrega"}
                                                                        >
                                                                            <TbCalendarTime size={16} />
                                                                        </Button>
                                                                        {product?.deliveryDate ? (
                                                                            <span className="text-info text-[0.75rem]">
                                                                                {product?.deliveryDate.toLocaleDateString('es-ES', {
                                                                                    day: '2-digit',
                                                                                    month: '2-digit',
                                                                                    year: 'numeric'
                                                                                })}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-[0.75rem]">
                                                                                {getDateString(config?.deliveryTime?.from, 'locale')} - {getDateString(config?.deliveryTime?.to, 'locale')}
                                                                            </span>
                                                                        )}
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
                                        )
                            }
                            {showSaveListSection && (
                                <SaveOrderList
                                    isOpen={showSaveListSection}
                                    isAnimating={isModalAnimating}
                                    listName={listName}
                                    setListName={setListName}
                                    selectedExistingList={selectedExistingList}
                                    setSelectedExistingList={setSelectedExistingList}
                                    listType={listType}
                                    setListType={setListType}
                                    onCancel={handleCancelSaveList}
                                    products={products}
                                />
                            )}
                        </div>
                        <SheetFooter className=" items-center">
                            {/* Sección de guardar lista */}
                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full mb-4 mt-4 flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        ¿Quieres guardar los productos en una lista?
                                    </p>
                                    <Button
                                        variant="link"
                                        onClick={handleShowSaveListDialog}
                                        className="text-info hover:text-info/80 p-0 h-auto"
                                        disabled={products.length === 0 || mutation.isPending || isProcessing || showCountdown}
                                    >
                                        Guardar
                                    </Button>
                                </div>
                                <div className="w-full flex gap-2">
                                    <SheetClose className="w-full" disabled={showCountdown}>
                                        <Button variant="secondary" className="w-full" disabled={showCountdown}>Volver</Button>
                                    </SheetClose>
                                    <Button
                                        onClick={() => onSubmit()}
                                        type="submit"
                                        className="w-full"
                                        disabled={mutation.isPending || isProcessing || showCountdown || products.length === 0}
                                    >
                                        {mutation.isPending || isProcessing ? 'Procesando...' : 'Hacer Pedido'}
                                    </Button>
                                </div>
                            </div>

                        </SheetFooter>

                    </div>
                </SheetContent >
            </Sheet >

            {/* Delivery Date Dialog */}
            {selectedProduct && (
                <DeliveryDateDialog
                    isOpen={deliveryDateDialogOpen}
                    onClose={() => {
                        setDeliveryDateDialogOpen(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    onDateChange={handleDeliveryDateChange}
                    onRemoveDate={removeDeliveryDate}
                    currentDeliveryDate={selectedProduct?.deliveryDate || undefined}
                />
            )}

            {/* Replacement Criteria Dialog */}
            {selectedProductForReplacement && (
                <ReplacementDialog
                    isOpen={replacementDialogOpen}
                    onClose={() => {
                        setReplacementDialogOpen(false);
                        setSelectedProductForReplacement(null);
                    }}
                    product={selectedProductForReplacement}
                    onChange={handleReplacementCriteriaChange}
                    currentReplacement={selectedProductForReplacement?.replacementCriteria}
                    onRemoveReplacement={removeReplacementCriteria}
                />
            )}
        </>
    )
}
