import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { createDiscountList } from "@/lib/discounts";
import { CreateDiscountSchema, CreateDiscountSchemaType } from "@/lib/schemas/discounts.schema";
import UseCompanyStore from "@/store/company.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdOutlineDiscount } from "react-icons/md";

type Props = {
    triggerButton?: React.ReactNode,
    data?: CreateDiscountSchemaType | null,
    callback?: () => void,
}

export default function NewDiscount({ triggerButton, data, callback }: Props) {
    const { getCompanyId } = UseCompanyStore();
    const companyId = getCompanyId();
    const [open, setOpen] = useState(false);
    const mutation = useMutation({ mutationFn: createDiscountList });

    const form = useForm<CreateDiscountSchemaType>({
        resolver: zodResolver(CreateDiscountSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: data?.name ?? '',
            description: data?.description ?? '',
            discount: data?.discount ?? 0,
        },
    })

    async function onSubmit(data: CreateDiscountSchemaType) {
        await mutation.mutateAsync({ companyId: companyId, body: data });
    }

    function handleOpen() {
        setOpen(!open);
    }

    useEffect(() => {
        if (mutation.isSuccess) {
            callback && callback()
            setOpen(false);
            form.reset();
            mutation.reset();
        }
    }, [mutation.isSuccess])

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent showClose={false} className="max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
                {mutation.isPending && <OverlayLoadingIndicator />}
                <DialogHeader className="border-b-[1px] border-border">
                    <DialogTitle className="text-md flex items-center gap-2 p-4">
                        <MdOutlineDiscount size={30} />
                        Nueva lista de descuentos
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 px-10 pb-5">

                    <FormProvider {...form}>
                        <div className="h-4/5">
                            <form className='space-y-4 mb-10'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='name'>Nombre</FormLabel>
                                            <FormControl>
                                                <Input{...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='description'>Descripción</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="border border-border rounded-md p-4">
                                    <FormField
                                        control={form.control}
                                        name="discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel id="discount">Descuento</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center space-x-4">
                                                        <Slider
                                                            max={100}
                                                            min={0}
                                                            step={1}
                                                            value={[field.value || 0]}
                                                            onValueChange={(val) => field.onChange(val[0])}
                                                        />
                                                        <span className="text-right w-10">{field.value ?? 0}%</span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </form>
                        </div>
                    </FormProvider>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="w-1/2" onClick={handleOpen}>Cancelar</Button>
                        <Button disabled={!form.formState.isValid} onClick={form.handleSubmit(onSubmit)} type="submit" className="w-1/2">Guardar</Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
