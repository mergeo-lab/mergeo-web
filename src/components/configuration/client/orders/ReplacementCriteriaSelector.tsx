import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReplacementCriteria, ReplacementCriteriaValues } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ReplacementCriteriaSelectorProps {
    value: ReplacementCriteria;
    onValueChange: (value: ReplacementCriteria) => void;
    className?: string;
    showDescription?: boolean;
    disabled?: boolean;
}

export function ReplacementCriteriaSelector({
    value,
    onValueChange,
    className,
    showDescription = false,
    disabled = false
}: ReplacementCriteriaSelectorProps) {
    return (
        <div className={cn("space-y-3", className)}>
            <RadioGroup
                value={value}
                onValueChange={(newValue) => onValueChange(newValue as ReplacementCriteria)}
                disabled={disabled}
                className="flex flex-col gap-3"
            >
                {Object.entries(ReplacementCriteriaValues).map(([key, item]) => (
                    <div key={item.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={item.value} id={key} />
                        <Label htmlFor={key} className="text-sm">{item.label}</Label>
                    </div>
                ))}
            </RadioGroup>

            {showDescription && (
                <div className="text-sm text-muted-foreground font-light pt-2 border-t">
                    En el caso que el producto seleccionado no se encuentre en stock o el proveedor no acepte la orden de compra.
                </div>
            )}
        </div>
    );
} 