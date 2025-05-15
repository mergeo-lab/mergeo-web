import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for configuration components
const Company = lazy(() => import('@/components/configuration/provider').then(mod => ({ default: mod.Company })));
const Users = lazy(() => import('@/components/configuration/users').then(mod => ({ default: mod.Users })));

type TabSearch = { tab: string };

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/configuration/')({
  validateSearch: (search: Record<string, unknown>): TabSearch => {
    return {
      tab: (search?.tab) as string || '',
    };
  },
  component: () => <Configuration />,
  // Add preloading hint for provider configuration components
  loader: async () => {
    await Promise.all([
      import('@/components/configuration/provider'),
      import('@/components/configuration/users'),
    ]);
    return null;
  },

})

const tabsTriggerClassName = 'rounded w-52 data-[state=active]:multi-[bg-primary;text-secondary-foreground]';

function Configuration() {
  const { tab } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();

  // Preload Users component when on the company tab
  React.useEffect(() => {
    if (tab === 'company') {
      const timer = setTimeout(() => {
        void import('@/components/configuration/users');
      }, 2000); // Delay preloading by 2 seconds
      return () => clearTimeout(timer);
    }
  }, [tab]);

  const onTabChange = (value: string) => {
    if (router) {
      navigate({ to: '', search: { tab: value }, replace: true });
    }
  };

  return (
    <Tabs value={tab} className="w-full h-full rounded relative" onValueChange={onTabChange}>
      <TabsList className='rounded-t rounded-b-none w-full justify-start h-[50px] bg-accent pl-3'>
        <TabsTrigger className={tabsTriggerClassName} value="company">Empresa</TabsTrigger>
        <TabsTrigger className={tabsTriggerClassName} value="users">Usuarios</TabsTrigger>
      </TabsList>
      <TabsContent className='h-[calc(100%-50px)] m-0' value="company">
        <ErrorBoundary fallback={<div className="p-4">Error loading company component</div>}>
          <Suspense fallback={<Skeleton className="w-full h-full rounded" />}>
            <MemoizedCompany />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
      <TabsContent className='h-[calc(100%-50px)]  m-0' value="users">
        <ErrorBoundary fallback={<div className="p-4">Error loading users component</div>}>
          <Suspense fallback={<Skeleton className="w-full h-full rounded" />}>
            <Users />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
    </Tabs >
  )
}

// Memoize the Company component to prevent unnecessary re-renders
const MemoizedCompany = React.memo(Company);
