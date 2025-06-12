import { Toaster } from '@/components/ui/toaster'
import { AuthContextType } from '@/context/AuthContext'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface MyRouterContext {
    auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async () => {
        const rawHash = window.location.hash.substring(1); // remove the "#"
        const hashParams = new URLSearchParams(rawHash);

        const isRecovery =
            hashParams.has('access_token') &&
            hashParams.get('type') === 'recovery';

        const isOnResetPage = window.location.pathname.includes('/reset-password');

        if (isRecovery && !isOnResetPage) {
            const access_token = hashParams.get('access_token');
            const refresh_token = hashParams.get('refresh_token');
            const type = hashParams.get('type');

            // Redirect to reset-password page with token info as search params (not hash)
            const params = new URLSearchParams({
                access_token: access_token ?? '',
                refresh_token: refresh_token ?? '',
                type: type ?? '',
            });

            window.location.replace(`/reset-password?${params.toString()}`);
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
