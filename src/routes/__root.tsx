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
        if (hash.includes('#/reset-password') && hash.includes('type=recovery')) {
            console.debug('Recovery URL detected, redirecting to reset-password...');
            const url = new URL(window.location.href);
            const token = url.searchParams.get('token');
            if (token) {
                throw redirect({
                    to: '/reset-password',
                    search: { token },
                });
            }
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
