import { cn } from '@/lib/utils';

type loadingIndicatorProps = {
    className?: string,
    size?: number
};

function LoadingIndicator({ className, size = 4 }: loadingIndicatorProps) {
    return (<div className={cn("animate-rotate-360 animate-duration-500 repeat-infinite border-[3px] border-current border-t-transparent text-primary rounded-full", className, `size-${size}`)} role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
    </div>)
}

export default LoadingIndicator;
