import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { List, PackageSearch, ClipboardList, X, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductsSearch from '@/components/orders/tabs/productsSearch';
import ProductsList from '@/components/orders/tabs/productsList';
import { OrderConfig } from '@/components/orders/orderConfiguration';
import UseCompanyStore from '@/store/company.store';
import { PickUpSelectMap } from '@/components/orders/pickUpSelectMap';
import UseSearchConfigStore from '@/store/searchConfiguration.store.';


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
    const [configDataSubmitted, setConfigDataSubmitted] = useState(false);
    const { company } = UseCompanyStore();
    const { pickUp } = UseSearchConfigStore();

    useEffect(() => {
        console.log("ACA")
    }, [])

    function onTabChange(value: string) {
        const selectedTab = value as TabsEnum;
        console.log(selectedTab)
        setTab(selectedTab)
    }

    function toggleMenu(tab?: TabsEnum) {
        if (tab) setTab(tab);
        setMenuStatus(!menuOpen);
    }

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
                                    <ProductsList isVisible={configDataSubmitted} />
                                </TabsContent>
                                <TabsContent className='w-full overflow-x-hidden h-[calc(100%-50px)] m-0 p-4' value={TabsEnum.BUSCAR_PRODUCTOS}>
                                    <ProductsSearch />
                                </TabsContent>
                                <div className='w-full h-20 p-5 border-t-2 border-t-border'>
                                    <Button className='w-full h-full flex gap-4' onClick={() => console.log('ver pedido!')}>
                                        Ver Pedido
                                        <ShoppingBag size={20} />
                                    </Button>
                                </div>
                            </>
                            :
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
                                <div className='flex justify-center items-center h-20 border-t-2 border-t-border'>
                                    <Button className='p-0 px-3' onClick={() => console.log('ver pedido!')}>
                                        <ShoppingBag size={20} />
                                    </Button>
                                </div>
                            </>
                        }
                    </div>
                </Tabs >
            </div>
            <div className='w-full p-10'>
                <div className='w-full h-10 bg-blue-200'>
                </div>
            </div>

            <PickUpSelectMap showDialog={!!pickUp} onClose={() => { }} point={[]} />

            <OrderConfig
                companyId={company?.id}
                callback={() => setConfigDataSubmitted(true)}
                onLoading={() => { }}
            />

        </section>
    )
}
