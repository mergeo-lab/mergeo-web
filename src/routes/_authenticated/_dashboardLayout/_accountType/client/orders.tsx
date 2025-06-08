import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UseSearchConfigStore from '@/store/searchConfiguration.store';
import { CartSheet } from '@/components/configuration/client/orders/cartSheet';
import UseSearchStore from '@/store/search.store';
import { motion } from "framer-motion";
import OrderConfig from '@/components/configuration/client/orders/searchConfig/orderConfiguration';
import ProductsTable from '@/components/configuration/client/orders/productsTable';
import ProductsList from '@/components/configuration/client/orders/tabs/productsList';
import ProductsSearch from '@/components/configuration/client/orders/tabs/productsSearch';
import PickUpSelectMap from '@/components/configuration/client/orders/searchConfig/pickUpSelectMap';
import { LuClipboardList, LuFileCog, LuList, LuPackageSearch, LuShoppingBag } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import { useAuth } from '@/context/AuthContext';

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
    const { account } = useAuth();
    const companyId = account?.company.id || '';

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
    } = UseSearchConfigStore();
    const { getAllSavedProducts, reset } = UseSearchStore();
    const savedProducts = getAllSavedProducts();
    // const [configSubmitted, setConfigSubmitted] = useState(false);

    // Initialize pickUpDialog as false when component mounts
    useEffect(() => {
        setPickUpDialog(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                        <RxCross2 size={20} />
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
                                        setConfigDialogOpen(true)
                                    }} variant='outline' className="w-full flex gap-2">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: menuOpen ? 1 : 0 }}
                                            transition={{ duration: 1 }}
                                        >
                                            Configuración
                                        </motion.div>
                                        <LuFileCog size={20} />
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
                                        <LuShoppingBag size={20} />
                                    </Button>
                                </div>
                            </>
                            :
                            // HIDDEN MENU
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
                                    <Button onClick={() => {
                                        setConfigDataSubmitted(false);
                                        setShouldResetConfig(false);
                                        setConfigDialogOpen(true)
                                    }} variant='outline' className="p-0 px-3 overflow-hidden">
                                        <LuFileCog size={20} />
                                    </Button>
                                    <Button disabled={!savedProducts.length} className='p-0 px-3 disabled:bg-muted/80 overflow-hidden' onClick={() => setOpenCart(true)}>
                                        <LuShoppingBag size={20} />
                                    </Button>
                                </div>
                            </>
                        }
                    </div>
                </Tabs >
            </div>

            {/* Products table */}
            <div className='w-full p-10'>
                <ProductsTable configCanceled={!branch || !deliveryTime} />
            </div>

            <PickUpSelectMap showDialog={pickUpDialog} onClose={() => setPickUpDialog(false)} />

            <OrderConfig
                companyId={companyId}
                callback={(listId: string) => {
                    setTab(listId ? TabsEnum.LISTA_DE_PRODUCTOS : TabsEnum.BUSCAR_PRODUCTOS);
                    setConfigDataSubmitted(true);
                    setConfigDialogOpen(false);
                }}
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
