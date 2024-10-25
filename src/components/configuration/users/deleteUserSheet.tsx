import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { DeleteUserSchemaType, DeleteUserSchema, NewUserSchema, NewUserSchemaType, UserSchemaType } from "@/lib/schemas"
import { deleteUser } from "@/lib/configuration/users"
import { splitFullName } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Trash2, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

type Props = {
    userId: string
    userData: UserSchemaType
    title: string
    subTitle: string
    triggerButton?: React.ReactNode
    icon?: JSX.Element
    callback: () => void
}

export function DeleteUserSheet({ userId, userData, title, subTitle, triggerButton, icon, callback }: Props) {
    const [open, setOpen] = useState(false);
    const mutation = useMutation({ mutationFn: deleteUser })
    const [canSubmit, setCanSubmit] = useState(false);

    const form = useForm<NewUserSchemaType>({
        resolver: zodResolver(NewUserSchema),
        disabled: mutation.isPending,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    })

    const emailConfirmForm = useForm<DeleteUserSchemaType>({
        resolver: zodResolver(DeleteUserSchema),
        disabled: mutation.isPending,
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async () => {
        const response = await mutation.mutateAsync({ id: userId });
        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            setOpen(false);
            callback();
        }
    }

    function handleCancel() {
        form.reset();
    }

    useEffect(() => {
        if (userData) {
            const { firstName, lastName } = splitFullName(userData.name);
            form.reset({ email: userData.email, firstName, lastName });
        }
    }, [form, userData]);

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
                        <form className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='name'>Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
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
                                            <Input {...field} disabled />
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
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </form>
                        <div className="flex flex-col gap-2 mt-5 border border-destructive rounded p-10 space-y-3">
                            <div className="flex gap-3">
                                <TriangleAlert className="text-destructive" />
                                <h2 className="text-lg font-black">CUIDADO!</h2>
                            </div>
                            <p>Una vez que se haya confirmado esta acción, no podra deshacerse</p>
                            <FormProvider {...form}>

                                <FormField
                                    control={emailConfirmForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='email'>Escribe el mail del usuario para confirmar</FormLabel>
                                            <FormControl>
                                                <Input {...field} onChange={(e) => {
                                                    field.onChange(e);
                                                    setCanSubmit(e.target.value == userData?.email)
                                                }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    variant="destructive"
                                    disabled={!canSubmit}
                                    onClick={emailConfirmForm.handleSubmit(onSubmit)}
                                    type="submit"
                                    className="flex gap-3 w-2/3 self-center"
                                >
                                    <span>
                                        Borrar
                                    </span>
                                    <Trash2 size={18} />
                                </Button>
                            </FormProvider>
                        </div>

                    </div>
                    <SheetFooter className="p-10 items-center">
                        <SheetClose className="w-full">
                            <Button variant="secondary" className="w-full" onClick={handleCancel}>Cancelar</Button>
                        </SheetClose>
                    </SheetFooter>
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}