import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authLayout')({
    component: () => <div className='h-screen w-full flex flex-col md:flex-row'>
        <div className='w-full md:max-w-[600px] bg-secondary-background flex justify-center items-center p-10 md:p-0'>
            <img className='w-1/4 md:w-auto' src="/mergeo-logo.svg" alt='logo' />
        </div>
        <div className='w-full h-full px-12 py-14'>
            <Outlet />
        </div>
    </div>
})