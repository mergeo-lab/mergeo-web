import { Button } from '@/components/ui/button';
import UseSearchStore from '@/store/search.store';
import { useMemo } from 'react';
import { LuShoppingBag } from 'react-icons/lu';

interface CartButtonProps {
    onClick: () => void;
    className?: string;
    menuOpen?: boolean;
}

export default function CartButton({ onClick, className = '', menuOpen }: CartButtonProps) {
    const savedProductsObj = UseSearchStore(state => state.savedProducts);
    const savedProducts = useMemo(() => Object.values(savedProductsObj).flat(), [savedProductsObj]);

    if (menuOpen) {
        return (
            <Button
                className={`w-full flex justify-center items-center gap-2 disabled:bg-muted/80 ${className}`}
                disabled={savedProducts.length <= 0}
                onClick={onClick}
            >
                <div>Ver Pedido</div>
                <LuShoppingBag size={20} className='text-white' />
            </Button>
        )
    }

    return (
        <Button
            className={`w-11 m-0 p-0 disabled:bg-muted/80 ${className}`}
            disabled={savedProducts.length <= 0}
            onClick={onClick}
        >
            <LuShoppingBag size={20} className='text-white' />
        </Button>
    );
}