import React, { memo, useMemo } from 'react'; // Import React, memo, and useMemo
import { DashboardHeader, SideBarMenu } from '@/components/dashboard'
import UseCompanyStore from '@/store/company.store';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { Bell, CircleHelp, Settings, ScrollText, Package, Archive, WalletCards, FileSearch } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/_dashboardLayout')({
    component: () => <DashboardLayout />
})

const routeTitles: Record<string, { text: string, icon: JSX.Element }> = {
    '/': { text: 'Dashboard', icon: <ScrollText size={25} /> },
    '/searchLists': { text: 'Mis Listas', icon: <ScrollText size={25} /> },
    '/configuration': { text: 'Configuración de cuenta', icon: <Settings size={25} /> },
    '/notifications': { text: 'Notificaciones', icon: <Bell size={25} /> },
    '/faq': { text: 'Preguntas Frecuentes', icon: <CircleHelp size={25} /> },
    '/orders': { text: 'Hacer Pedido', icon: <Package size={25} /> },
    '/mis-pedidos': { text: 'Pedidos', icon: <Archive size={25} /> },
    '/buyOrder': { text: 'Ordenes de Compra', icon: <WalletCards size={25} /> },
    '/buyOrder/$orderId': { text: 'Detalle de la Orden de Compra', icon: <WalletCards size={25} /> },
    '/provider/proOrders': { text: 'Pedidos', icon: <Archive size={25} /> },
    '/provider/$proOrderId': { text: 'Detalle del Pedido', icon: <Archive size={25} /> },
    '/sellDetail': { text: 'Detalle del Pedido', icon: <FileSearch size={25} /> },
}

function DashboardLayout() {
    const router = useRouter();
    const { company } = UseCompanyStore();

    // Use useMemo to memoize the title object
    // Utility function to match dynamic routes
    const matchRoute = (pathname: string): { text: string; icon: JSX.Element } | undefined => {
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
        <div className='w-full h-full flex'>
            <MemoizedSideBarMenu companyName={company?.name || ''} />
            <div className='w-full md:px-12 flex flex-col justify-center'>
                <DashboardHeader title={{ text, icon }} />
                <div className='w-full h-screen mt-0 my-10 border rounded shadow overflow-hidden lg:max-h-[calc(100vh-150px)] '>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

const MemoizedSideBarMenu = memo(SideBarMenu);