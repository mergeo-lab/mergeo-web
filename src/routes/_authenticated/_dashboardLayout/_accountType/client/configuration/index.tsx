import { Company } from '@/components/configuration/client';
import { Users } from '@/components/configuration/users';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createFileRoute, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import React from 'react';
import { tabs } from '@/lib/constants';

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
        <MemoizedCompany />
      </TabsContent>
      <TabsContent className='h-[calc(100%-50px)]  m-0' value="users">
        <Users />
      </TabsContent>
    </Tabs >
  )
}

const MemoizedCompany = React.memo(Company)