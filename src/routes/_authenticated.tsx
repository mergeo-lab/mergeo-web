import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    console.debug('This route is protected, checking authentication...');

    if (!context.auth.isAuthenticated) {
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