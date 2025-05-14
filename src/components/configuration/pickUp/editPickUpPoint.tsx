import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Pencil, Store, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { DeleteConfirmationDialog } from "@/components/deleteConfirmationDialog";
import { cn } from "@/lib/utils";
import { PickUpSchedulesSchemaType, PickUpSchema, PickUpSchemaType, GoogleLocationSchemaType, LatLngLiteralType } from "@/lib/schemas";
import DaysPicker from "@/components/daysPicker";
import useDaysPickerStore from "@/store/daysPicker.store";
import { deletPickUpPoint, editPickUpPoints } from "@/lib/configuration/pickUp";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: React.ReactElement,
    companyId: string,
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
    const { daysAndTime, removeAll, addMultipleDaysAndTime } = useDaysPickerStore();
    const [isEditing, setIsEditing] = useState(false);

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
                    longitude: pickUpData.address.location.coordinates[0]
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
                coordinates: [address.location.latitude, address.location.longitude]
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

    function cancelEdit() {
        setIsEditing(false);
        form.reset(defaultValues);
        removeAll();
        addMultipleDaysAndTime(pickUpData?.schedules ?? [])
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
                setIsEditing(false);

            } else {
                setOpen(true);
            }
        }}>
            <DialogContent className="w-full">
                <DialogHeader className="px-6 py-3 border bottom-1">
                    <div className="flex gap-4">
                        <div>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="rounded border border-border p-2">
                                    {icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                    {title}
                                    <div className="text-sm">{subTitle}</div>
                                </div>
                            </DialogTitle>
                        </div>
                        <div className="flex">
                            <DeleteConfirmationDialog
                                id={pickUpData && pickUpData?.id}
                                title="Borrar sucursal"
                                question={<p>¿Seguro que quieres borrar la sucursal <span className="font-bold">{pickUpData && pickUpData?.name}</span>?</p>}
                                disabled={isEditing}
                                triggerButton={
                                    <Button variant="ghost" className={cn("w-fit flex gap-2 rounded-r-none border border-border border-r-0 hover:text-destructive", {
                                        "text-muted hover:text-muted hover:bg-white cursor-not-allowed": isEditing,
                                    })}>
                                        <Trash2 size={15} />
                                    </Button>
                                }
                                onLoading={() => {
                                    setIsloading(true);
                                    onLoading();
                                }}
                                mutationFn={deletPickUpPoint}
                                callback={deleteComplete}
                            />
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="ghost"
                                className={cn("w-fit flex gap-2 rounded-l-none border border-border border-l-none hover:text-highlight", {
                                    "bg-highlight text-white hover:bg-highlight/80 hover:text-white cursor-default": isEditing,
                                })}>
                                <Pencil size={15} />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                <div className="px-6 py-2 flex gap-2">
                    {isLoading && <OverlayLoadingIndicator />}
                    <div className="w-1/2">
                        <FormProvider {...form}>
                            <div className="h-4/5 px-10 py-2">
                                <form className='space-y-6'>
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
                                                        setMarkerPosition({ latitude: 0, longitude: 0 });
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
                        {markerPosition.latitude !== 0 && markerPosition.longitude !== 0
                            ? <Map
                                style={{ width: '100%', height: '100%' }}
                                center={{ lat: markerPosition.latitude, lng: markerPosition.longitude }}
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
                            <div className="w-full flex justify-end gap-2">
                                <div className="flex gap-2">
                                    <Button variant="secondary" className="w-full" onClick={() => cancelEdit()}>Cancelar</Button>
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