import { ManageRoles } from "@/components/configuration/users/roles/manageRoles";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { InviteUserSchemaType, InviteUserSchema } from "@/lib/schemas";
import UseCompanyStore from "@/store/company.store";
import UseRoleStore from "@/store/roles.store";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuUserRoundPlus } from "react-icons/lu";
import { JSX, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SheetWithConfirm } from "@/components/SheetWithConfirm";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";

type FormSchemaType = InviteUserSchemaType

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    callback: () => void
    triggerButton?: React.ReactNode
}

export function AddUserSheet({
    title = "Invitar un usuario",
    subTitle = "Envía una invitación por email para que el usuario pueda unirse a la cuenta",
    icon = <LuUserRoundPlus size={20} />,
    callback,
    triggerButton }: Props) {
    const roleStore = UseRoleStore();
    const { company } = UseCompanyStore();
    const { account, inviteUser, loading } = useAuth();
    const [open, setOpen] = useState(false);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(InviteUserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
        mode: 'onChange',
    })

    const handleCancel = useCallback(() => {
        roleStore.removeAllRoles();
        form.reset();
    }, [roleStore, form]);

    const closeModal = useCallback(() => {
        handleCancel();
        setOpen(false);
    }, [handleCancel]);

    const onSubmit = async (fields: FormSchemaType) => {
        if (account?.user?.id && company?.id) {
            const formData = {
                email: fields.email,
                firstName: fields.firstName,
                lastName: fields.lastName,
                roles: roleStore.roles,
                companyId: company.id
            };

            const response = await inviteUser(formData);
            if (response.error) {
                // Error is already handled by the AuthContext
            } else if (response.data) {
                callback();
                handleCancel();
                setOpen(false);
            }
        }
    }

    return (
        <SheetWithConfirm open={open} onOpenChange={(isOpen) => {
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
                {loading && <OverlayLoadingIndicator />}
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
                        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='name'>Nombre *</FormLabel>
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
                                        <FormLabel id='lastName'>Apellido *</FormLabel>
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
                                        <FormLabel id='email'>Email *</FormLabel>
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
                            <SheetFooter className="p-10 items-center">
                                <SheetClose className="w-full">
                                    <Button variant="secondary" className="w-full" onClick={handleCancel}>Cancelar</Button>
                                </SheetClose>
                                <Button disabled={!form.formState.isValid} type="submit" className="w-full">Enviar Invitación</Button>
                            </SheetFooter>
                        </form>
                    </div>
                </FormProvider>
            </SheetContent>
        </SheetWithConfirm>
    )
}
