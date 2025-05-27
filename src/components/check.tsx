import { cn } from "@/lib/utils"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"

type Props = {
    className?: string,
    positive: boolean
}

export function Check({ className, positive }: Props) {

    return (
        <div className={cn("h-[20px] w-[20px] flex justify-center items-center", className)}>
            {positive
                ? <ImCheckboxChecked />
                : <ImCheckboxUnchecked />
            }
        </div>
    )
}
