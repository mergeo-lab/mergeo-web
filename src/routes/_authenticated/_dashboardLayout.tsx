import { DashboardHeader, SideBarMenu } from '@/components/dashboard'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { Bell, CircleHelp, Settings } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/_dashboardLayout')({
    component: () => <DashboardLayout />
})


const routeTitles: Record<string, { text: string, icon: JSX.Element }> = {
    'configuration': { text: 'Configuración de cuenta', icon: <Settings size={25} /> },
    'notifications': { text: 'Notificaciones', icon: <Bell size={25} /> },
    'faq': { text: 'Preguntas Frecuentes', icon: <CircleHelp size={25} /> },
}

function DashboardLayout() {
    const router = useRouter();
    const title = routeTitles[router.history.location.pathname.split('/').pop()!] || routeTitles['configuration']

    return (
        <div className='w-full h-full flex'>
            <SideBarMenu />
            <div className='w-full md:px-12 flex flex-col justify-center'>
                <DashboardHeader title={{ text: title.text, icon: title.icon }} />
                <div className='w-full h-full mt-0 my-10 border rounded shadow overflow-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}