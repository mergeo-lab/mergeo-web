import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { GoogleLocationSchemaType, LatLngLiteralType, PickUpSchedulesSchemaType, PickUpSchema, PickUpSchemaType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Store, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { DeleteConfirmationDialog } from "@/components/deleteConfirmationDialog";
import { cn } from "@/lib/utils";
import DaysPicker from "@/components/daysPicker";
import useDaysPickerStore from "@/store/daysPicker.store";
import { deletPickUpPoint, editPickUpPoints } from "@/lib/configuration/pickUp";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: React.ReactElement,
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
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteralType>({ latitude: 0, longitude: 0 });
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
                    latitude: pickUpData.address.location.coordinates[1],
                    longitude: pickUpData.address.location.coordinates[0],
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
            location: {
                coordinates: pickUpData?.address.location.coordinates || [0, 0],
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
            location: {
                type: "Point",
                coordinates: [address.location.longitude, address.location.latitude]
            },
            name: address.displayName.text
        });

        setMarkerPosition({ latitude: address.location.latitude, longitude: address.location.longitude });
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
                                                    addressRemoved={() => setMarkerPosition({ latitude: 0, longitude: 0 })}
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
                        {markerPosition.latitude !== 0 && markerPosition.longitude !== 0
                            ? <Map
                                style={{ width: '100%', height: '100%' }}
                                center={{ lat: Number(markerPosition.latitude), lng: Number(markerPosition.longitude) }}
                                defaultZoom={16}
                                maxZoom={20}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                            >
                                <Marker position={{ lat: markerPosition.latitude, lng: markerPosition.longitude }} />
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
                                <DeleteConfirmationDialog<{ id: string }>
                                    id={pickUpData && pickUpData?.id}
                                    title="Borrar sucursal"
                                    question={<p>¿Seguro que quieres borrar la sucursal <span className="font-bold">{pickUpData && pickUpData?.name}</span>?</p>}
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