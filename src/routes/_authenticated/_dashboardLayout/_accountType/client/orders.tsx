import { createFileRoute } from '@tanstack/react-router'
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { useCallback, useEffect, useState, memo, useMemo } from 'react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import UseSearchConfigStore from '@/store/searchConfiguration.store';
// import { CartSheet } from '@/components/configuration/client/orders/cartSheet';
// import UseSearchStore from '@/store/search.store';
// import { motion } from "framer-motion";
// import OrderConfig from '@/components/configuration/client/orders/searchConfig/orderConfiguration';
// import ProductsTable from '@/components/configuration/client/orders/productsTable';
// import ProductsList from '@/components/configuration/client/orders/tabs/productsList';
// import ProductsSearch from '@/components/configuration/client/orders/tabs/productsSearch';
// import PickUpSelectMap from '@/components/configuration/client/orders/searchConfig/pickUpSelectMap';
// import { LuClipboardList, LuFileCog, LuList, LuPackageSearch, LuShoppingBag } from 'react-icons/lu';
// import { RxCross2 } from 'react-icons/rx';
// import React from 'react';
// import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/orders')({
    component: OrdersPage,
})

// const tabsTriggerClassName = 'transition-all duration-500 rounded w-52 data-[state=active]:multi-[bg-white;text-secondary;shadow-sm]';

// enum TabsEnum {
//     LISTA_DE_PRODUCTOS = 'Lista de Productos',
//     BUSCAR_PRODUCTOS = 'Buscar'
// }

// // Memoized motion components
// const MotionConfig = memo(({ menuOpen, children }: { menuOpen: boolean; children: React.ReactNode }) => (
//     <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: menuOpen ? 1 : 0 }}
//         transition={{ duration: 1 }}
//     >
//         {children}
//     </motion.div>
// ));

// // Memoized button components
// const ConfigButton = memo(({ onClick, menuOpen }: { onClick: () => void; menuOpen: boolean }) => (
//     <Button onClick={onClick} variant='outline' className="w-full flex gap-2">
//         <MotionConfig menuOpen={menuOpen}>
//             Configuración
//         </MotionConfig>
//         <LuFileCog size={20} />
//     </Button>
// ));

// const CartButton = memo(({ onClick, menuOpen, disabled }: { onClick: () => void; menuOpen: boolean; disabled: boolean }) => (
//     <Button
//         className='w-full flex gap-4 disabled:bg-muted/80'
//         disabled={disabled}
//         onClick={onClick}
//     >
//         <MotionConfig menuOpen={menuOpen}>
//             Ver Pedido
//         </MotionConfig>
//         <LuShoppingBag size={20} />
//     </Button>
// ));

// // Global error boundary for debugging
// class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: unknown }> {
//     constructor(props: { children: React.ReactNode }) {
//         super(props);
//         this.state = { hasError: false, error: null };
//     }
//     static getDerivedStateFromError(error: unknown) {
//         return { hasError: true, error };
//     }
//     componentDidCatch(error: unknown, info: unknown) {
//         console.error('GlobalErrorBoundary caught:', error, info);
//     }
//     render() {
//         if (this.state.hasError) {
//             return <div style={{ color: 'red', padding: 40 }}>
//                 <h2>Global error: {String(this.state.error)}</h2>
//                 <pre>{(this.state.error as Error)?.stack || ''}</pre>
//             </div>;
//         }
//         return this.props.children;
//     }
// }

function OrdersPage() {
    // All code commented out for isolation testing
    // Uncomment imports and code one by one to isolate the error
    return <div>OrdersPage</div>;
}
