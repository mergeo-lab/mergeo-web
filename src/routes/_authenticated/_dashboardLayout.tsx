import { createFileRoute, Outlet } from '@tanstack/react-router'
import SideBarMenu from '../../components/sideBarMenu/index';

export const Route = createFileRoute('/_authenticated/_dashboardLayout')({
    component: () => <DashboardLayout />
})

function DashboardLayout() {
    return (
        <div className='w-full h-full flex'>
            <SideBarMenu />
            <div className='w-full md:px-12 flex flex-col justify-center'>
                <div className='bg-blue-500 h-20'>hola</div>
                <div className='w-full h-full my-10 border rounded shadow'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}