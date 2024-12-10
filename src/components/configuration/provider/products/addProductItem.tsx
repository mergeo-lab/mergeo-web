import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    id: string; // Unique identifier
    name: string;
    brand: string;
    netContent: number;
    measurmentUnit: string;
    price?: number;
    onSave: (id: string, price: number) => void;
    onRemove: (id: string) => void;
};

export const AddProductItem = ({ id, name, brand, netContent, measurmentUnit, price, onSave, onRemove }: Props) => {
    const [localPrice, setLocalPrice] = useState<number | ''>(price || '');

    useEffect(() => {
        if (price !== undefined) {
            setLocalPrice(price);
        }
    }, [price]);

    const handleSave = () => {
        if (localPrice && localPrice > 0) {
            onSave(id, localPrice); // Call the onSave function passed from the parent
        }
    };

    const handleRemove = () => {
        onRemove(id); // Call the onRemove function passed from the parent
        setLocalPrice(''); // Clear the input
    };

    return (
        <div className="flex flex-col bg-white p-5 rounded w-full">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-border rounded overflow-hidden"></div>
                        <div>
                            <p>{name}</p>
                            <p className="text-sm text-muted">{brand}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                    <div className="bg-secondary-background rounded text-white font-bold h-8 w-fit p-4 flex justify-center items-center">
                        {netContent} {measurmentUnit}
                    </div>
                    {price !== undefined && (
                        <div className="text-sm text-muted">Precio guardado: ${price}</div>
                    )}
                </div>
            </div>
            <div className="flex gap-2 mt-5 w-full items-center justify-end">
                <div className="relative w-full">
                    <Input
                        type="number"
                        value={localPrice}
                        placeholder="Agregar precio"
                        onChange={(e) => setLocalPrice(Number(e.target.value))}
                        className="w-full pr-8"
                    />
                    <span className="absolute top-[50%] -translate-y-[50%] right-4">$</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="px-10"
                    onClick={handleSave}
                    disabled={!localPrice || localPrice <= 0}
                >
                    {price && localPrice ? 'Actualizar' : 'Agregar'}
                </Button>
                {price && localPrice && (
                    <Button variant="destructive" size="sm" onClick={handleRemove}>
                        Eliminar
                    </Button>
                )}
            </div>
        </div>
    );
};
