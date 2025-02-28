import { Company } from '@/components/configuration/provider';
import { Users } from '@/components/configuration/users';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

type TabSearch = { tab: string };

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/provider/configuration/')({
  validateSearch: (search: Record<string, unknown>): TabSearch => {
    return {
      tab: (search?.tab) as string || '',
    };
  },
  component: () => <Configuration />
})

const tabsTriggerClassName = 'rounded w-52 data-[state=active]:multi-[bg-primary;text-secondary-foreground]';

function Configuration() {
  const { tab } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();

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
        <Company />
        <div className='w-full h-full bg-red-300'></div>
      </TabsContent>
      <TabsContent className='h-[calc(100%-50px)]  m-0' value="users">
        <Users />
      </TabsContent>
    </Tabs >
  )
}