import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type Props = {
    onChange: (quantity: number) => void
}

export default function QuantitySelector({ onChange }: Props) {
    const [quantity, setQuantity] = useState(0);
    const [showControls, setShowControls] = useState(false);

    function handleQuantityChange(add: boolean = true) {
        const newQuantity = add ? quantity + 1 : quantity - 1;
        setQuantity(newQuantity);
        onChange(newQuantity);
    }

    if (quantity >= 1) {
        return (
            <div onMouseOver={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
                className="flex w-fit h-fit rounded border border-border justify-between items-center"
            >
                <Button
                    className={cn('transition-opacity duration-300 ease-out opacity-1', { 'opacity-0': !showControls })}
                    variant='ghost'
                    onClick={() => handleQuantityChange(false)}
                    size='xs'>
                    <Minus size={10} />
                </Button>
                <Input
                    onChange={(e) => e.target.value === '' ? setQuantity(0) : setQuantity(parseInt(e.target.value))}
                    value={quantity}
                    className="border-none h-6 p-0 w-10 text-center"
                />
                <Button
                    className={cn('transition-opacity duration-300 ease-out opacity-1', { 'opacity-0': !showControls })}
                    variant='ghost'
                    onClick={() => handleQuantityChange(true)}
                    size='xs'>
                    <Plus size={10} />
                </Button>
            </div>
        )
    }
    return (
        <Button onClick={handleQuantityChange} size='xs'>Agregar</Button>
    )
}