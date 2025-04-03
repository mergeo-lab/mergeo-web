import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatToArgentinianPesos } from '@/lib/utils';
import { Image, } from 'lucide-react';
import { RiFileWarningFill } from "react-icons/ri";
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
    image?: string;
    inInventory?: boolean;
    actualPrice: string;
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
    image,
    inInventory,
    actualPrice,
    onSave,
    onRemove,
}: Props) => {
    const [localPrice, setLocalPrice] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        setShow(true);
        setLocalPrice("");
        console.log("netContent :: ", netContent);
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
                        <div className="w-20 h-20 border border-border p-2 rounded overflow-hidden">
                            {image && image != null
                                ? <img src={image} alt={name} className='cover w-16 h-16 rounded' />
                                : <div className="w-full h-full flex justify-center items-center bg-border">
                                    <Image className='text-muted' size={35} />
                                </div>
                            }
                        </div>
                        <div>
                            <div className='flex gap-2'>
                                <p className={cn({ 'text-highlight text-base': inInventory })}>{name}</p>
                            </div>
                            <p className="text-sm text-muted">{brand}</p>
                            {inInventory && actualPrice &&
                                <div className='text-sm text-muted flex gap-3'>
                                    <p className='text-nowrap'>Precio actual</p>
                                    {formatToArgentinianPesos(+actualPrice)}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                    <div className="bg-secondary-background rounded text-white font-bold h-8 w-fit p-4 flex justify-center items-center text-nowrap">
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
                    <div className='flex items-center gap-1'>
                        <Input
                            type="number"
                            value={localPrice}
                            placeholder={actualPrice ? "Cambiar precio" : "Agregar precio"}
                            onChange={(e) => setLocalPrice(e.target.value)}
                            className=" pr-8"
                        />
                        {
                            inInventory && <p className="text-sm text-muted font-black">
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <RiFileWarningFill size={30} className='text-highlight cursor-pointer' />
                                    </HoverCardTrigger>
                                    <HoverCardContent className='font-thin'>
                                        Ya tienes este producto en tu inventario, si guaras el producto con un precio diferente, se actualizara!
                                    </HoverCardContent>
                                </HoverCard>
                            </p>
                        }
                    </div>
                    <span className={cn("absolute top-[50%] -translate-y-[50%] right-11", {
                        'right-4': !inInventory,
                    })}>$</span>
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
