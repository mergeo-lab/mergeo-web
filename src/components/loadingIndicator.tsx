import { cn } from '@/lib/utils';

type loadingIndicatorProps = {
    className?: string,
};

function LoadingIndicator({ className }: loadingIndicatorProps) {
    return (<div className={cn("animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-primary rounded-full", className)} role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
    </div>)
}

export default LoadingIndicator;
