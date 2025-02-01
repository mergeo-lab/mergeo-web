import React from "react";
import LoadingIndicator from "@/components/loadingIndicator";
import { cn } from "@/lib/utils";

type Props = {
    className?: string,
};

// Memoize the LoadingIndicator to prevent unnecessary re-renders
const MemoizedLoadingIndicator = React.memo(LoadingIndicator);

function OverlayLoadingIndicator({ className }: Props) {
    return (
        <div className={cn("absolute inset-0 flex items-center justify-center z-50 bg-white/50", className)}>
            <MemoizedLoadingIndicator />
        </div>
    )
}

export default OverlayLoadingIndicator;