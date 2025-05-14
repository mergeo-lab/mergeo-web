import { ManageRoles } from "@/components/configuration/users/roles/manageRoles";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { NewUserSchemaType, NewUserSchema } from "@/lib/schemas";
import { addUser } from "@/lib/configuration/users";
import UseCompanyStore from "@/store/company.store";
import UseRoleStore from "@/store/roles.store";
import UseUserStore from "@/store/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import { JSX, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormSchemaType = Omit<NewUserSchemaType, 'id' | 'companyId'>

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    callback: () => void
    triggerButton?: React.ReactNode
}

export function AddUserSheet({
    title = "Agregar un usuario",
    subTitle = "Agrega un nuevo usuario para poder compartir la cuenta",
    icon = <UserRoundPlus size={20} />,
    callback,
    triggerButton }: Props) {
    const roleStore = UseRoleStore();
    const { company } = UseCompanyStore();
    const { user } = UseUserStore();
    const mutation = useMutation({ mutationFn: addUser })
    const [open, setOpen] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(NewUserSchema),
        disabled: mutation.isPending,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    })

    const handleCancel = useCallback(() => {
        roleStore.removeAllRoles();
        form.reset();
    }, [roleStore, form]);


    useEffect(() => {
        if (form.formState.isDirty) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [form.formState.isDirty]);


    const closeModal = useCallback(() => {
        // Close the modal
        handleCancel()
        setOpen(false);
    }, [handleCancel]);

    const onSubmit = async (fields: FormSchemaType) => {
        if (!canSubmit) return;

        if (user?.id && company?.id) {
            console.log(roleStore.roles)
            const formData = { ...fields, roles: roleStore.roles };
            const payload = {
                id: user?.id,
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
