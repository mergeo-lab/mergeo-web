import { ReplacementCriteria } from "@/lib/constants";
import { getReplacementCriteriaLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ReplacementCriteriaBadgeProps {
    criteria: ReplacementCriteria | undefined;
    className?: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    size?: 'sm' | 'default';
}

export function ReplacementCriteriaLabel({
    criteria,
    className,
}: ReplacementCriteriaBadgeProps) {
    if (!criteria) return null;

    const label = getReplacementCriteriaLabel(criteria);

    return (
        <div
            className={cn(
                "text-[10px] font-medium text-highlight",
                className
            )}
        >
            {label}
        </div>
    );
}