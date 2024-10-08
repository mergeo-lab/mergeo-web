import React, { memo, useMemo } from 'react'; // Import React, memo, and useMemo
import { DashboardHeader, SideBarMenu } from '@/components/dashboard'
import UseCompanyStore from '@/store/company.store';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { Bell, CircleHelp, Settings, ScrollText } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/_dashboardLayout')({
    component: () => <DashboardLayout />
})

const routeTitles: Record<string, { text: string, icon: JSX.Element }> = {
    'searchLists': { text: 'Mis Listas', icon: <ScrollText size={25} /> },
    'configuration': { text: 'Configuración de cuenta', icon: <Settings size={25} /> },
    'notifications': { text: 'Notificaciones', icon: <Bell size={25} /> },
    'faq': { text: 'Preguntas Frecuentes', icon: <CircleHelp size={25} /> },
}

function DashboardLayout() {
    const router = useRouter();
    const { company } = UseCompanyStore();

    // Use useMemo to memoize the title object
    const title = useMemo(() => {
        return routeTitles[router.history.location.pathname.split('/').pop()!] || routeTitles['configuration'];
    }, [router.history.location.pathname]);

    // Destructure the title properties before passing them to DashboardHeader
    const { text, icon } = title;

    return (
        <div className='w-full h-full flex'>
            <MemoizedSideBarMenu companyName={company?.name || ''} />
            <div className='w-full md:px-12 flex flex-col justify-center'>
                <DashboardHeader title={{ text, icon }} />
                <div className='w-full h-screen mt-0 my-10 border rounded shadow overflow-hidden lg:max-h-[calc(100vh-150px)] '>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

const MemoizedSideBarMenu = memo(SideBarMenu);