import { Toaster } from '@/components/ui/toaster'
import { AuthContextType } from '@/context/AuthContext'
import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface MyRouterContext {
    auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async () => {
        const rawHash = window.location.hash.substring(1);
        const isRecovery = rawHash.includes('access_token') && rawHash.includes('type=recovery');
        const isOnResetPage = window.location.pathname.includes('/reset-password');

        if (isRecovery && !isOnResetPage) {
            throw redirect({
                to: '/reset-password',
                search: { hash: rawHash }, // 👈 pasamos el hash como query param, no en el fragmento
            });
        }
    },
    component: () => (
        <>
            <Outlet />
            <Toaster />
            <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
        </>
    ),
})
