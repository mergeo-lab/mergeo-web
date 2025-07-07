import { cn } from '@/lib/utils';

type loadingIndicatorProps = {
    className?: string,
    size?: number
};

function LoadingIndicator({ className, size = 6 }: loadingIndicatorProps) {
    return (<div className={cn("animate-rotate-360 animate-duration-500 repeat-infinite border-[3px] border-current border-t-transparent text-primary rounded-full", className, {
        "size-4": size === 4,
        "size-6": size === 6,
        "size-8": size === 8,
        "size-10": size === 10,
        "size-12": size === 12,
        "size-14": size === 14,
        "size-16": size === 16,
        "size-18": size === 18,
    })} role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
    </div>)
}

export default LoadingIndicator;
