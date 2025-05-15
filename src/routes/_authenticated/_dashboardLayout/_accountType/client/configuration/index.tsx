import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createFileRoute, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import React, { Suspense, lazy } from 'react';
import { tabs } from '@/lib/constants';
import { ErrorBoundary } from 'react-error-boundary';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for configuration components
const Company = lazy(() => import('@/components/configuration/client').then(mod => ({ default: mod.Company })));
const Users = lazy(() => import('@/components/configuration/users').then(mod => ({ default: mod.Users })));

type TabSearch = { tab?: tabs };
export type ConfigTabsType = 'company' | 'users';

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/configuration/')({
  validateSearch: (search: Record<string, unknown>): TabSearch => ({
    tab: (search?.tab as tabs) ?? 'company',
  }),
  component: () => <Configuration />
});


const tabsTriggerClassName = 'rounded w-52 data-[state=active]:multi-[bg-primary;text-secondary-foreground]';

function Configuration() {
  const search = useSearch({ from: "/_authenticated/_dashboardLayout" }) as { tab?: tabs };

  console.log("Tab from useSearch:", search.tab);
  const router = useRouter();
  const navigate = useNavigate();

  const onTabChange = (value: string) => {
    if (router) {
      navigate({ to: '', search: { tab: value }, replace: true });
    }
  };

  return (
    <Tabs value={search.tab} className="w-full h-full rounded relative" onValueChange={onTabChange}>
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

const MemoizedCompany = React.memo(Company)