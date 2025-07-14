import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import React from "react";

export function SheetWithConfirm({
    open,
    onOpenChange,
    children,
    confirmTitle = "¿Seguro que quieres salir?",
    confirmMessage = "Se perderán los cambios no guardados.",
    ...props
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    confirmTitle?: string;
    confirmMessage?: string;
    [key: string]: unknown;
}) {
    const [showConfirm, setShowConfirm] = useState(false);
    const shouldConfirm = useRef(false);

    // Handler for outside click
    const handleInteractOutside = (event: Event) => {
        event.preventDefault(); // Prevent closing
        shouldConfirm.current = true;
        setShowConfirm(true);
    };

    // Handler for open state change
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && shouldConfirm.current) {
            // Don't close, show dialog instead
            shouldConfirm.current = false;
            return;
        }
        onOpenChange(isOpen);
    };

    // Handler for dialog actions
    const handleDialogCancel = () => {
        setShowConfirm(false);
        shouldConfirm.current = false;
    };
    const handleDialogConfirm = () => {
        setShowConfirm(false);
        shouldConfirm.current = false;
        onOpenChange(false);
    };

    // Inject onInteractOutside into the actual SheetContent component
    const enhancedChildren = React.Children.map(children, child => {
        if (
            React.isValidElement(child) &&
            child.type === SheetContent
        ) {
            // @ts-expect-error: onInteractOutside is valid for SheetContent
            return React.cloneElement(child, { onInteractOutside: handleInteractOutside });
        }
        return child;
    });

    return (
        <>
            <Sheet open={open} onOpenChange={handleOpenChange} {...props}>
                {enhancedChildren}
            </Sheet>
            {showConfirm && (
                <Dialog open onOpenChange={handleDialogCancel}>
                    <DialogContent className="w-1/4 mx-w-1/4 sm:max-w-1/4 p-5" onInteractOutside={handleInteractOutside}>
                        <DialogTitle>{confirmTitle}</DialogTitle>
                        <p>{confirmMessage}</p>
                        <DialogFooter className="w-full flex justify-center gap-1 [&>*]:w-1/2 pt-4">
                            <Button variant="secondary" onClick={handleDialogCancel}>No, continuar</Button>
                            <Button variant="destructive" onClick={handleDialogConfirm}>Sí, salir</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}