import { NewDropZone } from "@/components/configuration/provider/dropZone/newDropZone";
import DaysPicker from "@/components/daysPicker";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { newDropZone, apiEditDropZone, deletDropZone } from "@/lib/configuration/dropZone";
import { PickUpSchedulesSchemaType, DropZoneSchema, DropZoneSchemaType, IncomingDropZoneSchemaType } from "@/lib/schemas";
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
import OverlayLoadingIndicator from "@/components/ui/overlayLoadingIndicator";
import { DeleteConfirmationDialog } from "@/components/deleteConfirmationDialog";
import { cn } from "@/lib/utils";

type Props = {
    zones: IncomingDropZoneSchemaType[],
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string | undefined,
    triggerButton?: React.ReactNode,
    isLoadingProp?: boolean
    fetchZones: () => void
}

export function DropZoneSheet({
    zones,
    title = "Agregar una zona de entrega",
    subTitle = "Aquí puedes agregar una nueva zona de entrega, los dias y horarios",
    icon = <UserRoundPlus size={20} />,
    companyId,
    triggerButton,
    isLoadingProp,
    fetchZones
}: Props) {
    const mutation = useMutation({ mutationFn: newDropZone })
    const editMutation = useMutation({ mutationFn: apiEditDropZone })
    const [open, setOpen] = useState(false);
    const [showMap, setShowMap] = useState<{ name: string, zone: google.maps.LatLngLiteral[], show: boolean }>({ name: "", zone: [], show: false });
    const [selectedZone, setSelectedZone] = useState<google.maps.LatLngLiteral[]>([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [editingDz, setEditingDz] = useState({ editing: false, id: "" });
    const { daysAndTime: schedules, removeAll: removeSchedules, addMultipleDaysAndTime } = useDaysPickerStore();
    const { dropZones, addDropZone, editDropZone, getDropZoneById, addMultipleIncomingDropZoneSchema, removeDropZone } = UseDropZonesStore();
    const { removeZone, setZone } = useZoneStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [deleteDropZoneData, setDeleteDropZoneData] = useState<{ data: DropZoneSchemaType | null, isOpen: boolean }>({ data: null, isOpen: false });


    const form = useForm<DropZoneSchemaType>({
        resolver: zodResolver(DropZoneSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
            schedules: [],
            zone: {
                type: "Polygon",
                coordinates: []
            },
        },
    })

    useEffect(() => {
        if (selectedZone) {
            form.setValue('zone', {
                type: "Polygon",
                coordinates: selectedZone
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

    useEffect(() => {
        if (zones) {
            addMultipleIncomingDropZoneSchema(zones);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zones]);

    useEffect(() => {
        if (open) {
            fetchZones();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const closeModal = useCallback(() => {
        handleCancel()
        setSelectedZone([]);
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function setSelectedDays(schedules: PickUpSchedulesSchemaType[]) {
        form.setValue('schedules', schedules);
    }

    function handleCancel() {
        removeZone();
        cancelEdit();
        form.setValue('name', "");
    }

    async function saveDropZone() {
        if (!companyId) return;
        if (!form.getValues().name || !form.getValues().schedules || !form.getValues().zone) return;
        const dzone = {
            name: form.getValues().name,
            schedules: form.getValues().schedules,
            zone: form.getValues().zone
        }

        await mutation.mutateAsync({ companyId: companyId, body: dzone });

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
            setIsAdding(false);
            fetchZones();
        }
    }

    function startEdit(id: string) {
        const dzone = getDropZoneById(id);
        if (!dzone) return;
        setIsAdding(true);
        setEditingDz({ editing: true, id: id });
        setZone(dzone.zone.coordinates);
        setSelectedZone(dzone.zone.coordinates);
        removeSchedules();
        addMultipleDaysAndTime(dzone.schedules);
        form.reset(dzone);
    }

    async function saveEdit() {
        if (!form.getValues().name || !form.getValues().schedules || !form.getValues().zone) return;
        const id = editingDz.id;
        const dzone = {
            name: form.getValues().name,
            schedules: form.getValues().schedules,
            zone: form.getValues().zone
        }
        await editMutation.mutateAsync({ id: id, body: dzone });

        if (mutation.isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: mutation.error.message,
            })
        } else {
            editDropZone(editingDz.id, dzone);
            cancelEdit();
            fetchZones();
            setIsAdding(false);
        }
    }

    function cancelEdit() {
        form.setValue('name', "");
        setEditingDz({ editing: false, id: "" });
        setZone([]);
        setSelectedZone([]);
        removeSchedules();
        setIsAdding(false);
    }

    function handelDeleteZone(id: string) {
        if (!id) return;
        const toDelete = getDropZoneById(id);
        if (toDelete) setDeleteDropZoneData({ data: toDelete, isOpen: true });
    }

    function deleteComplete() {
        if (deleteDropZoneData.data && deleteDropZoneData.data.id) {
            removeDropZone(deleteDropZoneData.data.id);
        }
        setDeleteDropZoneData({ data: null, isOpen: false });
        fetchZones();
    }

    function handleShowMap(id: string) {
        const dzone = getDropZoneById(id);
        if (!dzone) return;
        setShowMap({ name: dzone.name, zone: dzone?.zone.coordinates, show: true });
    }

    function openAddZone() {
        if (!isAdding) {
            handleCancel()
        }
        setIsAdding(!isAdding);
    }

    return (
        <Sheet open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                closeModal();
            } else {
                setOpen(isOpen);
            }
        }}>
            <SheetTrigger className="pt-2 w-full">
                {triggerButton}
            </SheetTrigger>
            <SheetContent className="w-1/3 mx-w-1/3 sm:max-w-1/3">
                {
                    isLoading || isLoadingProp && <OverlayLoadingIndicator />
                }
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
                    <Button onClick={() => {
                        isAdding ? cancelEdit() : openAddZone()
                    }} variant="outline" className="mt-5 w-full">
                        {isAdding ? "Cancelar" : "Añadir Zona"}
                    </Button>
                    <div className={cn("rounded border mt-5 overflow-hidden transition-[height] duration-500", {
                        "h-0 p-0": !isAdding,
                        "h-[420px]": isAdding
                    })}>
                        <form className='space-y-4 p-5'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel id='name'>Nombre</FormLabel>
                                        <FormControl>
                                            <Input className="h-8" {...field} />
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
                                                className="w-fit space-x-2 text-md font-black p-6 rounded-md m-0" type="button">
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
                        deleteZone={(id: string) => handelDeleteZone(id)}
                        handleShowMap={(id: string) => handleShowMap(id)}
                    />
                    <DeleteConfirmationDialog
                        id={deleteDropZoneData.data && deleteDropZoneData.data.id}
                        name={deleteDropZoneData.data && deleteDropZoneData.data.name}
                        openDialog={deleteDropZoneData && deleteDropZoneData.isOpen}
                        title="Borrar zona de entrega"
                        question="¿Seguro que quieres borrar esta zona de entrega"
                        onLoading={() => setIsLoading(true)}
                        mutationFn={deletDropZone}
                        callback={deleteComplete}
                        onClose={() => setDeleteDropZoneData({ data: null, isOpen: false })}
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
