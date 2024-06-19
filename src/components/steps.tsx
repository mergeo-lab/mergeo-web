import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

type Props = {
    steps: string[],
    current: number,
    className?: string
}

export default function Steps({ steps, current, className }: Props) {
    return (
        <div className={cn("w-full flex flex-col", className)}>
            <Progress className="h-1 bg-border z-0" value={(current - 1) / (steps.length - 1) * 100} />

            <div className="flex justify-between z-10">
                {steps.map((step, index) => (
                    <div key={step}
                        className={cn("",
                            {
                                "text-secondary-background font-bold": index + 1 === current,
                                "text-secondary": index + 1 !== current
                            })}
                    >
                        <div className={cn("w-3 h-3 rounded-full bg-border -mt-2", {
                            "bg-primary": index + 1 <= current,
                        })}>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2">
                {steps.map((step, index) => (
                    <div key={step}
                        className={cn("",
                            {
                                "text-secondary-background font-bold": index + 1 === current,
                                "text-secondary": index + 1 !== current
                            })}
                    >
                        <p className='text-sm text-center'>{step}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}