import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { roleDelete } from "@/lib/configuration/roles";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
    roleId: string,
    roleName: string,
    roleDeleted: () => void
}

export function DeleteRole({ roleId, roleName, roleDeleted }: Props) {
    const mutation = useMutation({ mutationFn: roleDelete });
    const [open, setOpen] = useState(false);

    async function deleteRole() {
        const response = await mutation.mutateAsync({ roleId: roleId });

        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            roleDeleted();
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="h-6">
                <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs h-6"
                >
                    Borrar
                </Button>
            </DialogTrigger>

            <DialogContent className="w-1/4">
                {mutation.isPending &&
                    <div className="w-full h-full bg-white/60 flex justify-center items-center absolute">
                        <LoadingIndicator />
                    </div>
                }
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle>Borrar Rol</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-3">
                    <p>Estas seguro que quieres borrar el rol <span className="font-bold">{roleName}</span>?</p>
                    <div className="mt-4 w-full flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="destructive" onClick={deleteRole}>Eliminar</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}