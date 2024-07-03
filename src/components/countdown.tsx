import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react"

type Props = {
    time: number,
    label?: string,
    showTimer?: boolean,
    layout?: "row" | "column",
    callback?: () => void
}
export default function CountDownIndicator({ time, label, layout = "row", showTimer = false, callback }: Props) {
    const [startTime] = useState(Date.now());
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let animationFrameId: number;

        const updateProgress = () => {
            const elapsedTime = Date.now() - startTime;
            const progressPercentage = (elapsedTime / (time * 1000)) * 100;

            if (progressPercentage >= 100) {
                setProgress(100);
                callback && callback();
            } else {
                setProgress(progressPercentage);
                animationFrameId = requestAnimationFrame(updateProgress);
            }
        };

        animationFrameId = requestAnimationFrame(updateProgress);

        return () => cancelAnimationFrame(animationFrameId);
    }, [startTime, time, callback]);

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className={cn('mb-2', {
                'flex flex-col items-center': layout === "column",
                'flex items-center': layout === "row",
            })}>
                {label && <p className='text-base mr-1'>{label}</p>}
                <p className="text-base">{showTimer && Math.ceil(time - (progress * time / 100))}</p>
            </div>
            <Progress value={progress} />
        </div>
    );
}
