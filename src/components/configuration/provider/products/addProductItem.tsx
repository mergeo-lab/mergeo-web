import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatToArgentinianPesos } from '@/lib/utils';
import { MessageCircleWarning } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type Props = {
    className: string;
    id: string; // Unique identifier
    name: string;
    brand: string;
    netContent: number;
    measurmentUnit: string;
    price?: string;
    finalPrice?: string;
    inInventory?: boolean;
    onSave?: (id: string, price: string) => void;
    onRemove?: (id: string) => void;
};

export const AddProductItem = ({
    className,
    id,
    name,
    brand,
    netContent,
    measurmentUnit,
    price,
    finalPrice,
    inInventory,
    onSave,
    onRemove,
}: Props) => {
    const [hasPrice, setHasPrice] = useState<boolean>(price ? true : false);
    const [localPrice, setLocalPrice] = useState<string>(price || "");
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        setShow(true)
        console.log("PRICE ::: ", finalPrice)
    }, [])

    function handleSave(newPrice: string) {
        if (newPrice != "" && +newPrice > 0) {
            setHasPrice(true);
            onSave && onSave(id, newPrice);
        }
    }

    function handleRemove() {
        setHasPrice(false);
        setLocalPrice("") // Clear the input
        onRemove && onRemove(id); // Notify the parent to remove the item
    }

    return (
        <div className={cn("flex flex-col bg-white p-5 rounded w-full transition-all ease-out duration-1000 opacity-0", className, {
            "opacity-100": show
        })}>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-border rounded overflow-hidden"></div>
                        <div>
                            <div className='flex gap-2'>
                                <p className={cn({ 'text-highlight': inInventory })}>{name}</p>
                                {
                                    inInventory && <p className="text-sm text-muted font-black">
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <MessageCircleWarning className='text-highlight -mt-1 cursor-pointer' />
                                            </HoverCardTrigger>
                                            <HoverCardContent className='font-thin'>
                                                Ya tienes este producto en tu inventario, si guaras el producto con un precio diferente, se actualizara!
                                            </HoverCardContent>
                                        </HoverCard>
                                    </p>
                                }
                            </div>
                            <p className="text-sm text-muted">{brand}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                    <div className="bg-secondary-background rounded text-white font-bold h-8 w-fit p-4 flex justify-center items-center">
                        {netContent} {measurmentUnit}
                    </div>
                    {finalPrice &&
                        <div className='space-x-2 flex [&>span]:multi-[font-bold;text-info;]'>
                            <p>Precio</p>
                            <span>
                                {formatToArgentinianPesos(+finalPrice)}
                            </span>
                        </div>}
                </div>
            </div>
            <div className={cn("flex gap-2 mt-5 w-full justify-between", {
                'items-end': onRemove && !onSave,
                "hidden": finalPrice
            })}>
                {onRemove && !onSave &&
                    <Button
                        variant="link"
                        size="sm"
                        className="w-32 text-destructive h-fit"
                        onClick={() => handleRemove()}>
                        Remover de la lista
                    </Button>
                }
                {hasPrice ? (
                    <div className={cn("text-sm text-muted flex gap-2", {
                        'flex-col gap-0': onSave && onRemove
                    })}>
                        <span>Precio guardado:</span>
                        <span className='font-bold text-info'>{formatToArgentinianPesos(+localPrice)}</span>
                    </div>
                ) :
                    <div className="relative">
                        <Input
                            type="number"
                            value={localPrice}
                            placeholder="Agregar precio"
                            onChange={(e) => setLocalPrice(e.target.value)}
                            className=" pr-8"
                        />
                        <span className="absolute top-[50%] -translate-y-[50%] right-4">$</span>
                    </div>
                }

                {(onSave && onRemove) && (
                    hasPrice ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-32"
                            onClick={handleRemove}
                        >
                            Eliminar
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-32"
                            onClick={() => handleSave(localPrice)}
                            disabled={localPrice == ""}
                        >
                            Agregar
                        </Button>
                    )
                )}

            </div>
        </div >
    );
};
