import { cn } from "@/lib/utils"

type Props = {
    className?: string,
    positive: boolean
}

export function Check({ className, positive }: Props) {

    return (
        <div className={cn("h-[20px] w-[20px] flex justify-center items-center", className)}>
            {positive
                ? <span className="text-primary text-xs leading-none">✓</span>
                : <span className="text-destructive text-xs leading-none">x</span>
            }
        </div>
    )
}