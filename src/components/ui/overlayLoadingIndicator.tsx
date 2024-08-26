import LoadingIndicator from "@/components/loadingIndicator";
import { cn } from "@/lib/utils";

type Props = {
    className?: string,
};

function OverlayLoadingIndicator({ className }: Props) {
    return (
        <div className={cn("absolute inset-0 flex items-center justify-center z-20 bg-white/50", className)}>
            <LoadingIndicator />
        </div>
    )
}

export default OverlayLoadingIndicator;