import { createPortal } from 'react-dom';
import { useGlobalLoading } from '@/store/globalLoading.store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LoadingIndicator from '@/components/loadingIndicator';

export default function GlobalOverlayLoadingIndicator() {
    const { visible, label } = useGlobalLoading();

    return createPortal(
        <AnimatePresence>
            {visible && (
                <div className="absolute w-full h-full inset-0 flex flex-col items-center justify-center z-40">
                    <motion.div
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={cn("absolute inset-0 w-full h-full bg-white/50 backdrop-blur-[6px]")}
                    >
                    </motion.div>
                    <div className="z-50 flex flex-col items-center justify-center">
                        <LoadingIndicator />
                        {label && <p className="mt-4 text-sm text-gray-700">{label}</p>}
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}