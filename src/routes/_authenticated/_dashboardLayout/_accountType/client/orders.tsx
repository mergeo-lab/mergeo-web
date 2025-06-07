import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCallback, useEffect, useState, memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UseSearchConfigStore from '@/store/searchConfiguration.store.';
import { CartSheet } from '@/components/configuration/client/orders/cartSheet';
import UseSearchStore from '@/store/search.store';
import { motion } from "framer-motion";
// import OrderConfig from '@/components/configuration/client/orders/searchConfig/orderConfiguration';
import ProductsTable from '@/components/configuration/client/orders/productsTable';
import ProductsList from '@/components/configuration/client/orders/tabs/productsList';
import ProductsSearch from '@/components/configuration/client/orders/tabs/productsSearch';
import PickUpSelectMap from '@/components/configuration/client/orders/searchConfig/pickUpSelectMap';
import { LuClipboardList, LuFileCog, LuList, LuPackageSearch, LuShoppingBag } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
// import { useAuth } from '@/context/AuthContext';
import React from 'react';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/orders')({
    component: OrdersPage,
})

const tabsTriggerClassName = 'transition-all duration-500 rounded w-52 data-[state=active]:multi-[bg-white;text-secondary;shadow-sm]';

enum TabsEnum {
    LISTA_DE_PRODUCTOS = 'Lista de Productos',
    BUSCAR_PRODUCTOS = 'Buscar'
}

// Memoized motion components
const MotionConfig = memo(({ menuOpen, children }: { menuOpen: boolean; children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 1 }}
    >
        {children}
    </motion.div>
));

// Memoized button components
const ConfigButton = memo(({ onClick, menuOpen }: { onClick: () => void; menuOpen: boolean }) => (
    <Button onClick={onClick} variant='outline' className="w-full flex gap-2">
        <MotionConfig menuOpen={menuOpen}>
            Configuración
        </MotionConfig>
        <LuFileCog size={20} />
    </Button>
));

const CartButton = memo(({ onClick, menuOpen, disabled }: { onClick: () => void; menuOpen: boolean; disabled: boolean }) => (
    <Button
        className='w-full flex gap-4 disabled:bg-muted/80'
        disabled={disabled}
        onClick={onClick}
    >
        <MotionConfig menuOpen={menuOpen}>
            Ver Pedido
        </MotionConfig>
        <LuShoppingBag size={20} />
    </Button>
));

// Global error boundary for debugging
class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: unknown }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: unknown) {
        return { hasError: true, error };
    }
    componentDidCatch(error: unknown, info: unknown) {
        console.error('GlobalErrorBoundary caught:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return <div style={{ color: 'red', padding: 40 }}>
                <h2>Global error: {String(this.state.error)}</h2>
                <pre>{(this.state.error as Error)?.stack || ''}</pre>
            </div>;
        }
        return this.props.children;
    }
}

function OrdersPage() {
    const [tab, setTab] = useState(TabsEnum.LISTA_DE_PRODUCTOS);
    const [menuOpen, setMenuStatus] = useState(true);
    const [cartOpen, setOpenCart] = useState(false);
    // const [configCanceled, setConfigCanceled] = useState(false);
    // const { account } = useAuth();
    // const companyId = account?.company.id || '';

    const {
        pickUpDialog,
        setPickUpDialog,
        resetConfig,
        // configDialogOpen,
        setConfigDialogOpen,
        configDataSubmitted,
        setConfigDataSubmitted,
        setShouldResetConfig,
        deliveryTime,
        branch,
    } = UseSearchConfigStore();
    const reset = UseSearchStore(state => state.reset);
    const savedProducts = UseSearchStore(state => state.getAllSavedProducts());

    // Memoized handlers
    const onTabChange = useCallback((value: string) => {
        const selectedTab = value as TabsEnum;
        setTab(selectedTab);
    }, []);

    const toggleMenu = useCallback((tab?: TabsEnum) => {
        if (tab) setTab(tab);
        setMenuStatus(prev => !prev);
    }, []);

    const handleConfigOpen = useCallback(() => {
        setConfigDataSubmitted(false);
        setShouldResetConfig(false);
        setConfigDialogOpen(true);
    }, [setConfigDataSubmitted, setShouldResetConfig, setConfigDialogOpen]);

    // const handleConfigCancel = useCallback(() => {
    //     setConfigCanceled(true);
    //     setConfigDialogOpen(false);
    // }, [setConfigDialogOpen]);

    // const handleConfigCallback = useCallback((listId: string) => {
    //     setTab(listId ? TabsEnum.LISTA_DE_PRODUCTOS : TabsEnum.BUSCAR_PRODUCTOS);
    //     setConfigDataSubmitted(true);
    //     setConfigDialogOpen(false);
    // }, [setConfigDataSubmitted, setConfigDialogOpen]);

    const handleCartOpen = useCallback(() => setOpenCart(true), []);
    const handleCartClose = useCallback(() => setOpenCart(false), []);
    const handlePickUpDialogClose = useCallback(() => setPickUpDialog(false), [setPickUpDialog]);

    // Memoized values
    const isConfigCanceled = useMemo(() => !branch || !deliveryTime, [branch, deliveryTime]);
    const hasSavedProducts = useMemo(() => savedProducts.length > 0, [savedProducts]);

    // Initialize pickUpDialog as false when component mounts
    useEffect(() => {
        setPickUpDialog(false);
    }, [setPickUpDialog]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            reset();
            resetConfig();
            setShouldResetConfig(true);
        }
    }, [reset, resetConfig, setShouldResetConfig]);

    // Memoized menu content
    const menuContent = useMemo(() => (
        <>
            <TabsList className='rounded-t rounded-b-none w-full h-fit bg-accent px-4 gap-2'>
                <TabsTrigger className={tabsTriggerClassName} value={TabsEnum.LISTA_DE_PRODUCTOS}>Lista</TabsTrigger>
                <TabsTrigger className={tabsTriggerClassName} value={TabsEnum.BUSCAR_PRODUCTOS}>Buscar</TabsTrigger>
                <Button variant="ghost" size="sm" onClick={() => toggleMenu()}>
                    <RxCross2 size={20} />
                </Button>
            </TabsList>
            <TabsContent className='w-full overflow-x-hidden h-[calc(100%-50px)] m-0 ' value={TabsEnum.LISTA_DE_PRODUCTOS}>
                <ProductsList
                    configCanceled={false}
                    isVisible={configDataSubmitted}
                    selectList={handleConfigOpen}
                />
            </TabsContent>
            <TabsContent className='w-full overflow-x-hidden h-[calc(100%-50px)] m-0 p-4' value={TabsEnum.BUSCAR_PRODUCTOS}>
                <ProductsSearch />
            </TabsContent>
            <div className='w-full p-5 border-t-2 border-t-border flex flex-col gap-2'>
                <ConfigButton onClick={handleConfigOpen} menuOpen={menuOpen} />
                <CartButton onClick={handleCartOpen} menuOpen={menuOpen} disabled={!hasSavedProducts} />
            </div>
        </>
    ), [menuOpen, configDataSubmitted, hasSavedProducts, handleConfigOpen, handleCartOpen, toggleMenu]);

    // Memoized hidden menu content
    const hiddenMenuContent = useMemo(() => (
        <>
            <TabsList className='rounded-t flex flex-col justify-start rounded-b-none w-full h-full bg-accent px-4 gap-4'>
                <Button variant="ghost" size="sm" onClick={() => toggleMenu()}>
                    <LuList size={20} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleMenu(TabsEnum.LISTA_DE_PRODUCTOS)} className='flex flex-col'>
                    <LuClipboardList size={20} />
                    Lista
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleMenu(TabsEnum.BUSCAR_PRODUCTOS)} className='flex flex-col'>
                    <LuPackageSearch size={20} />
                    Buscar
                </Button>
            </TabsList>
            <div className='flex flex-col justify-center items-center border-t-2 border-t-border gap-2 p-5'>
                <Button onClick={handleConfigOpen} variant='outline' className="p-0 px-3 overflow-hidden">
                    <LuFileCog size={20} />
                </Button>
                <Button disabled={!hasSavedProducts} className='p-0 px-3 disabled:bg-muted/80 overflow-hidden' onClick={handleCartOpen}>
                    <LuShoppingBag size={20} />
                </Button>
            </div>
        </>
    ), [hasSavedProducts, handleConfigOpen, handleCartOpen, toggleMenu]);

    return (
        <GlobalErrorBoundary>
            <section className="h-full w-full flex">
                <div className={cn('w-[22rem] border-2 border-r-border transition-all ease-out', {
                    'w-16': !menuOpen
                })}>
                    <Tabs value={tab} className="w-full h-full rounded relative" onValueChange={onTabChange}>
                        <div className='w-full h-full flex flex-col'>
                            {menuOpen ? menuContent : hiddenMenuContent}
                        </div>
                    </Tabs>
                </div>

                {/* Products table */}
                <div className='w-full p-10'>
                    <ProductsTable configCanceled={isConfigCanceled} />
                </div>

                <PickUpSelectMap showDialog={pickUpDialog} onClose={handlePickUpDialogClose} />

                {/* <OrderConfig
                    companyId={companyId}
                    callback={handleConfigCallback}
                    openDialog={configDialogOpen}
                    onCancel={handleConfigCancel}
                /> */}

                <CartSheet
                    callback={handleCartClose}
                    title="Resumen de su pedido"
                    isOpen={cartOpen}
                />
            </section>
        </GlobalErrorBoundary>
    )
}
