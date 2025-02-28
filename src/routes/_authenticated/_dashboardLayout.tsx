import React, { memo, useCallback, useEffect, useState } from 'react';
import { DashboardHeader, SideBarMenu } from '@/components/dashboard';
import UseCompanyStore from '@/store/company.store';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { Bell, CircleHelp, Settings, ScrollText, Package, Archive, WalletCards, FileSearch, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UseProviderInventoryPaginationState from '@/store/providerInventoryPagination.store';

export const Route = createFileRoute('/_authenticated/_dashboardLayout')({
    component: () => <DashboardLayout />,
});

const iconProps = {
    size: 30,
    className: 'text-primary'
};

function SubLink({ to, texts, search }: { to: string, texts: string[], search?: Record<string, unknown> }) {
    const { navigate } = useRouter()
    return (
        <p>
            <Button variant='link' onClick={() => navigate({ to: to, search: search })} className='text-md hover:no-underline leading-0 py-0 px-2 '>
                <span className='border-b-[1px] border-secondary/60 hover:multi-[border-primary;text-primary]'>{texts[0]}</span>
            </Button>{' '}
            <span className='text-base border-l-2 border-muted pl-2 font-light'>{texts[1]}</span>
        </p>
    )
}

const getRoutTitles = (currentPage: number) => {
    console.log("CURRENT PAGE :: ", currentPage)
    const titles: Record<string, { text: string | JSX.Element; icon: JSX.Element }> = {
        '/': { text: 'Dashboard', icon: <ScrollText {...iconProps} /> },
        '/searchLists': { text: 'Mis Listas', icon: <ScrollText {...iconProps} /> },
        '/configuration': { text: 'Configuración de cuenta', icon: <Settings {...iconProps} /> },
        '/notifications': { text: 'Notificaciones', icon: <Bell {...iconProps} /> },
        '/faq': { text: 'Preguntas Frecuentes', icon: <CircleHelp {...iconProps} /> },
        '/orders': { text: 'Hacer Pedido', icon: <Package {...iconProps} /> },
        '/mis-pedidos': { text: 'Pedidos', icon: <Archive {...iconProps} /> },
        '/buyOrder': { text: 'Ordenes de Compra', icon: <WalletCards {...iconProps} /> },
        '/buyOrder/$orderId': {
            text: <SubLink to={'/buyOrder'} texts={['Ordenes de Compra', 'Detalle de la orden de compra']} />,
            icon: <WalletCards {...iconProps} />
        },
        '/client/orders': { text: 'Hacer Pedido', icon: <ShoppingCart {...iconProps} /> },
        '/client/proOrders': { text: 'Pedidos', icon: <Archive {...iconProps} /> },
        '/client/proOrders/$orderId': {
            text: <SubLink to={'/client/proOrders'} texts={['Pedidos', 'Detalle del pedido']} />,
            icon: <Archive {...iconProps} />
        },
        '/client/searchLists': { text: 'Mis Listas', icon: <ScrollText {...iconProps} /> },

        '/provider/proOrders': { text: 'Pedidos', icon: <Archive {...iconProps} /> },
        '/provider/proOrders/$orderId': {
            text: <SubLink to={'/provider/proOrders'} texts={['Pedidos', 'Detalle del pedido']} />,
            icon: <Archive {...iconProps} />
        },
        '/sellDetail': { text: 'Detalle del Pedido', icon: <FileSearch {...iconProps} /> },
        '/provider/products': { text: 'Productos', icon: <Package {...iconProps} /> },
        '/provider/products/newProducts': {
            text: <SubLink to={'/provider/products'} texts={['Productos', 'Agregar Productos']} />,
            icon: <Package {...iconProps} />
        },
        '/provider/products/$productId': {
            text: <SubLink to={'/provider/products'} texts={['Productos', 'Detalle del Producto']} search={{ currentPage: currentPage }} />,
            icon: <Package {...iconProps} />
        }
    };

    return titles;
}

function DashboardLayout() {
    const router = useRouter();
    const { company } = UseCompanyStore();
    const { getPage } = UseProviderInventoryPaginationState()
    const routeTitles = getRoutTitles(getPage());

    // Store both text & icon in the state
    const [currentTitle, setCurrentTitle] = useState(routeTitles['/configuration']);
    // Utility function to match dynamic routes
    const matchRoute = useCallback((pathname: string) => {
        for (const [route, title] of Object.entries(routeTitles)) {
            if (route.includes('$')) {
                const regex = new RegExp(`^${route.replace(/\$[a-zA-Z]+/g, '[^/]+')}$`);
                if (regex.test(pathname)) {
                    return title;
                }
            } else if (route === pathname) {
                return title;
            }
        }
        return routeTitles['/configuration'];
    }, [routeTitles]);

    // Subscribe to route changes and update title & icon
    useEffect(() => {
        const unsubscribe = router.subscribe('onBeforeRouteMount', () => {
            const pathname = router.state.location.pathname;
            console.log('Pathname changed:', pathname);
            setCurrentTitle(matchRoute(pathname));
        });

        return () => {
            unsubscribe();
        };
    }, [matchRoute, router]);

    return (
        <div className='w-full h-full flex overflow-hidden'>
            <MemoizedSideBarMenu companyName={company?.name || ''} />
            <div className='w-full md:px-12 flex flex-col justify-center'>
                <DashboardHeader title={currentTitle} />
                <div className='w-[calc(100vw-300px)] h-screen mt-0 my-10 border rounded shadow overflow-hidden lg:max-h-[calc(100vh-150px)] bg-white'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

const MemoizedSideBarMenu = memo(SideBarMenu);

export default DashboardLayout;
