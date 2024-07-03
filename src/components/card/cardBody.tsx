import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode,
    className?: string
}

export function CardBody({ children, className }: Props) {
    return (
        <div className={cn('py-8 md:py-8 px-5 md:px-16 h-full overflow-y-auto', className)}>
            {children}
        </div>
    )
}

export type CardBodyType = typeof CardBody;