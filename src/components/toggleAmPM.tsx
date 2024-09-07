import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
    defaultTime: "am" | "pm",
    className?: string,
    onChange: (isAm: string) => void
}

export default function ToggleAmPM({ defaultTime, className, onChange }: Props) {
    const defaultBool = defaultTime === "am" ? true : false
    const [isAm, setIsAm] = useState(defaultBool);

    function toggle() {
        setIsAm(!isAm);
        onChange(!isAm ? 'am' : "pm");
    }
    return (
        <div
            className={cn("text-sm font-medium cursor-pointer rounded w-10 h-10 p-4 flex justify-center items-center", className, {
                'bg-slate-200': isAm,
                'bg-slate-600 text-white': !isAm
            })}
            onClick={toggle}>
            {isAm ? 'AM' : 'PM'}
        </div>
    )
}