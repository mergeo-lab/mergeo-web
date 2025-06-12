import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    console.debug('This route is protected, checking authentication...');

    // Check for recovery URL
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

    if (!context.auth.account?.user) {
      console.debug('Not authenticated, redirecting to login...');
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }

    console.debug('Authenticated!');

    return context;
  },
  component: AuthenticatedRoute,
});

export function AuthenticatedRoute() {
  return <Outlet />;
}