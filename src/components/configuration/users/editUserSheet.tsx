import { ManageRoles } from "@/components/configuration/users/roles/manageRoles";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { NewUserSchemaType, NewUserSchema, UserSchemaType, RoleSchemaType } from "@/lib/configuration/schemas";
import { editUser } from "@/lib/configuration/users";
import { arraysAreEqual, splitFullName } from "@/lib/utils";
import UseRoleStore from "@/store/roles.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import React from "react"; // Import React to use React.memo

type FormSchemaType = Omit<NewUserSchemaType, 'id' | 'companyId'>

type Props = {
    userId?: string,
    data?: UserSchemaType,
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    callback: () => void
    triggerButton?: React.ReactNode
}

// Use React.memo to optimize ManageRoles
const MemoizedManageRoles = React.memo(ManageRoles);

export function EditUserSheet({
    userId,
    data,
    title = "Agregar un usuario",
    subTitle = "Agrega un nuevo usuario para poder compartir la cuenta",
    icon = <UserRoundPlus size={20} />,
    callback,
    triggerButton }: Props) {
    const roleStore = UseRoleStore();
    const mutation = useMutation({ mutationFn: editUser })
    const [open, setOpen] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(NewUserSchema),
        disabled: mutation.isPending,
        defaultValues: {
            firstName: data ? splitFullName(data.name).firstName : "",
            lastName: data ? splitFullName(data.name).lastName : "",
            email: data ? data.email : "",
        },
    })

    useEffect(() => {
        if (open && data) {
            roleStore.addRoles(data.roles);
        } else {
            roleStore.removeAllRoles();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, form, open]);

    useEffect(() => {
        if (!data) return;
        const rolesHaveChanged = !arraysAreEqual(roleStore.roles, data.roles);

        if (form.formState.isDirty || rolesHaveChanged) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.formState.isDirty, roleStore.roles, data]);

    const closeModal = useCallback(() => {
        // Close the modal
        handleCancel()
        setOpen(false);
    }, []);

    const checkFieldsValues = useCallback(() => {
        if (!data) return;
        const fields = form.getValues();
        const editedFields: FormSchemaType & { roles?: string[] } = {
            firstName: "",
            lastName: "",
            email: "",
            roles: [],
        };

        const rolesHaveChanged = !arraysAreEqual(roleStore.roles, data.roles);
        const { firstName, lastName } = splitFullName(data.name);

        if (fields.email !== data.email) {
            editedFields.email = fields.email;
        } else {
            delete editedFields.email;
        }

        if (fields.firstName !== firstName) {
            editedFields.firstName = fields.firstName;
        }
        else {
            delete editedFields.firstName;
        }

        if (fields.lastName !== lastName) {
            editedFields.lastName = fields.lastName;
        } else {
            delete editedFields.lastName;
        }
        console.log(rolesHaveChanged)
        if (rolesHaveChanged) {
            const newRoles = roleStore.roles.map((role: RoleSchemaType) => role.id);
            editedFields.roles = newRoles;
        } else {
            delete editedFields.roles;
        }

        return editedFields;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, data, open, roleStore.roles]);

    useEffect(() => {
        checkFieldsValues();
    }, [checkFieldsValues, roleStore.roles]);

    const onSubmit = async () => {
        if (!canSubmit) return;

        if (roleStore.roles.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Debe agregar al menos un rol",
            })
            return;
        }

        if (userId) {
            console.log(roleStore.roles)
            const editedFields = checkFieldsValues();
            const formData = { ...editedFields };
            const payload = {
                id: userId,
                fields: formData
            };

            const response = await mutation.mutateAsync(payload);

            if (response.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: response.error,
                })
            } else if (response.data) {
                callback();
                handleCancel();
                setOpen(false);
            }
        }
    }

    function handleCancel() {
        roleStore.removeAllRoles();
        form.reset();
    }

    return (
        <Sheet open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                closeModal();
            } else {
                setOpen(isOpen);
            }
        }}>
            <SheetTrigger>
                {triggerButton}
            </SheetTrigger>
            <SheetContent className="w-1/3 mx-w-1/3 sm:max-w-1/3">
                <FormProvider {...form}>
                    <SheetHeader>
                        <SheetTitle className="flex gap-2 items-center">
                            {icon}
                            {title}
                        </SheetTitle>
                        <SheetDescription>
                            {subTitle}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="h-4/5 p-10">
                        <form className='space-y-8'>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='name'>Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='lastName'>Apellido</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='email'>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel id='roles'>Rol de Usuario</FormLabel>
                                <FormControl>
                                    <MemoizedManageRoles />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </form>

                    </div>
                    <SheetFooter className="p-10 items-center">
                        <SheetClose className="w-full">
                            <Button variant="secondary" className="w-full" onClick={handleCancel}>Cancelar</Button>
                        </SheetClose>
                        <Button disabled={!canSubmit} onClick={form.handleSubmit(onSubmit)} type="submit" className="w-full">Guardar</Button>
                    </SheetFooter>
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}
