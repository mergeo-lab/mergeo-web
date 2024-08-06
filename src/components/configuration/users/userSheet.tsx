import { ManageRoles } from "@/components/configuration/users/roles/manageRoles";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { NewUserSchemaType, NewUserSchema, UserSchemaType, RoleSchemaType } from "@/lib/configuration/schema";
import { addUser, editUser } from "@/lib/configuration/users";
import { arraysAreEqual, splitFullName } from "@/lib/utils";
import UseCompanyStore from "@/store/company.store";
import UseRoleStore from "@/store/roles.store";
import UseUserStore from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormSchemaType = Omit<NewUserSchemaType, 'id' | 'companyId'>

type Props = {
    userId?: string,
    isEdit?: boolean,
    data?: UserSchemaType,
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    callback: () => void
    triggerButton?: React.ReactNode
}

export function UserSheet({
    userId,
    data,
    isEdit = false,
    title = "Agregar un usuario",
    subTitle = "Agrega un nuevo usuario para poder compartir la cuenta",
    icon = <UserRoundPlus size={20} />,
    callback,
    triggerButton }: Props) {
    const roleStore = UseRoleStore();
    const { company } = UseCompanyStore();
    const { user } = UseUserStore();
    const mutation = useMutation({ mutationFn: data ? editUser : addUser })
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
        if (open && isEdit && data) {
            roleStore.addRoles(data.roles);
        } else {
            roleStore.removeAllRoles();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, form, open]);

    useEffect(() => {
        if (form.formState.isDirty) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.formState.isDirty]);

    useEffect(() => {
        if (isEdit && data) {
            const rolesHaveChanged = !arraysAreEqual(roleStore.roles, data.roles);

            if (rolesHaveChanged) {
                setCanSubmit(true);
            } else {
                setCanSubmit(false);

            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleStore.roles]);

    const checkFieldsValues = useCallback(() => {
        const fields = form.getValues();
        const editedFields: FormSchemaType & { roles?: string[] } = {
            firstName: "",
            lastName: "",
            email: "",
            roles: [],
        };
        if (isEdit && data) {

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

            if (rolesHaveChanged) {
                const newRoles = roleStore.roles.map((role: RoleSchemaType) => role.id);
                editedFields.roles = newRoles;
            } else {
                delete editedFields.roles;
            }

        }
        return editedFields;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, isEdit, data, open, roleStore.roles]);

    useEffect(() => {
        checkFieldsValues();
    }, [checkFieldsValues, roleStore.roles]);

    const onSubmit = async (fields: FormSchemaType) => {
        if (!canSubmit) return;

        if (!isEdit && roleStore.roles.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Debe agregar al menos un rol",
            })
            return;
        }

        if (user?.id && company?.id) {
            const editedFields = checkFieldsValues();
            const formData = isEdit ? { ...editedFields } : { ...fields };
            const payload = {
                id: isEdit ? userId || "" : user?.id,
                companyId: company?.id,
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
        <Sheet open={open} onOpenChange={setOpen}>
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
                                    <ManageRoles />
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
