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
import { FilePenLine, Map, UserRoundPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MapPinned } from "lucide-react";
import UseDropZonesStore from "@/store/dropZones.store";
import DropZoneList from "@/components/configuration/provider/dropZone/dropZoneList";
import { ShowDropZoneMap } from "@/components/configuration/provider/dropZone/showDropZoneMap";
import LoadingIndicator from "@/components/loadingIndicator";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    isEditing?: boolean
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
    const [showMap, setShowMap] = useState<{ name: string, zone: google.maps.LatLngLiteral[], show: boolean }>({ name: "", zone: [], show: false });
    const [selectedZone, setSelectedZone] = useState<google.maps.LatLngLiteral[]>([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [editingDz, setEditingDz] = useState({ editing: false, id: "" });
    const { daysAndTime: schedules, removeAll: removeSchedules, addMultipleDaysAndTime } = useDaysPickerStore();
    const { dropZones, addDropZone, editDropZone, removeAllDropZones, getDropZoneById } = UseDropZonesStore();
    const { removeZone, setZone } = useZoneStore();

    const form = useForm<DropZoneSchemaType>({
        resolver: zodResolver(DropZoneSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
            schedules: [],
            zone: {
                polygon: {
                    type: "Poygon",
                    coordinates: []
                }
            },
        },
    })

    useEffect(() => {
        if (selectedZone) {
            form.setValue('zone', {
                polygon: {
                    type: "Poygon",
                    coordinates: selectedZone
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedZone]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const { name, schedules, zone } = value;
            if (name && schedules?.length && zone) {
                setCanSubmit(true);
            } else {
                setCanSubmit(false);
            }
        });

        // Clean up the subscription when the component unmounts
        return () => subscription.unsubscribe();
    }, [form]);



    const closeModal = useCallback(() => {
        // Close the modal
        handleCancel()
        setSelectedZone([]);
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const onSubmit = async () => {
    //     if (dropZones.length === 0 || !companyId) return;
    //     onLoading && onLoading();
    //     console.log("fields", dropZones)
    //     await mutation.mutateAsync({ companyId: companyId, body: dropZones });

    //     if (mutation.isError) {
    //         toast({
    //             variant: "destructive",
    //             title: "Error",
    //             description: mutation.error.message,
    //         })
    //     } else {
    //         form.reset();
    //         setOpen(false);
    //         callback();
    //     }
    // }

    function setSelectedDays(schedules: PickUpSchedulesSchemaType[]) {
        form.setValue('schedules', schedules);
    }

    function handleCancel() {
        removeZone();
        removeAllDropZones();
        form.setValue('name', "");
    }

    async function saveDropZone() {
        if (!companyId) return;
        if (!form.getValues().name || !form.getValues().schedules || !form.getValues().zone) return;
        const dzone = {
            name: form.getValues().name,
            schedules: form.getValues().schedules,
            zone: form.getValues().zone,
        }

        await mutation.mutateAsync({ companyId: companyId, body: dzone });
        onLoading && onLoading();

        if (mutation.isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: mutation.error.message,
            })
        } else {
            addDropZone(dzone);
            removeZone();
            removeSchedules();
            setSelectedZone([]);
            form.reset();
        }
    }

    function startEdit(id: string) {
        const dzone = getDropZoneById(id);
        if (!dzone) return;
        setEditingDz({ editing: true, id: id });
        setZone(dzone.zone.polygon.coordinates);
        setSelectedZone(dzone.zone.polygon.coordinates);
        removeSchedules();
        addMultipleDaysAndTime(dzone.schedules);
        form.reset(dzone);
    }

    function saveEdit() {
        if (!form.getValues().name || !form.getValues().schedules || !form.getValues().zone) return;
        const dzone = {
            name: form.getValues().name,
            schedules: form.getValues().schedules,
            zone: form.getValues().zone,
        }
        editDropZone(editingDz.id, dzone);
        cancelEdit();
    }

    function cancelEdit() {
        form.setValue('name', "");
        setEditingDz({ editing: false, id: "" });
        setZone([]);
        setSelectedZone([]);
        removeSchedules();
    }

    function handleShowMap(id: string) {
        console.log("handleShowMap", showMap);
        const zone = getDropZoneById(id);
        if (!zone) return;
        setShowMap({ name: zone.name, zone: zone?.zone.polygon.coordinates, show: true });
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
                {mutation.isPending && <LoadingIndicator />}
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
                                                callback={() => setSelectedDays(schedules)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem className="flex justify-center">
                                <FormControl>
                                    <NewDropZone
                                        title="Dibuja una zona en el mapa"
                                        subTitle="Agrega una nueva zona de reparto"
                                        companyId={""}
                                        triggerButton={
                                            <Button
                                                variant={selectedZone.length ? "outline" : "secondary"}
                                                className="w-fit space-x-2 text-md font-black p-6 rounded-md" type="button">
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
                                {
                                    editingDz.editing ?
                                        (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => cancelEdit()}
                                                    className="w-fit space-x-2 px-14"
                                                    type="button"
                                                >
                                                    <p>Cancelar</p>
                                                </Button>
                                                <Button
                                                    onClick={() => saveEdit()}
                                                    disabled={!canSubmit}
                                                    className="w-fit space-x-2 px-14"
                                                    type="button"
                                                >
                                                    <FilePenLine />
                                                    <p>Guardar cambios</p>
                                                </Button>
                                            </div>
                                        )
                                        : (
                                            <Button
                                                onClick={saveDropZone}
                                                disabled={!canSubmit}
                                                className="w-fit space-x-2 px-14"
                                                type="button"
                                            >
                                                <MapPinned />
                                                <p>Agregar Zona de entrega</p>
                                            </Button>

                                        )
                                }
                            </div>
                        </form>
                    </div>
                    <ShowDropZoneMap
                        title={`Zona seleccionada para ${showMap.name}`}
                        subTitle="Aqui puedes ver la zona de entrega"
                        showDialog={showMap.show}
                        zone={showMap.zone}
                        onClose={() => setShowMap({ name: "", zone: [], show: false })}
                    />
                    <DropZoneList
                        list={dropZones}
                        isEditing={editingDz.id}
                        startEditing={startEdit}
                        handleShowMap={(id: string) => handleShowMap(id)}
                    />
                    <SheetFooter className="w-full p-10 items-center absolute bottom-0">
                        <SheetClose className="w-full">
                            <Button variant="secondary" className="w-1/2" onClick={handleCancel}>Cerrar</Button>
                        </SheetClose>
                    </SheetFooter>
                </FormProvider>
            </SheetContent>
        </Sheet>
    )
}