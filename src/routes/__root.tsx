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
        const rawHash = window.location.hash.substring(1);
        if (rawHash.includes('access_token') && rawHash.includes('type=recovery')) {
            throw redirect({
                to: '/reset-password',
                hash: rawHash
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
