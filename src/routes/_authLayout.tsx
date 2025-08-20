import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ACCOUNT } from '@/lib/constants';
import LoadingIndicator from '@/components/loadingIndicator';

export const Route = createFileRoute('/_authLayout')({
    component: () => <AuthLayout />
})

export default function AuthLayout() {
    const { account, loading } = useAuth();
    const router = useRouter();

    // Get redirect param from search
    const searchParams = new URLSearchParams(router.state.location.search as Record<string, string>);
    const redirectParam = searchParams.get('redirect');

    // Redirect immediately if user is already authenticated
    useEffect(() => {
        if (account && !loading) {
            let redirectTo;

            // If there's a redirect parameter, use it
            if (redirectParam) {
                try {
                    // Decode the URL parameter first
                    const decodedRedirect = decodeURIComponent(redirectParam);

                    // The redirect parameter should be a relative path starting with /
                    if (decodedRedirect.startsWith('/')) {
                        redirectTo = decodedRedirect;
                    } else {
                        // If it's not a valid path, fall back to default
                        const accountType = account?.user?.accountType;
                        redirectTo = (accountType === ACCOUNT.provider ? "/provider" : "/client") + "/dashboard";
                    }
                } catch (error) {
                    console.error('Invalid redirect URL:', redirectParam);
                    // Fall back to default on error
                    const accountType = account?.user?.accountType;
                    redirectTo = (accountType === ACCOUNT.provider ? "/provider" : "/client") + "/dashboard";
                }
            } else {
                // No redirect parameter, use default
                const accountType = account?.user?.accountType;
                redirectTo = (accountType === ACCOUNT.provider ? "/provider" : "/client") + "/dashboard";
            }

            router.navigate({ to: redirectTo, replace: true });
        }
    }, [account, loading, router, redirectParam]);

    // Show loading while checking authentication or if user is already authenticated
    if (loading || account) {
        return (
            <div className='h-screen w-full flex justify-center items-center'>
                <LoadingIndicator className="w-8 h-8" />
            </div>
        );
    }

    return (
        <div className='h-screen w-full flex'>
            <div
                className="w-[65%] bg-secondary-background flex justify-center items-center relative"
            >
                <div
                    className='h-fit w-1/3'
                >
                    <img
                        src="/mergeo-logo.svg"
                        alt="logo"
                        className="w-full"
                    />
                </div>
            </div>
            <div className='w-full h-full md:px-12 md:py-14'>
                <Outlet />
            </div>
        </div>
    )
}
