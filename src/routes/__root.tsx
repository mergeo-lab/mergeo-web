import { Toaster } from '@/components/ui/toaster'
import { AuthContextType } from '@/context/AuthContext'
import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface MyRouterContext {
    auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async () => {
        // Check for recovery URL before any authentication
        const hash = window.location.hash;
        if (hash.includes('access_token') && hash.includes('type=recovery')) {
            throw redirect({
                to: '/reset-password',
                search: { hash: hash.slice(1) },
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
