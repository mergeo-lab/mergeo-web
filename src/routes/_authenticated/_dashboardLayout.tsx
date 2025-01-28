import React, { memo, useMemo } from 'react'; // Import React, memo, and useMemo
import { DashboardHeader, SideBarMenu } from '@/components/dashboard'
import UseCompanyStore from '@/store/company.store';
import { createFileRoute, Outlet, useRouter, Link } from '@tanstack/react-router';
import { Bell, CircleHelp, Settings, ScrollText, Package, Archive, WalletCards, FileSearch } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/_dashboardLayout')({
    component: () => <DashboardLayout />,
})

const iconProps = {
    size: 30,
    color: 'text-primary'
}
const routeTitles: Record<string, { text: string | JSX.Element, icon: JSX.Element }> = {
    '/': { text: 'Dashboard', icon: <ScrollText size={iconProps.size} className={iconProps.color} /> },
    '/searchLists': { text: 'Mis Listas', icon: <ScrollText size={iconProps.size} className={iconProps.color} /> },
    '/configuration': { text: 'Configuración de cuenta', icon: <Settings size={iconProps.size} className={iconProps.color} /> },
    '/notifications': { text: 'Notificaciones', icon: <Bell size={iconProps.size} className={iconProps.color} /> },
    '/faq': { text: 'Preguntas Frecuentes', icon: <CircleHelp size={iconProps.size} className={iconProps.color} /> },
    '/orders': { text: 'Hacer Pedido', icon: <Package size={iconProps.size} className={iconProps.color} /> },
    '/mis-pedidos': { text: 'Pedidos', icon: <Archive size={iconProps.size} className={iconProps.color} /> },
    '/buyOrder': { text: 'Ordenes de Compra', icon: <WalletCards size={iconProps.size} className={iconProps.color} /> },
    '/buyOrder/$orderId': {
        text: <p>Ordenes de Compra <span className='text-base border-l-2 border-muted pl-2 font-light'>Detalle de la orden de compra</span></p>,
        icon: <WalletCards size={iconProps.size} className={iconProps.color} />
    },
    '/provider/proOrders': { text: 'Pedidos', icon: <Archive size={iconProps.size} className={iconProps.color} /> },
    '/provider/proOrders/$orderId': {
        text: <p>Pedidos <span className='text-base border-l-2 border-muted pl-2 font-light'>Detalle del pedido</span></p>,
        icon: <Archive size={iconProps.size} className={iconProps.color} />
    },
    '/sellDetail': { text: 'Detalle del Pedido', icon: <FileSearch size={iconProps.size} className={iconProps.color} /> },
    '/provider/products': { text: 'Productos', icon: <Package size={iconProps.size} className={iconProps.color} /> },
    '/provider/products/newProducts': {
        text: <p><Link to='/provider/products'>Productos</Link> <span className='text-base border-l-2 border-muted pl-2 font-light'>Agregar Productos</span></p>,
        icon: <Package size={iconProps.size} className={iconProps.color} />
    },
}

function DashboardLayout() {
    const router = useRouter();
    const { company } = UseCompanyStore();

    // Use useMemo to memoize the title object
    // Utility function to match dynamic routes
    const matchRoute = (pathname: string): { text: string | JSX.Element; icon: JSX.Element } | undefined => {
        for (const [route, title] of Object.entries(routeTitles)) {
            if (route.includes('$')) {
                // Convert dynamic route to regex
                const regex = new RegExp(`^${route.replace(/\$[a-zA-Z]+/g, '[^/]+')}$`);
                if (regex.test(pathname)) {
                    return title;
                }
            } else if (route === pathname) {
                return title;
            }
        }
        return undefined; // Return undefined if no match is found
    };

    // Use useMemo to memoize the title
    const title = useMemo(() => {
        const pathname = router.history.location.pathname;
        return matchRoute(pathname) || routeTitles['/configuration'];
    }, [router.history.location.pathname]);

    // Destructure the title properties before passing them to DashboardHeader
    const { text, icon } = title;

    return (
        <div className='w-full h-full flex overflow-hidden'>
            <MemoizedSideBarMenu companyName={company?.name || ''} />
            <div className='w-full md:px-12 flex flex-col justify-center'>
                <DashboardHeader title={{ text, icon }} />
                <div className='w-[calc(100vw-300px)] h-screen mt-0 my-10 border rounded shadow overflow-hidden lg:max-h-[calc(100vh-150px)] bg-white'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

const MemoizedSideBarMenu = memo(SideBarMenu);