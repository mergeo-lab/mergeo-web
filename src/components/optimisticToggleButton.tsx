import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useQueryClient, useMutation, QueryKey } from "@tanstack/react-query";
import React from "react";

interface OptimisticToggleButtonProps<T> {
    itemId: T;
    defaultState?: boolean;
    onToggle: (itemId: T, newState: boolean) => Promise<void>;
    activeIcon: React.ReactNode;
    inactiveIcon: React.ReactNode;
    disabled?: boolean;
    tooltip?: string;
}

interface ToggleContext {
    previousState?: boolean;
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
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ['toggleState', itemId]; // itemId must be serializable (string, number, etc.)

    // Use mutation with optimistic updates
    const mutation = useMutation<void, Error, boolean, ToggleContext>({
        mutationFn: (newState: boolean) => onToggle(itemId, newState),
        onMutate: async (newState: boolean) => {
            await queryClient.cancelQueries({ queryKey }); // correct usage for v4

            const previousState = queryClient.getQueryData<boolean>(queryKey);
            queryClient.setQueryData(queryKey, newState);

            return { previousState }; // typed via ToggleContext
        },
        onError: (_err, _newState, context) => {
            if (context?.previousState !== undefined) {
                queryClient.setQueryData(queryKey, context.previousState);
            }
        },
    });

    // Get current state from cache or fallback to defaultState
    const optimisticState = queryClient.getQueryData<boolean>(['toggleState', itemId]) ?? defaultState;

    async function handleClick() {
        if (disabled) return;
        mutation.mutate(!optimisticState);
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={cn({ "cursor-default": disabled })}>
                    <Button
                        disabled={disabled || mutation.isPending}
                        variant="ghost"
                        onClick={handleClick}
                        className={cn("p-0 m-0 w-12", {
                            "text-muted/50": disabled || mutation.isPending,
                        })}
                    >
                        {optimisticState ? activeIcon : inactiveIcon}
                    </Button>
                </TooltipTrigger>
                {!disabled && <TooltipContent>{tooltip}</TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    );
}
