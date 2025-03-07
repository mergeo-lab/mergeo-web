import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import debounce from 'lodash/debounce';

type Props = {
    defaultValue?: number
    onChange: (quantity: number) => void
}

export default memo(function QuantitySelector({ defaultValue, onChange }: Props) {
    const [quantity, setQuantity] = useState(defaultValue || 0);
    const [inputQuantity, setInputQuantity] = useState(defaultValue || 0);
    const [showControls, setShowControls] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce the onChange callback
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnChange = useCallback(
        debounce((value: number) => {
            onChange(value);
        }, 100),
        [onChange]
    );

    const handleQuantityChange = useCallback((add: boolean = true) => {
        const newQuantity = add ? quantity + 1 : quantity - 1;
        setQuantity(newQuantity);
        setInputQuantity(newQuantity);
        debouncedOnChange(newQuantity);
    }, [quantity, debouncedOnChange]);

    const changeOnInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newQuantity = parseInt(e.target.value);
        if (isNaN(newQuantity)) {
            newQuantity = 0;
        }
        setInputQuantity(newQuantity);
    }, []);

    const handleBlur = useCallback(() => {
        setQuantity(inputQuantity);
        debouncedOnChange(inputQuantity);
    }, [inputQuantity, debouncedOnChange]);

    useEffect(() => {
        if (inputRef.current && quantity === 0) {
            inputRef.current.focus();
        }
    }, [quantity]);

    useEffect(() => {
        setQuantity(defaultValue || 0);
        setInputQuantity(defaultValue || 0);
    }, [defaultValue]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedOnChange.cancel();
        };
    }, [debouncedOnChange]);

    if (quantity >= 1) {
        return (
            <div
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
                className="flex w-fit h-fit rounded border border-border justify-between items-center"
            >
                <Button
                    className={cn('transition-opacity duration-300 ease-out opacity-1 zIndex-20', { 'opacity-0': !showControls })}
                    variant='ghost'
                    onClick={() => handleQuantityChange(false)}
                    size='xs'>
                    <Minus size={10} />
                </Button>
                <Input
                    ref={inputRef}
                    onBlur={handleBlur}
                    onChange={changeOnInput}
                    value={inputQuantity}
                    className="border-none h-6 p-0 w-10 text-center zIndex-10"
                />
                <Button
                    className={cn('transition-opacity duration-300 ease-out opacity-1 zIndex-20', { 'opacity-0': !showControls })}
                    variant='ghost'
                    onClick={() => handleQuantityChange(true)}
                    size='xs'>
                    <Plus size={10} />
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={() => handleQuantityChange(true)} size='xs'>Agregar</Button>
    );
});