import { Button } from '@/components/ui/button';
import UseSearchStore from '@/store/search.store';
import { useMemo } from 'react';
import { LuShoppingBag } from 'react-icons/lu';
import { motion } from 'framer-motion';

interface CartButtonProps {
    onClick: () => void;
    className?: string;
    menuOpen?: boolean;
}

export default function CartButton({ onClick, className = '', menuOpen }: CartButtonProps) {
    const savedProductsObj = UseSearchStore(state => state.savedProducts);
    const savedProducts = useMemo(() => Object.values(savedProductsObj).flat(), [savedProductsObj]);

    return (
        <Button
            className={`w-full flex gap-4 disabled:bg-muted/80 ${className}`}
            disabled={savedProducts.length <= 0}
            onClick={onClick}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: menuOpen ? 1 : 0 }}
                transition={{ duration: 1 }}
            >
                Ver Pedido
            </motion.div>
            <LuShoppingBag size={20} />
        </Button>
    );
}