import { ProductsPresentations } from "@/components/configuration/client/orders/ProductsPresentations";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { OptimisticToggleButton } from "@/components/optimisticToggleButton";
import PickUpIndicator from "@/components/pickUpIndicator";
import { TableRow, TableCell } from "@/components/ui/table";
import { ProductSchemaType } from "@/lib/schemas";
import { cn, formatToArgentinianPesos } from "@/lib/utils";
import UseMorePresentations from "@/store/productMorePresentations";
import { memo, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { LuImage } from "react-icons/lu";
import { TiThumbsDown } from "react-icons/ti";
import { DeliveryDateDialog } from "./deliveryDateDialog";
import UseSearchStore from "@/store/search.store";
import ProductOptions from "@/components/configuration/client/orders/prductOptions";
import { ReplacementDialog } from "@/components/configuration/client/orders/replacementDialog";
import { ReplacementCriteria } from "@/lib/constants";
import { ReplacementCriteriaBadge, ReplacementCriteriaLabel } from "./ReplacementCriteriaBadge";
import { ProductWithQuantity } from "@/store/search.store";

type Params = {
    product: ProductSchemaType,
    onQuantityChange: (product: ProductSchemaType, quantity: number) => void,
    savedProducts: ProductWithQuantity[],
    handleToggleFavorite: (itemId: string, newState: boolean) => Promise<void>,
    addProductToBlackList: (productId: string) => Promise<void>,
    dropZoneId?: string
}

// Helper function to compare saved products arrays
const areSavedProductsEqual = (prev: ProductWithQuantity[], next: ProductWithQuantity[]) => {
    if (prev.length !== next.length) return false;
    return prev.every((p, i) => {
        const nextProduct = next[i];
        return p.id === nextProduct.id &&
            p.quantity === nextProduct.quantity &&
            p.replacementCriteria === nextProduct.replacementCriteria &&
            p.deliveryDate?.getTime() === nextProduct.deliveryDate?.getTime();
    });
};

const ProductRow = ({ product, onQuantityChange, savedProducts, handleToggleFavorite, addProductToBlackList, dropZoneId }: Params) => {
    const { toggleSheetOpen } = UseMorePresentations();
    const { updateProductDeliveryDate, updateProductReplacementCriteria, getSavedProductById } = UseSearchStore();
    const [deliveryDateDialogOpen, setDeliveryDateDialogOpen] = useState(false);
    const [replacementDialogOpen, setReplacementDialogOpen] = useState(false);

    const savedProduct = getSavedProductById(product.id);
    const hasCustomDeliveryDate = savedProduct?.deliveryDate;
    const hasCustomReplacementCriteria = savedProduct?.replacementCriteria;

    // Debug logging
    console.log(`[ProductRow] Product ${product.id} - replacementCriteria:`, savedProduct?.replacementCriteria);

    const handleDeliveryDateChange = (productId: string, deliveryDate: Date) => {
        updateProductDeliveryDate(productId, deliveryDate);
    };

    const removeDeliveryDate = (productId: string) => {
        updateProductDeliveryDate(productId, null);
    };

    const handleReplacementCriteriaChange = (productId: string, replacementCriteria: ReplacementCriteria) => {
        console.log(`[ProductRow] Updating replacement criteria for ${productId} to:`, replacementCriteria);
        updateProductReplacementCriteria(productId, replacementCriteria);
    };

    const removeReplacementCriteria = (productId: string) => {
        console.log(`[ProductRow] Removing replacement criteria for ${productId}`);
        updateProductReplacementCriteria(productId, null);
    };

    return (
        <>
            <TableRow>
                <TableCell className="p-0 m-0 w-10 hidden 2xl:table-cell">
                    <div className="flex justify-center flex-col gap-1">
                        <OptimisticToggleButton
                            itemId={product.id}
                            defaultState={product.isFavorite || false}
                            onToggle={handleToggleFavorite}
                            activeIcon={<FaRegHeart className="text-red-500" strokeWidth={3} size={16} />}
                            inactiveIcon={<FaRegHeart size={16} />}
                            tooltip="Agregar a favoritos"
                        />
                        <OptimisticToggleButton
                            itemId={product.id}
                            onToggle={async (id) => {
                                try {
                                    await addProductToBlackList(id);
                                } catch (error) {
                                    console.error("Error adding to blacklist", error);
                                }
                            }}
                            activeIcon={<TiThumbsDown size={20} />}
                            inactiveIcon={<TiThumbsDown size={20} />}
                            tooltip="Agregar a Lista Negra"
                            disabled={product.isFavorite}
                        />

                    </div>
                </TableCell>
                <TableCell className="p-0 m-0 py-2 w-52 max-w-[14rem] 2xl:max-w-none 2xl:w-[35%]">
                    <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-2 pr-3 relative pl-2 border border-border p-2 rounded ml-2 bg-slate-400/5">
                        <div className={cn("rounded w-20 h-20 flex-shrink-0 flex justify-center items-center border border-border", {
                            "bg-border": !product.image
                        })}>
                            {product.image
                                ? <div className="w-full h-full bg-contain bg-no-repeat bg-center" style={{ backgroundImage: (`URL(${product.image})`) }}>
                                </div>
                                : <LuImage size={50} className="text-white" />
                            }
                        </div>
                        <div className="flex flex-col text-center sm:text-left truncate max-w-[18rem]">
                            <p title={product.name.toUpperCase()} className="font-semibold truncate">{product.name.toUpperCase()}</p>
                            <p title={product.variety?.toUpperCase()} className="font-base truncate">{product.variety?.toUpperCase()}</p>
                            <p className="text-info font-thin text-sm">{product.brand}</p>
                            <div className="flex items-center gap-1">
                                {hasCustomDeliveryDate && (
                                    <p className="text-[10px] text-info font-medium mt-1 mr-2">
                                        Entrega: {savedProduct.deliveryDate?.toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                )}
                                {hasCustomReplacementCriteria && (
                                    <ReplacementCriteriaLabel
                                        criteria={savedProduct.replacementCriteria}
                                        className="mt-1"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-center 2xl:hidden visible absolute top-2 right-2">
                            <OptimisticToggleButton
                                itemId={product.id}
                                defaultState={product.isFavorite || false}
                                onToggle={handleToggleFavorite}
                                activeIcon={<FaRegHeart className="text-red-500" strokeWidth={3} size={16} />}
                                inactiveIcon={<FaRegHeart size={16} />}
                                tooltip="Agregar a favoritos"
                                className="w-8 h-8"
                            />
                            <OptimisticToggleButton
                                itemId={product.id}
                                onToggle={async (id) => {
                                    try {
                                        await addProductToBlackList(id);
                                    } catch (error) {
                                        console.error("Error adding to blacklist", error);
                                    }
                                }}
                                activeIcon={<TiThumbsDown size={20} />}
                                inactiveIcon={<TiThumbsDown size={20} />}
                                tooltip="Agregar a Lista Negra"
                                disabled={product.isFavorite}
                                className="w-8 h-8"
                            />

                        </div>
                    </div>
                </TableCell>

                <TableCell className="text-center whitespace-nowrap w-fit 2xl:w-auto">
                    {product.netContent}{" "}{product.measurementUnit}</TableCell>
                <TableCell className="text-center whitespace-nowrap w-fit ">{
                    product.netContent ? formatToArgentinianPesos(Number(product.price)) : 1}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap w-fit">{
                    product.netContent ? formatToArgentinianPesos(Number(product.pricePerBaseUnit)) : 1}
                </TableCell>
                <TableCell className="text-right">{
                    product.isPickUp && <PickUpIndicator />
                }</TableCell>
                <TableCell className='text-right w-20 '>
                    <div className="flex items-end gap-2 w-fit flex-col-reverse">
                        <ProductsPresentations
                            callback={() => toggleSheetOpen(null)}
                            productId={product.id}
                            title="Mas Presentaciones"
                            subTitle='Puedes seleccionar otras presentaciones del mismo producto'
                            morePresentations={product.morePresentations || false}
                            dropZoneId={dropZoneId}
                        />
                        <div className="flex items-center gap-1">
                            <QuantitySelector
                                defaultValue={savedProducts.find((item) => item.id === product.id)?.quantity}
                                onChange={(quantity: number) => onQuantityChange(product, quantity)}
                            />
                            {/* CHANGE DELIVERY DATE and REPLACEMENT CRITERIA */}
                            <ProductOptions
                                hasCustomDeliveryDate={!!hasCustomDeliveryDate}
                                hasCustomDeliveryReplacement={!!hasCustomReplacementCriteria}
                                savedProducts={savedProducts}
                                product={product}
                                setDeliveryDateDialogOpen={setDeliveryDateDialogOpen}
                                setDeliveryReplacementDialogOpen={setReplacementDialogOpen}
                            />

                        </div>
                    </div>
                </TableCell>
            </TableRow>

            <DeliveryDateDialog
                isOpen={deliveryDateDialogOpen}
                onClose={() => setDeliveryDateDialogOpen(false)}
                product={product}
                onDateChange={handleDeliveryDateChange}
                currentDeliveryDate={savedProduct?.deliveryDate}
                onRemoveDate={removeDeliveryDate}
            />
            <ReplacementDialog
                isOpen={replacementDialogOpen}
                onClose={() => setReplacementDialogOpen(false)}
                product={product}
                onChange={handleReplacementCriteriaChange}
                currentReplacement={savedProduct?.replacementCriteria}
                onRemoveReplacement={removeReplacementCriteria}
            />
        </>
    );
};

// Export as a memoized component with optimized comparison
export default memo(ProductRow, (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id &&
        prevProps.product.isFavorite === nextProps.product.isFavorite &&
        areSavedProductsEqual(prevProps.savedProducts, nextProps.savedProducts);
});