import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    console.debug('This route is protected, checking authentication...');

    if (!context.auth.account?.user) {
      console.debug('Not authenticated, redirecting to login...');
      // Convert search params to string if it's an object
      let searchString = '';
      if (typeof location.search === 'string') {
        searchString = location.search;
      } else if (location.search && typeof location.search === 'object') {
        searchString = new URLSearchParams(location.search as Record<string, string>).toString();
        if (searchString) searchString = '?' + searchString;
      }

      const redirectPath = location.pathname + searchString;

      throw redirect({
        to: '/login',
        search: {
          // Use the current pathname and search to power a redirect after login
          redirect: redirectPath,
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