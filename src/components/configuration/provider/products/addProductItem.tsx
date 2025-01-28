import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatToArgentinianPesos } from '@/lib/utils';
import { MessageCircleWarning } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type Props = {
    className?: string;
    gtin: string; // Unique identifier
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
    gtin,
    name,
    brand,
    netContent,
    measurmentUnit,
    finalPrice,
    inInventory,
    onSave,
    onRemove,
}: Props) => {
    const [localPrice, setLocalPrice] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        setShow(true);
        setLocalPrice("");
    }, [])

    function handleSave(newPrice: string) {
        if (newPrice != "" && +newPrice > 0) {
            onSave && onSave(gtin, newPrice);
        }
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


                {(onSave) && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-32"
                        onClick={() => handleSave(localPrice)}
                        disabled={localPrice == ""}
                    >
                        Agregar
                    </Button>
                )}

            </div>
        </div >
    );
};
