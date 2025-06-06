import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authLayout')({
    component: () => <AuthLayout />
})

export default function AuthLayout() {
    return (
        <div className='h-screen w-full flex'>
            <div
                className="w-[65%] bg-secondary-background flex justify-center items-center relative"
            >
                <div
                    className='h-fit w-1/3'
                >
                    <img
                        src="/mergeo-logo.svg"
                        alt="logo"
                        className="w-full"
                    />
                </div>
            </div>
            <div className='w-full h-full md:px-12 md:py-14'>
                <Outlet />
            </div>
        </div>
    )
}
