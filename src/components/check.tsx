import { cn } from "@/lib/utils"

type Props = {
    className?: string,
    positive: boolean
}

export function Check({ className, positive }: Props) {

    return (
        <div className={cn("h-[20px] w-[20px] flex justify-center items-center", className)}>
            {positive
                ? <span className="text-primary text-sm leading-none">✓</span>
                : <span className="text-destructive text-sm leading-none">x</span>
            }
        </div>
    )
}