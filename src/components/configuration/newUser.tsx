import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { NewUserSchemaType, NewUserSchema } from "@/lib/configuration/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";


export function NewUser() {
    const { toast } = useToast();
    const userMutation = useMutation({
        mutationFn: () => new Promise(() => { })
    });

    const form = useForm<NewUserSchemaType>({
        resolver: zodResolver(NewUserSchema),
        disabled: userMutation.isPending,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            position: "",
            roles: [],
        },
    })

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant='outline' className='min-w-[200px] flex gap-2'>
                    <span>
                        Agregar un usuario
                    </span>
                    <UserRoundPlus size={18} />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-1/3 mx-w-1/3 sm:max-w-1/3">
                <SheetHeader>
                    <SheetTitle className="flex gap-2 items-center">
                        <UserRoundPlus size={22} />
                        Agregar un usuario
                    </SheetTitle>
                    <SheetDescription>
                        Agrega un nuevo usuario para poder compartir la cuenta
                    </SheetDescription>
                </SheetHeader>
                <div className="h-4/5 p-10">
                    <FormProvider {...form}>
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
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='position'>Cargo</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </FormProvider>
                </div>
                <SheetFooter className="p-10 items-center">
                    <SheetClose className="w-full">
                        <Button variant="secondary" className="w-full">Cancelar</Button>
                    </SheetClose>
                    <Button className="w-full">Guardar</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
