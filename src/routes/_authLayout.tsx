import UseLoginStore from '@/store/login.store';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authLayout')({
    component: () => <AuthLayout />
})

export default function AuthLayout() {
    const { setEndAnimation, startAnimation } = UseLoginStore();
    const containerControls = useAnimation();
    const logoControls = useAnimation();

    const handleAnimationComplete = () => {
        setEndAnimation(true);
    };

    useEffect(() => {
        // Trigger initial container animation
        if (startAnimation == true) {
            logoControls.start({
                scale: 0.5,
                opacity: 0,
                transition: { duration: 0.3 },
            }).then(() => {
                containerControls.start({
                    width: '12%',
                    transition: { duration: .5 },
                }).then(() => {
                    handleAnimationComplete();
                });
            })
        }
    }, [containerControls, startAnimation]);

    return (
        <div className='h-screen w-full flex'>
            <motion.div
                initial={{ width: '65%' }}
                animate={containerControls}
                className="bg-secondary-background flex justify-center items-center relative"
            >
                <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    animate={logoControls}
                    className='h-fit w-1/3'
                >
                    <img
                        src="/mergeo-logo.svg"
                        alt="logo"
                        className="w-full"

                    />
                </motion.div>
            </motion.div>
            <div className='w-full h-full md:px-12 md:py-14'>
                <Outlet />
            </div>
        </div>
    )
}
