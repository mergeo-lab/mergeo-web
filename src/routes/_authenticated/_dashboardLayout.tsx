import { JSX, memo, useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import UseProviderInventoryPaginationState from '@/store/providerInventoryPagination.store';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from 'react-error-boundary';
import { MdOutlineDiscount } from "react-icons/md";
import type { FallbackProps } from 'react-error-boundary';

// Lazy load components
const DashboardHeader = lazy(() => import('@/components/dashboardLayout').then(mod => ({ default: mod.DashboardHeader })));
const SideBarMenu = lazy(() => import('@/components/dashboardLayout').then(mod => ({ default: mod.SideBarMenu })));


import {
    LuBell,
    LuCircleHelp,
    LuSettings,
    LuScrollText,
    LuPackage,
    LuArchive,
    LuWalletCards,
    LuFileSearch,
    LuShoppingCart,
    LuHeart,
    LuThumbsDown,
    LuLayoutDashboard
} from "react-icons/lu";
import { useAuth } from '@/context/AuthContext.tsx';
import { useGlobalLoading } from '@/store/globalLoading.store.ts';

export const Route = createFileRoute('/_authenticated/_dashboardLayout')({
    component: DashboardLayout,
    // Use the loader pattern for preloading data/modules
    loader: async () => {
        // Preload critical components in parallel
        const imports = [
            import('@/components/dashboardLayout'),
            import('@/components/ui/button')
        ];

        // Wait for imports to complete
        await Promise.all(imports);

        // Return an empty object as we're just preloading
        return {};
    },
    // This runs before the component renders
    beforeLoad: () => {
        // We can trigger prefetching of related routes
        // This is just informational and not actually executed
        return {};
    }
});

const iconProps = {
    size: 30,
    className: 'text-primary'
};

function SubLink({ to, texts, search }: { to?: string | undefined, texts: string[], search?: Record<string, unknown> }) {
    const { navigate } = useRouter()
    return (
        <p>
            <Button variant='link' onClick={() => to && navigate({ to: to, search: search })} className={cn('text-md hover:no-underline leading-0 py-0 px-2', {
                'no-underline hover:text-secondary cursor-default': to === undefined
            })}>
                <span className={cn('border-b-[1px]', {
                    'border-secondary/60 hover:multi-[border-primary;text-primary]': to,
                    'border-none': !to
                })}>{texts[0]}</span>
            </Button>{' '}
            <span className='text-base border-l-2 border-muted pl-2 font-light'>{texts[1]}</span>
        </p>
    )
}

const getRoutTitles = (currentPage: number) => {

    const titles: Record<string, { text: string | JSX.Element; icon: JSX.Element }> = {
        '/': { text: 'Dashboard', icon: <LuScrollText {...iconProps} /> },
        '/searchLists': { text: 'Mis Listas', icon: <LuScrollText {...iconProps} /> },
        '/configuration': { text: 'Configuración de cuenta', icon: <LuSettings {...iconProps} /> },
        '/notifications': { text: 'Notificaciones', icon: <LuBell {...iconProps} /> },
        '/faq': { text: 'Preguntas Frecuentes', icon: <LuCircleHelp {...iconProps} /> },
        '/orders': { text: 'Hacer Pedido', icon: <LuPackage {...iconProps} /> },
        '/mis-pedidos': { text: 'Pedidos', icon: <LuArchive {...iconProps} /> },
        '/buyOrder': { text: 'Ordenes de Compra', icon: <LuWalletCards {...iconProps} /> },
        '/provider/discounts': { text: 'Descuentos', icon: <MdOutlineDiscount {...iconProps} /> },
        '/buyOrder/$orderId': {
            text: <SubLink to={'/buyOrder'} texts={['Ordenes de Compra', 'Detalle de la orden de compra']} />,
            icon: <LuWalletCards {...iconProps} />
        },
        '/client/dashboard': { text: 'Panel de Control', icon: <LuLayoutDashboard {...iconProps} /> },
        '/client/orders': { text: 'Hacer Pedido', icon: <LuShoppingCart {...iconProps} /> },
        '/client/proOrders': { text: 'Pedidos', icon: <LuArchive {...iconProps} /> },
        '/client/proOrders/$orderId': {
            text: <SubLink to={'/client/proOrders'} texts={['Pedidos', 'Detalle del pedido']} />,
            icon: <LuArchive {...iconProps} />
        },

        '/client/lists': {
            text: <SubLink texts={['Mis Listas', 'Productos']} />,
            icon: <LuScrollText {...iconProps} />
        },
        '/client/lists/favorites': {
            text: <SubLink texts={['Mis Listas', 'Favoritos']} />,
            icon: <LuHeart {...iconProps} />
        },
        '/client/lists/blackList': {
            text: <SubLink texts={['Mis Listas', 'Lista Negra']} />,
            icon: <LuThumbsDown {...iconProps} />
        },

        '/provider/dashboard': { text: 'Panel de Control', icon: <LuLayoutDashboard {...iconProps} /> },
        '/provider/proOrders': { text: 'Pedidos', icon: <LuArchive {...iconProps} /> },
        '/provider/proOrders/$orderId': {
            text: <SubLink to={'/provider/proOrders'} texts={['Pedidos', 'Detalle del pedido']} />,
            icon: <LuArchive {...iconProps} />
        },
        '/sellDetail': { text: 'Detalle del Pedido', icon: <LuFileSearch {...iconProps} /> },
        '/provider/products': { text: 'Productos', icon: <LuPackage {...iconProps} /> },
        '/provider/products/newProducts': {
            text: <SubLink to={'/provider/products'} texts={['Productos', 'Agregar Productos']} />,
            icon: <LuPackage {...iconProps} />
        },
        '/provider/products/$productId': {
            text: <SubLink to={'/provider/products'} texts={['Productos', 'Detalle del Producto']} search={{ currentPage: currentPage }} />,
            icon: <LuPackage {...iconProps} />
        },
    };

    return titles;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="p-8">
            <h2>An error occurred loading this page</h2>
            <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error?.message}</pre>
            <pre style={{ color: 'gray', fontSize: 12 }}>{error?.stack}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}

function DashboardLayout() {
    const router = useRouter();
    const { getPage } = UseProviderInventoryPaginationState();
    const { account } = useAuth();
    const routeTitles = getRoutTitles(getPage());
    const { hide } = useGlobalLoading();

    // Preload routes based on user type
    useEffect(() => {
        if (!account?.user?.accountType) return;

        const timer = setTimeout(() => {
            const preloadRoutes = async () => {
                try {
                    if (account?.user?.accountType === 'client') {
                        await Promise.all([
                            import('./_dashboardLayout/_accountType/client/dashboard.tsx'),
                            import('./_dashboardLayout/_accountType/client/orders'),
                        ]);
                    } else if (account?.user?.accountType === 'provider') {
                        await Promise.all([
                            import('./_dashboardLayout/_accountType/provider/dashboard.tsx'),
                            import('./_dashboardLayout/_accountType/provider/products'),
                        ]);
                    }
                } catch (error) {
                    console.warn(`Preloading ${account?.user?.accountType} routes failed:`, error);
                }
            };

            preloadRoutes();
        }, 2000);

        hide();
        return () => clearTimeout(timer);
    }, [account?.user?.accountType, hide]);


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
            <ErrorBoundary fallback={<div className="p-4">Error loading sidebar</div>}>
                <Suspense fallback={<div className="w-64 bg-secondary h-screen"></div>}>
                    <MemoizedSideBarMenu companyName={account?.company.name || ''} />
                </Suspense>
            </ErrorBoundary>
            <div className='w-full md:px-12 flex flex-col justify-center'>
                <ErrorBoundary fallback={<div className="h-16 px-4 flex items-center border-b">Dashboard</div>}>
                    <Suspense fallback={<div className="h-16 bg-white shadow animate-pulse"></div>}>
                        <DashboardHeader title={currentTitle} />
                    </Suspense>
                </ErrorBoundary>
                <div className='w-[calc(100vw-300px)] h-screen mt-0 my-10 border rounded shadow overflow-hidden lg:max-h-[calc(100vh-110px)] bg-white'>
                    <ErrorBoundary
                        FallbackComponent={ErrorFallback}
                        onError={(error, info) => {
                            console.error('ErrorBoundary caught an error:', error, info);
                        }}
                    >
                        <Outlet />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}

// Enhanced memoized sidebar with preloading capabilities
const MemoizedSideBarMenu = memo(SideBarMenu);

export default DashboardLayout;
