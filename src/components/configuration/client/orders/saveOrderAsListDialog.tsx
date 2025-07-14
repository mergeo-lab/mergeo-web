import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { ProductWithQuantity } from "@/store/search.store";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSaveList: (listName: string) => Promise<void>;
    onSkipList: () => Promise<void>;
    _products: ProductWithQuantity[];
    _userName: string;
    isProcessing: boolean;
}

export function SaveOrderAsListDialog({
    isOpen,
    onClose,
    onSaveList,
    onSkipList,
    isProcessing
}: Props) {
    const [listName, setListName] = useState('');
    const [saveListChoice, setSaveListChoice] = useState<'yes' | 'no' | null>(null);

    const handleSaveListChoice = async (choice: 'yes' | 'no') => {
        console.log('handleSaveListChoice called with:', choice);
        setSaveListChoice(choice);

        if (choice === 'no') {
            // Skip list saving
            console.log('Calling onSkipList...');
            await onSkipList();
        }
        // If choice is 'yes', the dialog will show the input field
    };

    const handleSaveList = async () => {
        console.log('handleSaveList called with listName:', listName);
        if (!listName.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor ingrese un nombre para la lista",
            });
            return;
        }

        try {
            console.log('Calling onSaveList...');
            await onSaveList(listName);
        } catch (error: unknown) {
            console.error('Error saving list:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Error al guardar la lista. Inténtelo de nuevo.",
            });
        }
    };

    const handleClose = () => {
        onClose();
        setListName('');
        setSaveListChoice(null);
    };

    // Show processing state
    if (isProcessing) {
        return (
            <Dialog open={isOpen}>
                <DialogContent className="sm:max-w-md p-5">
                    <DialogHeader>
                        <DialogTitle className="flex gap-2 items-center">
                            <LuClipboardList size={20} />
                            Procesando pedido...
                        </DialogTitle>
                        <DialogDescription>
                            Su pedido se está procesando. Por favor espere...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center items-center py-8">
                        <OverlayLoadingIndicator />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-5">
                <DialogHeader>
                    <DialogTitle className="flex gap-2 items-center">
                        <LuClipboardList size={20} />
                        ¿Guardar como lista?
                    </DialogTitle>
                    <DialogDescription>
                        ¿Te gustaría guardar este pedido como una lista para futuras compras?
                    </DialogDescription>
                </DialogHeader>

                {saveListChoice === 'yes' ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="listName">Nombre de la lista</Label>
                            <Input
                                id="listName"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                placeholder="Ej: Lista de compras semanal"
                                disabled={isProcessing}
                            />
                        </div>
                    </div>
                ) : saveListChoice === null ? (
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={() => handleSaveListChoice('yes')}
                            className="flex-1"
                            disabled={isProcessing}
                        >
                            Sí, guardar
                        </Button>
                        <Button
                            onClick={() => handleSaveListChoice('no')}
                            variant="secondary"
                            className="flex-1"
                            disabled={isProcessing}
                        >
                            No, continuar
                        </Button>
                    </div>
                ) : null}

                {saveListChoice === 'yes' && (
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setSaveListChoice(null);
                                setListName('');
                            }}
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveList}
                            disabled={!listName.trim() || isProcessing}
                        >
                            Guardar lista
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}