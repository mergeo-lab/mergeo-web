import { ACCOUNT } from '@/lib/constants';
import { useEffect, useCallback } from 'react';
import { createFileRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/hooks';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType')({
    component: AccountTypeRoute,
});

export function AccountTypeRoute() {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Define the redirection logic inside useCallback
    const handleRedirect = useCallback(() => {
        const accountType = auth.user?.accountType;
        const currentPath = location.pathname;
        const searchParams = location.search;

        if (accountType === ACCOUNT.provider && currentPath.startsWith('/client')) {
            const newPath = currentPath.replace('/client', '/provider');
            navigate({ to: newPath, search: searchParams, replace: true });
        } else if (accountType === ACCOUNT.client && currentPath.startsWith('/provider')) {
            const newPath = currentPath.replace('/provider', '/client');
            navigate({ to: newPath, search: searchParams, replace: true });
        }
    }, [auth.user?.accountType, location.pathname, location.search, navigate]);

    // Trigger the redirection logic using useEffect
    useEffect(() => {
        handleRedirect();
    }, [handleRedirect]);

    return <Outlet />;
}
