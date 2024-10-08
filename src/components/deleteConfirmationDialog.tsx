import React from "react";
import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";

type MutationFn<T> = (args: T) => Promise<void>;

type Props<T> = {
    id: string | null | undefined,
    name: string | null | undefined,
    title: string,
    question: string,
    triggerButton?: React.ReactNode,
    openDialog?: boolean,
    onLoading: () => void
    mutationFn: MutationFn<T>,
    callback: () => void,
    onClose?: () => void,
    otherMutationProp?: unknown,
}

function DeleteConfirmationDialogComponent<T>({ id, name, title, question, triggerButton, openDialog, otherMutationProp, onLoading, mutationFn, callback, onClose }: Props<T>) {
    const mutation = useMutation({ mutationFn: mutationFn });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        openDialog && setOpen(openDialog);
    }, [openDialog]);

    const onOpenChange = useCallback((open: boolean) => {
        setOpen(open);

        if (!open) {
            onClose && onClose();
        }
    }, [onClose]);

    const remove = useCallback(async () => {
        onLoading();

        if (otherMutationProp) {
            await mutation.mutateAsync({ id, otherMutationProp } as T);
        } else {
            await mutation.mutateAsync({ id } as T);
        }

        if (mutation.isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: mutation.error.message,
            })

        } else {
            setOpen(false);
            callback();
        }
    }, [onLoading, mutation, id, otherMutationProp, callback]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {triggerButton &&
                <DialogTrigger className="h-6">
                    {triggerButton}
                </DialogTrigger>
            }
            <DialogContent className="w-1/4">
                {mutation.isPending &&
                    <div className="w-full h-full bg-white/60 flex justify-center items-center absolute">
                        <LoadingIndicator />
                    </div>
                }
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-3">
                    <p>{question} <span className="font-bold">{name}</span>?</p>
                    <div className="mt-4 w-full flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="destructive" onClick={remove}>Eliminar</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const DeleteConfirmationDialog = React.memo(DeleteConfirmationDialogComponent);
