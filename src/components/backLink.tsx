import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from '@tanstack/react-router'
import { BackLinkArrowPosition, BackLinkType } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Props = {
    className?: string
    disabled?: boolean,
    type?: BackLinkType,
    arrowPosition?: BackLinkArrowPosition,
    label?: string,
    location?: {
        path: string,
        search: {
            [key: string]: string
        }
    },
    callback?: () => void
}

export default function BackLink({
    className,
    disabled,
    type = BackLinkType.LINK,
    label = "volver",
    arrowPosition = BackLinkArrowPosition.LEFT,
    location,
    callback
}: Props) {
    const { history, navigate } = useRouter()

    function handleClick() {
        if (location) {
            navigate({ to: location.path, search: location.search })
        } else {
            history.go(-1)
        }
    }

    if (type === BackLinkType.LINK) {
        return (
            <Button onClick={handleClick}
                variant="ghost" type="button" className={cn("text-secondary px-2 pr-4", className)}>
                <ChevronLeft />
                {label}
            </Button>
        )
    } else {
        return (
            <Button
                onClick={!disabled ? callback : () => { }}
                variant="ghost"
                type="button"
                className={cn("text-secondary px-4", {
                    "pr-2": arrowPosition === BackLinkArrowPosition.RIGHT,
                    "pl-2": arrowPosition === BackLinkArrowPosition.LEFT,
                    "text-black/25 cursor-default hover:multi-[bg-transparent;text-black/25]": disabled
                }, className)}
            >
                {arrowPosition === BackLinkArrowPosition.LEFT && <ChevronLeft />}
                {label}
                {arrowPosition === BackLinkArrowPosition.RIGHT && <ChevronRight />}
            </Button>
        )
    }
}
