import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { GoogleLocationSchemaType, LatLngLiteralType } from "@/lib/common/schemas";
import { newBranch } from "@/lib/configuration/branch";
import { BranchesSchemaType, BranchesSchema } from "@/lib/configuration/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Store } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import OverlayLoadingIndicator from "@/components/ui/overlayLoadingIndicator";

type Props = {
    title?: string,
    subTitle?: string,
    icon?: JSX.Element,
    companyId: string,
    triggerButton?: React.ReactNode
    callback: () => void
    onLoading: () => void
}

export function NewBranch(
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
    const mutation = useMutation({ mutationFn: newBranch })
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteralType>({ latitude: 0, longitude: 0 });
    const form = useForm<BranchesSchemaType>({
        resolver: zodResolver(BranchesSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: {
                name: "",
                location: {
                    coordinates: [],
                    type: "Point",
                },
            },
        },
    })

    function addAddress(address: GoogleLocationSchemaType) {
        console.log(" address", address)
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

    async function onSubmit(fields: BranchesSchemaType) {
        onLoading();
        const response = await mutation.mutateAsync({ companyId: companyId, body: fields });

        if (response.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.error,
            })
        } else if (response.data) {
            const { data } = response;
            form.reset();
            setOpen(false);
            callback();

            console.log(data)
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
                                        name="address"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel id='address'>Dirección</FormLabel>
                                                <GoogleAutoComplete
                                                    selectedAddress={addAddress}
                                                    disabled={false}
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

                                </form>

                            </div>

                        </FormProvider>
                    </div>
                    <div className="w-1/2 h-full flex justify-center items-center bg-border overflow-hidden rounded-lg">
                        {markerPosition.latitude !== 0 && markerPosition.longitude !== 0
                            ? <Map
                                style={{ width: '100%', height: '100%' }}
                                center={{ lat: markerPosition.latitude, lng: markerPosition.longitude }} // Change this line
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