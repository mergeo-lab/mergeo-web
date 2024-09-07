import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { GoogleLocationSchemaType } from "@/lib/common/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Store, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LatLngLiteral } from "@/types";
import OverlayLoadingIndicator from "@/components/ui/overlayLoadingIndicator";
import { DeleteConfirmationDialog } from "@/components/deleteConfirmationDialog";
import { cn } from "@/lib/utils";
import { PickUpSchedulesSchemaType, PickUpSchema, PickUpSchemaType } from "@/lib/configuration/schemas/pickUp.schema";
import DaysPicker from "@/components/daysPicker";
import useDaysPickerStore from "@/store/daysPicker.store";
import { deletPickUpPoint, editPickUpPoints } from "@/lib/configuration/pickUp";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string,
    isEditing: boolean,
    isOpen: boolean,
    pickUpData: PickUpSchemaType | null,
    onLoading: () => void
    callback: () => void
    onClose: () => void
}

export function EditPickUp(
    {
        title = 'Detalles de la sucursal',
        subTitle = 'Aquí puedes ver los detalles de la sucursal',
        icon = <Store />,
        isEditing,
        isOpen,
        pickUpData,
        onLoading,
        callback,
        onClose,
    }: Props) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const mutation = useMutation({ mutationFn: editPickUpPoints })
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
    const { daysAndTime } = useDaysPickerStore();

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        setIsloading(mutation.isPending);
    }, [mutation.isPending]);

    useEffect(() => {
        if (pickUpData) {
            form.reset(pickUpData);
            addAddress({
                id: pickUpData.address.id,
                displayName: { text: pickUpData.address.name },
                location: {
                    latitude: pickUpData.address.polygon.coordinates[1],
                    longitude: pickUpData.address.polygon.coordinates[0]
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickUpData]);

    const defaultValues: PickUpSchemaType = {
        name: pickUpData?.name || "",
        email: pickUpData?.email || "",
        phoneNumber: pickUpData?.phoneNumber || "",
        address: {
            id: pickUpData?.address.id || "",
            name: pickUpData?.address.name || "",
            polygon: {
                coordinates: pickUpData?.address.polygon.coordinates || [0, 0],
                type: "Point",
            },
        },
        schedules: pickUpData?.schedules || [],
    };

    const form = useForm<PickUpSchemaType>({
        resolver: zodResolver(PickUpSchema),
        disabled: mutation.isPending,
        defaultValues: defaultValues,
    })

    function addAddress(address: GoogleLocationSchemaType) {
        form.setValue('address', {
            id: address.id,
            polygon: {
                type: "Point",
                coordinates: [address.location.latitude, address.location.longitude]
            },
            name: address.displayName.text
        });

        setMarkerPosition({ lat: address.location.latitude, lng: address.location.longitude });
        form.trigger('address');
    }

    function setSelectedDays(schedules: PickUpSchedulesSchemaType[]) {
        console.log("schedules", schedules)
        form.setValue('schedules', schedules);
    }

    function deleteComplete() {
        callback();
        setIsloading(false);
        setOpen(false);
    }

    async function onSubmit(fields: PickUpSchemaType) {
        onLoading();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await mutation.mutateAsync({ branchId: fields.id!, body: fields });

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

    function handleCancel() {
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setOpen(false);
                handleCancel();
                onClose();

            } else {
                setOpen(true);
            }
        }}>
            <DialogContent className="w-full">
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <DialogTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {subTitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6 py-2 flex gap-2">
                    {isLoading && <OverlayLoadingIndicator />}
                    <div className="w-1/2">
                        <FormProvider {...form}>
                            <div className="h-4/5 p-10">
                                <form className='space-y-8'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel id='name'>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={!isEditing} className={cn("", {
                                                        'disabledStyle': !isEditing
                                                    })} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel id='address'>Dirección</FormLabel>
                                                <GoogleAutoComplete
                                                    disabled={!isEditing}
                                                    defaultAddressName={pickUpData?.address.name}
                                                    selectedAddress={addAddress}
                                                    addressRemoved={() => {
                                                        setMarkerPosition({ lat: 0, lng: 0 });
                                                    }}
                                                />
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
                                                    <Input {...field} disabled={!isEditing} className={cn("", {
                                                        'disabledStyle': !isEditing
                                                    })} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel id='phoneNumber'>Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={!isEditing} className={cn("", {
                                                        'disabledStyle': !isEditing
                                                    })} />
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
                                                <FormLabel id='schedules'>Dias y Horarios de recogida</FormLabel>
                                                <FormControl>
                                                    <DaysPicker
                                                        isEditing={isEditing}
                                                        defaultData={pickUpData?.schedules}
                                                        callback={() => setSelectedDays(daysAndTime)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </div>

                        </FormProvider>
                    </div>
                    <div className="w-1/2 h-full flex justify-center items-center bg-border overflow-hidden rounded-lg">
                        {markerPosition.lat !== 0 && markerPosition.lng !== 0
                            ? <Map
                                style={{ width: '100%', height: '100%' }}
                                center={markerPosition}
                                defaultZoom={16}
                                maxZoom={20}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                            >
                                <Marker position={markerPosition} />
                            </Map>
                            : <div className="flex flex-col justify-center items-center gap-2">
                                <MapPin size={40} />
                                <p>No has seleccionado una ubicación</p>
                            </div>
                        }
                    </div>
                </div>

                <DialogFooter className="w-full border px-6 py-3">
                    {!isEditing
                        ?
                        <DialogClose className="w-40">
                            <Button variant="secondary" className="w-full">
                                Cerrar
                            </Button>
                        </DialogClose>
                        : (
                            <div className="w-full flex justify-between gap-2">
                                <DeleteConfirmationDialog
                                    id={pickUpData && pickUpData?.id}
                                    name={pickUpData && pickUpData?.name}
                                    title="Borrar sucursal"
                                    question="¿Seguro que quieres borrar esta sucursal"
                                    triggerButton={
                                        <Button variant="destructive" className="w-40 flex gap-2">
                                            <Trash2 size={15} />
                                            Borrar
                                        </Button>
                                    }
                                    onLoading={() => {
                                        setIsloading(true);
                                        onLoading();
                                    }}
                                    mutationFn={deletPickUpPoint}
                                    callback={deleteComplete}
                                />
                                <div className="flex gap-2">
                                    <DialogClose className="w-40">
                                        <Button variant="secondary" className="w-full">Cancelar</Button>
                                    </DialogClose>
                                    <DialogClose className="w-40" disabled={!form.formState.isValid}>
                                        <Button disabled={!form.formState.isValid} onClick={form.handleSubmit(onSubmit)} type="submit" className="w-full">Guardar</Button>
                                    </DialogClose>
                                </div>
                            </div>
                        )
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog >

    )
}