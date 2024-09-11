import { NewDropZone } from "@/components/configuration/provider/dropZone/newDropZone";
import DaysPicker from "@/components/daysPicker";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { newDropZone } from "@/lib/configuration/dropZone";
import { DropZoneSchema, DropZoneSchemaType } from "@/lib/configuration/schemas/dropZone.schemas";
import { PickUpSchedulesSchemaType } from "@/lib/configuration/schemas/pickUp.schema";
import useDaysPickerStore from "@/store/daysPicker.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    isEditing: boolean,
    onLoading?: () => void,
    callback: () => void
    triggerButton?: React.ReactNode
}

export function DropZoneSheet({
    title = "Agregar una zona de entrega",
    subTitle = "Aquí puedes agregar una nueva zona de entrega, los dias y horarios",
    icon = <UserRoundPlus size={20} />,
    companyId,
    isEditing,
    onLoading,
    callback,
    triggerButton }: Props) {
    const mutation = useMutation({ mutationFn: newDropZone })
    const [open, setOpen] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const { daysAndTime } = useDaysPickerStore();

    const form = useForm<DropZoneSchemaType>({
        resolver: zodResolver(DropZoneSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
            schedules: [],
            address: {
                name: "",
                polygon: {
                    coordinates: [],
                    type: "Point",
                },
            },
        },
    })

    useEffect(() => {
        if (form.formState.isDirty) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.formState.isDirty]);


    const closeModal = useCallback(() => {
        // Close the modal
        handleCancel()
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (fields: DropZoneSchemaType) => {
        if (!canSubmit || !companyId) return;
        onLoading && onLoading();
        console.log("fields", fields)
        await mutation.mutateAsync({ companyId: companyId, body: fields });

        if (mutation.isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: mutation.error.message,
            })
        } else {
            form.reset();
            setOpen(false);
            callback();
        }
    }

    function setSelectedDays(schedules: PickUpSchedulesSchemaType[]) {
        console.log("schedules", schedules)
        form.setValue('schedules', schedules);
    }

    function handleCancel() {
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
            <SheetTrigger disabled={!isEditing} className="pt-2 w-full">
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
                            <FormField
                                control={form.control}
                                name="schedules"
                                render={() => (
                                    <FormItem>
                                        <FormLabel id='schedules'>Dias y Horarios</FormLabel>
                                        <FormControl>
                                            <DaysPicker
                                                isEditing={true}
                                                callback={() => setSelectedDays(daysAndTime)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel id='roles'>Zonas de entrega</FormLabel>
                                <FormControl>
                                    <NewDropZone
                                        companyId={""}
                                        triggerButton={<Button disabled={!isEditing} className="px-5 w-full" type="button" size='sm'>Agregar zona en mapa</Button>}
                                        callback={function (): void {
                                            throw new Error("Function not implemented.");
                                        }}
                                        onLoading={function (): void {
                                            throw new Error("Function not implemented.");
                                        }}
                                    />
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
