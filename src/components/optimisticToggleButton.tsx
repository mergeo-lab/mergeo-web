import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { startTransition, useState } from "react";

interface OptimisticToggleButtonProps<T> {
    itemId: T;
    defaultState?: boolean;
    onToggle: (itemId: T, newState: boolean) => Promise<void>;
    activeIcon: React.ReactNode;
    inactiveIcon: React.ReactNode;
    disabled?: boolean;
    tooltip?: string;
}

export function OptimisticToggleButton<T>({
    itemId,
    defaultState = false,
    onToggle,
    activeIcon,
    inactiveIcon,
    disabled,
    tooltip,
}: OptimisticToggleButtonProps<T>) {
    const [optimisticState, setOptimisticState] = useState(defaultState);

    function handleClick() {
        startTransition(() => {
            setOptimisticState((prev) => !prev);
        });

        onToggle(itemId, !optimisticState).catch(() => {
            // Optionally handle rollback on failure
            startTransition(() => {
                setOptimisticState(optimisticState); // Revert
            });
        });
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={cn({ "cursor-default": disabled })}>
                    <Button disabled={disabled} variant="ghost" onClick={handleClick} className={cn("p-0 m-0 w-12", {
                        "text-muted/50": disabled
                    })}>
                        {optimisticState ? activeIcon : inactiveIcon}
                    </Button>
                </TooltipTrigger>
                {!disabled &&
                    <TooltipContent>{tooltip}</TooltipContent>
                }
            </Tooltip>
        </TooltipProvider>
    );
}
