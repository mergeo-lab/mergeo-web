import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const NewNameSchema = z.object({
    name: z.string().min(1, { message: "Tienes que completar este campo!" }).min(3, { message: "El nombre debe tener al menos 3 caracteres!" }),
});

type Schema = z.infer<typeof NewNameSchema>

type MutationFn<T> = (args: T) => Promise<void>;

type Props<T> = {
    dialogTitle: string,
    id: string | null | undefined,
    name: string | null | undefined,
    triggerButton?: React.ReactNode,
    onLoading: () => void
    callback: () => void,
    mutationFn: MutationFn<T>,
}

export default function EditNameDialog<T>({ dialogTitle, id, name, triggerButton, onLoading, callback, mutationFn }: Props<T>) {
    const mutation = useMutation({ mutationFn: mutationFn });
    const [open, setOpen] = useState(false);
    const initialValues = {
        name: name || "",
    };

    const form = useForm<Schema>({
        resolver: zodResolver(NewNameSchema),
        disabled: mutation.isPending,
        defaultValues: initialValues
    })

    const currentValues = form.watch();

    const isDirty = Object.keys(initialValues).some((key) => {
        const typedKey = key as keyof Schema; // Explicitly cast the key
        return currentValues[typedKey] !== initialValues[typedKey];
    });


    useEffect(() => {
        if (name) {
            form.setValue("name", name);
        }
    }, [form, name]);

    async function onSubmit(fields: Schema) {
        onLoading();
        await mutation.mutateAsync({ id, name: fields.name } as T);

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
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-1/4">
                {mutation.isPending &&
                    <div className="w-full h-full bg-white/60 flex justify-center items-center absolute">
                        <LoadingIndicator />
                    </div>
                }
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-3">
                    <FormProvider {...form}>
                        <form>
                            <FormField
                                control={form.control}
                                name="name"
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
                            <div className="w-full flex justify-end gap-2 mt-4 mb-6">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancelar</Button>
                                </DialogClose>
                                <Button disabled={!isDirty} onClick={form.handleSubmit(onSubmit)}>Guardar</Button>
                            </div>
                            {mutation.isError && <p>{mutation.error.message}</p>}
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
}