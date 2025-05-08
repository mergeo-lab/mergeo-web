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

    const handleContainerAnimationComplete = () => {
        // Start logo animation after container is shrunk
        logoControls.start({
            y: 0,
            scale: 1,
            transition: { duration: 0.5 },
        }).then(() => {
            return logoControls.start({
                y: -396,
                transition: { duration: 0.5 },
            }).then(() => {
                handleAnimationComplete();
            });
        })

    };

    useEffect(() => {
        // Trigger initial container animation
        if (startAnimation == true) {
            containerControls.start({
                width: '12%',
                padding: "0px 44px 0px 38px",
                transition: { duration: 0.6 },
            });
        }
    }, [containerControls, startAnimation]);

    return (
        <div className='h-screen w-full flex'>
            <motion.div
                initial={{ width: '45%', padding: "0 250px 0 250px" }}
                animate={containerControls}
                onAnimationComplete={handleContainerAnimationComplete}
                className="bg-secondary-background flex justify-center relative"
            >
                <motion.div
                    initial={{ y: 0, scale: 1 }}
                    animate={logoControls}
                    className='w-full h-full flex justify-center items-center'
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
