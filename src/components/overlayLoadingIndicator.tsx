import React from "react";
import LoadingIndicator from "@/components/loadingIndicator";
import { cn } from "@/lib/utils";

type Props = {
    className?: string,
    label?: string,
};

// Memoize the LoadingIndicator to prevent unnecessary re-renders
const MemoizedLoadingIndicator = React.memo(LoadingIndicator);

function OverlayLoadingIndicator({ className, label }: Props) {
    return (
        <div className={cn("absolute inset-0 flex items-center justify-center z-50 bg-white/50", className)}>
            <MemoizedLoadingIndicator />
            {label && <p className="mt-4 text-sm text-gray-700">{label}</p>}
        </div>
    )
}

export default OverlayLoadingIndicator;