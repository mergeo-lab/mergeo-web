import { ProductsPresentations } from "@/components/configuration/client/orders/ProductsPresentations";
import QuantitySelector from "@/components/configuration/client/orders/quantitySelector";
import { OptimisticToggleButton } from "@/components/optimisticToggleButton";
import PickUpIndicator from "@/components/pickUpIndicator";
import { TableRow, TableCell } from "@/components/ui/table";
import { ProductSchemaType } from "@/lib/schemas";
import { formatToArgentinianPesos } from "@/lib/utils";
import UseMorePresentations from "@/store/productMorePresentations";
import { Heart, ImageIcon, ThumbsDown } from "lucide-react";
import { memo } from "react";


type Params = {
    product: ProductSchemaType,
    onQuantityChange: (product: ProductSchemaType, quantity: number) => void,
    savedProducts: ProductSchemaType[],
    handleToggleFavorite: (itemId: string, newState: boolean) => Promise<void>,
    addProductToBlackList: (productId: string) => Promise<void>,
}

// eslint-disable-next-line react-refresh/only-export-components
const ProductRow = ({ product, onQuantityChange, savedProducts, handleToggleFavorite, addProductToBlackList }: Params) => {
    // Remove memo from inner components and move them outside
    const { toggleSheetOpen } = UseMorePresentations();

    return (
        <TableRow>
            <TableCell className="p-0 m-0 ">
                <div className="flex justify-center flex-col gap-1">
                    <OptimisticToggleButton
                        itemId={product.id}
                        defaultState={product.isFavorite || false}
                        onToggle={handleToggleFavorite}
                        activeIcon={<Heart className="text-red-500" strokeWidth={3} size={16} />}
                        inactiveIcon={<Heart size={16} />}
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
                        activeIcon={<ThumbsDown strokeWidth={3} size={16} />}
                        inactiveIcon={<ThumbsDown size={16} />}
                        tooltip="Agregar a Lista Negra"
                        disabled={product.isFavorite}
                    />
                </div>
            </TableCell>
            <TableCell className="p-0 m-0 py-2">
                <div className="flex justify-start items-center w-full">

                    <div className="bg-border rounded p-4">
                        <ImageIcon size={50} className="text-white" />
                    </div>
                    <div className="flex flex-col ml-2">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-muted font-thin text-sm">{product.brand}</div>
                    </div>
                </div>
            </TableCell>

            <TableCell className={`text-center`}>{product.netContent}{" "}{product.measurementUnit}</TableCell>
            <TableCell className={`text-center`}>{formatToArgentinianPesos(+product.pricePerBaseUnit)}</TableCell>
            <TableCell className={`text-center`}>{
                product.netContent ? formatToArgentinianPesos(+product.price) : 1}
            </TableCell>
            <TableCell className={`text-right`}>{
                product.isPickUp && <PickUpIndicator />
            }</TableCell>
            <TableCell className={`text-right`}>
                <div className="flex justify-end items-center gap-2 w-full">


                    <ProductsPresentations
                        callback={() => toggleSheetOpen(null)}
                        productId={product.id}
                        title="Mas Presentaciones"
                        subTitle='Puedes seleccionar otras presentaciones del mismo producto'
                        morePresentations={product.morePresentations || false}
                    />

                    <div>
                        <QuantitySelector
                            defaultValue={savedProducts.find((item) => item.id === product.id)?.quantity}
                            onChange={(quantity: number) => onQuantityChange(product, quantity)}
                        />
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
};

// Export as a memoized component
// eslint-disable-next-line react-refresh/only-export-components
export default memo(ProductRow, (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id &&
        prevProps.product.isFavorite === nextProps.product.isFavorite &&
        JSON.stringify(prevProps.savedProducts) === JSON.stringify(nextProps.savedProducts);
});