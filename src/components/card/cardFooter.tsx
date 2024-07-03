import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode,
    className?: string,
}

export function CardFooter({ children, className }: Props) {
    return (
        <div className={cn('py-3 p-5 lg:px-16 border-t', className)}>
            {children}
        </div>
    )
}

export type CardFooterType = typeof CardFooter;