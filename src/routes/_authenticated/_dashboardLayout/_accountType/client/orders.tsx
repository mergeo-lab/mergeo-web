import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { List, PackageSearch, ClipboardList, X, ShoppingBag, FileCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductsSearch from '@/components/configuration/client/orders/tabs/productsSearch';
import ProductsList from '@/components/configuration/client/orders/tabs/productsList';
import { OrderConfig } from '@/components/configuration/client/orders/searchConfig/orderConfiguration';
import UseCompanyStore from '@/store/company.store';
import { PickUpSelectMap } from '@/components/configuration/client/orders/searchConfig/pickUpSelectMap';
import UseSearchConfigStore from '@/store/searchConfiguration.store.';
import ProductsTable from '@/components/configuration/client/orders/productsTable';
import { CartSheet } from '@/components/configuration/client/orders/cartSheet';
import UseSearchStore from '@/store/search.store';
import { motion } from "framer-motion";

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/orders')({
    component: OrdersPage,
})

const tabsTriggerClassName = 'transition-all duration-500 rounded w-52 data-[state=active]:multi-[bg-white;text-secondary;shadow-sm]';

enum TabsEnum {
    LISTA_DE_PRODUCTOS = 'Lista de Productos',
    BUSCAR_PRODUCTOS = 'Buscar'
}

function OrdersPage() {
    const [tab, setTab] = useState(TabsEnum.LISTA_DE_PRODUCTOS);
    const [menuOpen, setMenuStatus] = useState(true);
    const [cartOpen, setOpenCart] = useState(false);
    const [configCanceled, setcCnfigCanceled] = useState(false);
    const { company } = UseCompanyStore();
    const {
        pickUpDialog,
        setPickUpDialog,
        resetConfig,
        configDialogOpen,
        setConfigDialogOpen,
        configDataSubmitted,
        setConfigDataSubmitted,
        setShouldResetConfig,
        deliveryTime,
        branch,
        listId
    } = UseSearchConfigStore();
    const { getAllSavedProducts, reset } = UseSearchStore();
    const savedProducts = getAllSavedProducts();
    // const [configSubmitted, setConfigSubmitted] = useState(false);

    function onTabChange(value: string) {
        const selectedTab = value as TabsEnum;
        setTab(selectedTab)
    }

    function toggleMenu(tab?: TabsEnum) {
        if (tab) setTab(tab);
        setMenuStatus(!menuOpen);
    }

    useEffect(() => {
        return () => {
            reset();
            resetConfig();
            setShouldResetConfig(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset, resetConfig])

    const memoizedProductsTable = useMemo(() => (
        <ProductsTable configCanceled={!branch || !deliveryTime} />
    ), [branch, deliveryTime]); // Only re-render if these change

    return (
        <section className="h-full w-full flex">
            <div className={cn('w-[22rem] border-2 border-r-border transition-all ease-out', {
                'w-16': !menuOpen
            })}>
                <Tabs value={tab} className="w-full h-full rounded relative" onValueChange={onTabChange}>
                    <div className='w-full h-full flex flex-col'>
                        {menuOpen ?
                            <>
                                <TabsList className='rounded-t rounded-b-none w-full h-fit bg-accent px-4 gap-2'>
                                    <TabsTrigger className={tabsTriggerClassName} value={TabsEnum.LISTA_DE_PRODUCTOS}>Lista</TabsTrigger>
                                    <TabsTrigger className={tabsTriggerClassName} value={TabsEnum.BUSCAR_PRODUCTOS}>Buscar</TabsTrigger>
                                    <Button variant="ghost" size="sm" onClick={() => toggleMenu()}>
                                        <X />
                                    </Button>
                                </TabsList>
                                <TabsContent className='w-full overflow-x-hidden h-[calc(100%-50px)] m-0 ' value={TabsEnum.LISTA_DE_PRODUCTOS}>
                                    <ProductsList
                                        configCanceled={configCanceled}
                                        isVisible={configDataSubmitted}
                                        selectList={() => {
                                            setConfigDataSubmitted(false);
                                            setShouldResetConfig(false);
                                            setConfigDialogOpen(true)
                                        }}
                                    />
                                </TabsContent>
                                <TabsContent className='w-full overflow-x-hidden h-[calc(100%-50px)] m-0 p-4' value={TabsEnum.BUSCAR_PRODUCTOS}>
                                    <ProductsSearch />
                                </TabsContent>
                                <div className='w-full p-5 border-t-2 border-t-border flex flex-col gap-2'>
                                    <Button onClick={() => {
                                        setConfigDataSubmitted(false);
                                        // setShouldResetConfig(false);
                                        resetConfig();
                                        setConfigDialogOpen(true)
                                    }} variant='outline' className="w-full flex gap-2">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: menuOpen ? 1 : 0 }}
                                            transition={{ duration: 1 }}
                                        >
                                            Configuración
                                        </motion.div>
                                        <FileCog size={20} />
                                    </Button>

                                    <Button
                                        className='w-full flex gap-4 disabled:bg-muted/80'
                                        disabled={!savedProducts.length}
                                        onClick={() => setOpenCart(true)}>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: menuOpen ? 1 : 0 }}
                                            transition={{ duration: 1 }}
                                        >
                                            Ver Pedido
                                        </motion.div>
                                        <ShoppingBag size={20} />
                                    </Button>
                                </div>
                            </>
                            :
                            // HIDDEN MENU
                            <>
                                <TabsList className='rounded-t flex flex-col justify-start rounded-b-none w-full h-full bg-accent px-4 gap-4'>
                                    <Button variant="ghost" size="sm" onClick={() => toggleMenu()}>
                                        <List />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => toggleMenu(TabsEnum.LISTA_DE_PRODUCTOS)} className='flex flex-col'>
                                        <ClipboardList />
                                        Lista
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => toggleMenu(TabsEnum.BUSCAR_PRODUCTOS)} className='flex flex-col'>
                                        <PackageSearch />
                                        Buscar
                                    </Button>
                                </TabsList>
                                <div className='flex flex-col justify-center items-center border-t-2 border-t-border gap-2 p-5'>
                                    <Button onClick={() => {
                                        setConfigDataSubmitted(false);
                                        setShouldResetConfig(false);
                                        setConfigDialogOpen(true)
                                    }} variant='outline' className="p-0 px-3 overflow-hidden">
                                        <FileCog size={20} />
                                    </Button>
                                    <Button disabled={!savedProducts.length} className='p-0 px-3 disabled:bg-muted/80 overflow-hidden' onClick={() => setOpenCart(true)}>
                                        <ShoppingBag size={20} />
                                    </Button>
                                </div>
                            </>
                        }
                    </div>
                </Tabs >
            </div>

            {/* Products table */}
            <div className='w-full p-10'>
                {memoizedProductsTable}
            </div>

            <PickUpSelectMap showDialog={pickUpDialog} onClose={() => setPickUpDialog(false)} />

            <OrderConfig
                companyId={company?.id}
                callback={() => {
                    setTab(listId != "" ? TabsEnum.LISTA_DE_PRODUCTOS : TabsEnum.BUSCAR_PRODUCTOS);
                    setConfigDataSubmitted(true);
                    setConfigDialogOpen(false);
                }}
                onLoading={() => { }}
                openDialog={configDialogOpen}
                onCancel={() => {
                    setcCnfigCanceled(true);
                    setConfigDialogOpen(false)
                }}
            />

            <CartSheet
                callback={() => setOpenCart(false)}
                title="Resumen de su pedido"
                isOpen={cartOpen}
            />

        </section>
    )
}
