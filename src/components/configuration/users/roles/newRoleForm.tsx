import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { newRole } from "@/lib/configuration/roles";
import { PermissionSchemaType, RoleSchemaType } from "@/lib/configuration/schemas";
import UseCompanyStore from "@/store/company.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const NewRoleSchema = z.object({
    name: z.string().min(1, { message: "Tienes que completar este campo!" }).min(3, { message: "El nombre del rol debe tener al menos 3 caracteres!" }),
});

type Schema = z.infer<typeof NewRoleSchema>

type Props = {
    role: RoleSchemaType,
    isEditting?: boolean,
    viewRoleId?: string,
    emptyRoleId?: string,
    roleAdded: () => void
}

export function NewRoleForm({ role, roleAdded, isEditting, viewRoleId, emptyRoleId }: Props) {
    const [open, setOpen] = useState(false);
    const companyStore = UseCompanyStore();
    const mutation = useMutation({ mutationFn: newRole })
    const form = useForm<z.infer<typeof NewRoleSchema>>({
        resolver: zodResolver(NewRoleSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (fields: Schema) => {
        const response = await mutation.mutateAsync({
            name: fields.name,
            permissions: role.permissions.filter((p: PermissionSchemaType) => p.hasPermission),
            companyId: companyStore.company?.id || ""
        });

        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            const { data } = response;
            setOpen(false);
            form.reset();
            roleAdded();

            console.log(data)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={!isEditting}>
                <Button
                    size="sm"
                    disabled={!isEditting}
                    className="text-xs h-6">
                    {viewRoleId == emptyRoleId
                        ? 'Guradar'
                        : 'Guardar como nuevo rol'
                    }
                </Button>
            </DialogTrigger>
            {/* create a new role, add name */}
            <DialogContent className="w-1/4">
                {mutation.isPending &&
                    <div className="w-full h-full bg-white/60 flex justify-center items-center absolute">
                        <LoadingIndicator />
                    </div>
                }
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle>Guardar nuevo Rol</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-3">
                    <FormProvider {...form}>
                        <form>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='roleName'>Nombre del rol</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Administrador" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full flex justify-end gap-2 mt-4 mb-6">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancelar</Button>
                                </DialogClose>
                                <Button onClick={form.handleSubmit(onSubmit)}>Guardar</Button>
                            </div>
                            {mutation.isError && <p>{mutation.error.message}</p>}
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>

    )
}