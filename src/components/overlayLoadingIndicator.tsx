import { motion } from "framer-motion";
import React from "react";
import LoadingIndicator from "@/components/loadingIndicator";
import { cn } from "@/lib/utils";

type Props = {
    className?: string,
    label?: string,
};

const MemoizedLoadingIndicator = React.memo(LoadingIndicator);

function OverlayLoadingIndicator({ className, label }: Props) {
    return (
        <div className="absolute w-full h-full inset-0 flex flex-col items-center justify-center z-40">
            <motion.div
                initial={{ opacity: 0, }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                    "absolute inset-0 w-full h-full bg-white/50 backdrop-blur-[6px]",
                    className
                )}
            >
            </motion.div>
            <div className="z-50 flex flex-col items-center justify-center w-20 h-20">
                <MemoizedLoadingIndicator />
                {label && <p className="mt-4 text-sm text-gray-700">{label}</p>}
            </div>
        </div>

    );
}

export default OverlayLoadingIndicator;
