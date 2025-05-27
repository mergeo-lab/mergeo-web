import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductSchemaType } from "@/lib/schemas"
import { cn, formatToArgentinianPesos } from "@/lib/utils"
import { useCallback } from "react";
import { LuTrash2 } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

type Props = {
    className?: string,
    product: ProductSchemaType,
    discountPercent: number,
    isAdded?: boolean,
    isSearch?: boolean,
    onAdd?: (id: string) => void,
    onRemove: (id: string) => void,
}
export default function DiscountProductRow({ className, discountPercent = 0, isAdded = false, isSearch = false, product, onAdd, onRemove }: Props) {
    const itemDiscount = useCallback(() => {
        return +product.price - (discountPercent * +product.price / 100);
    }, [product.price, discountPercent]);

    return (
        <div className={cn("w-full pr-6 py-2 border-b-[1px] border-border flex justify-between items-center gap-10 text-sm", className)}>
            <div className="flex gap-10 items-start">
                <div className="flex flex-col w-36" title={`${product.name} ${product.brand}`}>
                    <span className="w-full truncate">
                        {product.name}
                    </span>
                    <span className="text-[0.688rem] text-info/80">
                        {product.brand}
                    </span>
                </div>
                <span className="w-32 line-clamp-3 text-[0.7rem]">{product.variety || "-"}</span>
                <span className="w-16 truncate">{product.netContent + " " + product.measurementUnit}</span>
                <div className="flex flex-col w-30">
                    <span className="text-black/80 font-thin">Precio original</span>
                    <span className="w-24">{formatToArgentinianPesos(+product.price)}</span>
                </div>
                <div className="flex flex-col w-fit">
                    <span className="text-black/80 font-thin text-nowrap">Precio con descuento</span>
                    <span className="text-green-800">{formatToArgentinianPesos(itemDiscount())}</span>
                </div>
            </div>
            {isSearch
                ? <Checkbox
                    checked={!isAdded}
                    onClick={() => {
                        if (isAdded) {
                            onRemove(product.id);
                        } else {
                            onAdd?.(product.id);
                        }
                    }} />
                : <Button variant="ghost" className="hover:text-destructive" onClick={() => onRemove(product.id)}>
                    <LuTrash2 size={18} />
                </Button>
            }
        </div >
    )
}