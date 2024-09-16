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
import useZoneStore from "@/store/zone.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Map, UserRoundPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MapPinned } from "lucide-react";

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
    const [selectedZone, setSelectedZone] = useState<google.maps.LatLngLiteral[]>([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const { daysAndTime } = useDaysPickerStore();
    const { removeZone } = useZoneStore();

    const form = useForm<DropZoneSchemaType>({
        resolver: zodResolver(DropZoneSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
            schedules: [],
            zones: [],
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
        setSelectedZone([]);
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
        removeZone();
        form.reset();
    }

    function addDropZone() {
        console.log('selectedZone', selectedZone)
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
                    <div className="rounded border p-5 mt-5 h-fit">
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
                            <FormItem className="flex justify-center">
                                <FormControl>
                                    <NewDropZone
                                        companyId={""}
                                        triggerButton={
                                            <Button
                                                variant={selectedZone.length ? "outline" : "secondary"}
                                                disabled={!isEditing}
                                                className="w-full space-x-2 text-md font-black p-8" type="button">
                                                <Map size={30} />
                                                <p className="uppercase">{
                                                    selectedZone.length
                                                        ? "Editar zona en el mapa"
                                                        : "Dibujar zona en el mapa"
                                                }
                                                </p>
                                            </Button>
                                        }
                                        addZone={(zone) => setSelectedZone(zone)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <div className="w-full border-t flex justify-end pt-4">
                                <Button
                                    onClick={addDropZone}
                                    disabled={!isEditing}
                                    className="w-fit space-x-2 px-14"
                                    type="button"
                                >
                                    <MapPinned />
                                    <p>Agregar Zona de entrega</p>
                                </Button>
                            </div>
                        </form>
                    </div>
                    <SheetFooter className="w-full p-10 items-center absolute bottom-0">
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
