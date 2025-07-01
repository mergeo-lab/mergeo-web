import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TbReplace } from "react-icons/tb";
import { useState, useEffect } from "react";
import { ProductSchemaType } from "@/lib/schemas";
import { ReplacementCriteria } from "@/lib/constants";
import { ReplacementCriteriaSelector } from "./ReplacementCriteriaSelector";

interface ReplacementDialogProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductSchemaType;
    onChange: (productId: string, replacementCriteria: ReplacementCriteria) => void;
    onRemoveReplacement?: (productId: string) => void;
    currentReplacement?: ReplacementCriteria;
}

export function ReplacementDialog({
    isOpen,
    onClose,
    product,
    onChange,
    onRemoveReplacement,
    currentReplacement
}: ReplacementDialogProps) {
    const [selectedOption, setSelectedOption] = useState<ReplacementCriteria>(
        currentReplacement || ReplacementCriteria.NO_REPLACEMENT
    );

    // Reset selectedOption when dialog opens or currentReplacement changes
    useEffect(() => {
        setSelectedOption(currentReplacement || ReplacementCriteria.NO_REPLACEMENT);
    }, [isOpen, currentReplacement]);

    const handleApply = () => {
        console.log('[ReplacementDialog] handleApply called with:', selectedOption);
        onChange(product.id, selectedOption);
        onClose();
    };

    const handleCancel = () => {
        setSelectedOption(currentReplacement || ReplacementCriteria.NO_REPLACEMENT);
        onClose();
    };

    const handleUseConfigDate = () => {
        console.log('[handleUseConfigDate] called for product:', product.id);
        if (onRemoveReplacement) {
            console.log('[handleUseConfigDate] calling onRemoveReplacement');
            onRemoveReplacement(product.id);
        } else {
            console.log('[handleUseConfigDate] onRemoveReplacement is not provided');
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-4">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TbReplace size={20} />
                        Criterio de reemplazo
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona el criterio de reemplazo para: <strong>{product.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <ReplacementCriteriaSelector
                        value={selectedOption}
                        onValueChange={setSelectedOption}
                        className="p-5 pb-0"
                    />

                    {currentReplacement && (
                        <Button variant="link" onClick={handleUseConfigDate}>
                            Usar criterio de la configuración
                        </Button>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button onClick={handleApply}>
                            Aplicar
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}