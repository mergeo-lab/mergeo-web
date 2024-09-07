import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { GoogleLocationSchemaType } from "@/lib/common/schemas";
import { newBranch } from "@/lib/configuration/branch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Store } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LatLngLiteral } from "@/types";
import OverlayLoadingIndicator from "@/components/ui/overlayLoadingIndicator";
import { PickUpDaysSchemaType, PickUpSchema, PickUpSchemaType } from "@/lib/configuration/schemas/pickUp.schema";
import DaysPicker from "@/components/daysPicker";
import useDaysPickerStore from "@/store/daysPicker.store";
import { newPickUpPoints } from "@/lib/configuration/pickUp";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string,
    triggerButton?: React.ReactNode
    callback: () => void
    onLoading: () => void
}

export function NewPickUpPoint(
    {
        title = 'Agregar una sucursal',
        subTitle = 'Aquí puedes agregar una nueva sucursal',
        icon = <Store />,
        companyId,
        triggerButton,
        callback,
        onLoading,
    }: Props) {
    const [open, setOpen] = useState(false);
    const mutation = useMutation({ mutationFn: newPickUpPoints })
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
    const { daysAndTime, reset: resetDays } = useDaysPickerStore();

    const form = useForm<PickUpSchemaType>({
        resolver: zodResolver(PickUpSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: {
                name: "",
                polygon: {
                    coordinates: [],
                    type: "Point",
                },
            },
            days: [],
        },
    })

    function addAddress(address: GoogleLocationSchemaType) {
        console.log(" address", address)
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

    function setSelectedDays(days: PickUpDaysSchemaType[]) {
        console.log("days", days)
        form.setValue('days', days);
    }

    async function onSubmit(fields: PickUpSchemaType) {
        onLoading();
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
            resetDays();
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
            } else {
                setOpen(true);
            }
        }}>
            <DialogTrigger className="w-full flex mt-2" asChild>
                {triggerButton}
            </DialogTrigger>
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
                    {mutation.isPending && <OverlayLoadingIndicator />}
                    <div className="w-1/2">
                        <FormProvider {...form}>
                            <div className="h-4/5 p-10 py-3">
                                <form className='space-y-6'>
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
                                        name="address"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel id='address'>Dirección</FormLabel>
                                                <GoogleAutoComplete
                                                    selectedAddress={addAddress}
                                                    disabled={false}
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
                                                    <Input {...field} />
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
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="days"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel id='days'>Dias y Horarios de Pick Up</FormLabel>
                                                <FormControl>
                                                    <DaysPicker callback={() => setSelectedDays(daysAndTime)} />
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

                <DialogFooter className="w-full border top-1 px-6 py-3">
                    <DialogClose className="w-40">
                        <Button variant="secondary" className="w-full" onClick={handleCancel}>Cancelar</Button>
                    </DialogClose>
                    <DialogClose className="w-40" disabled={!form.formState.isValid}>
                        <Button disabled={!form.formState.isValid} onClick={form.handleSubmit(onSubmit)} type="submit" className="w-full">Guardar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}