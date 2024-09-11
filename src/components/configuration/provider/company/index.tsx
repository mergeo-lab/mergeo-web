import { CardFooter } from "@/components/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateCompanySchema, UpdateCompanySchemaType } from "@/lib/auth/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Map, Marker } from '@vis.gl/react-google-maps';
import UseCompanyStore from "@/store/company.store";
import { MapPin, Pencil } from "lucide-react";
import { LatLngLiteral } from "@/types";
import { useEffect, useState } from "react";
import OverlayLoadingIndicator from "@/components/ui/overlayLoadingIndicator";
import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { GoogleLocationSchemaType } from "@/lib/common/schemas";
import { useMutation } from "@tanstack/react-query";
import { updateCompany } from "@/lib/configuration/company";
import { toast } from "@/components/ui/use-toast";
import { PickUpPicker } from "@/components/configuration/pickUp/pickUpPicker";
import { DropZoneSheet } from "../dropZone/dropZoneSheet";
import { DropZonePicker } from "@/components/configuration/provider/dropZone/dropZonePicker";

export function Company() {
    const { company, saveCompany } = UseCompanyStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const mutation = useMutation({ mutationFn: updateCompany })
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteral>({ lat: company?.address?.polygon.coordinates[1] || 0, lng: company?.address?.polygon.coordinates[0] || 0 });

    const form = useForm<UpdateCompanySchemaType>({
        resolver: zodResolver(UpdateCompanySchema),
        defaultValues: {
            name: company?.name || "",
            address: {
                name: company?.address?.name || "",
                polygon: { coordinates: company?.address?.polygon.coordinates || [0, 0], type: company?.address?.polygon.type || "Point" },
            },
            activity: company?.activity || "",
        },
    })

    useEffect(() => {
        if (company?.address) {
            form.reset(company);
            addAddress({
                id: company.address.id,
                displayName: { text: company.address.name },
                location: {
                    latitude: company.address.polygon.coordinates[1],
                    longitude: company.address.polygon.coordinates[0]
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company]);

    useEffect(() => {
        setIsLoading(mutation.isPending);
    }, [mutation.isPending]);

    async function onSubmit(fields: UpdateCompanySchemaType) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (!company) return;
        const response = await mutation.mutateAsync({ companyId: company.id, fields: fields });

        if (mutation.isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: mutation.error.message,
            })
        } else {
            setIsEditing(false);
            saveCompany(response.data);
        }
    }

    function actionEnded() {
        setIsEditing(false);
        setIsLoading(false);
    }

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

    return (
        <div className="flex w-full h-full">
            {isLoading && <OverlayLoadingIndicator />}
            <div className="flex flex-col justify-between w-4/6">
                <div className="flex gap-20 m-10">
                    <div>
                        <div className="w-80 h-80 bg-muted rounded overflow-hidden">
                            <img src='/empresa-default.jpeg' alt="logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <FormProvider {...form}>
                        <form className='space-y-6 w-full pr-10'>
                            <div className='grid grid-cols-2 gap-10'>
                                <FormField
                                    name="name"
                                    disabled={!isEditing}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='name'>Nombre</FormLabel>
                                            <FormControl>
                                                <Input className={cn("", {
                                                    'disabledStyle': !isEditing
                                                })} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormItem>
                                    <FormLabel id='razonSocial'>Razon Social</FormLabel>
                                    <FormControl>
                                        <Input disabled={true} value={company?.razonSocial && company?.razonSocial}
                                            className={cn("", {
                                                'disabledStyle': true
                                            })} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </div>
                            <div className='grid grid-cols-2 gap-10'>
                                <FormItem>
                                    <FormLabel id='cuit'>CUIT</FormLabel>
                                    <FormControl>
                                        <Input disabled={true} value={company?.cuit && company?.cuit} className={cn("", {
                                            'disabledStyle': true
                                        })} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                <FormField
                                    disabled={!isEditing}
                                    name="activity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='activity'>Actividad</FormLabel>
                                            <FormControl>
                                                <Input className={cn("", {
                                                    'disabledStyle': !isEditing
                                                })} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='grid grid-cols-1 gap-10'>
                                <FormField
                                    disabled={!isEditing}
                                    name="address"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel id='address'>Dirección</FormLabel>
                                            <FormControl>
                                                <GoogleAutoComplete
                                                    disabled={!isEditing}
                                                    defaultAddressName={company?.address?.name}
                                                    selectedAddress={addAddress}
                                                    addressRemoved={() => {
                                                        setMarkerPosition({ lat: 0, lng: 0 });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid grid-cols-1 gap-10'>
                                <FormField
                                    disabled={!isEditing}
                                    name="branch"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel id='branch'>Puntos de Pick Up ( click para {isEditing ? ' editar' : 'ver detalles'} )</FormLabel>
                                            <FormControl>
                                                <PickUpPicker
                                                    companyId={company?.id}
                                                    isEditing={isEditing}
                                                    callback={actionEnded}
                                                    onLoading={() => setIsLoading(true)}
                                                    notFoundMessage="No se encontraron Puntos de Pick Up"
                                                    newEntry={{
                                                        title: "Agregar un Punto de Pick Up",
                                                        subTitle: "Aqui puedes areguegar un punto de Pick Up",
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid grid-cols-1 gap-10'>
                                <FormField
                                    disabled={!isEditing}
                                    name="branch"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <DropZonePicker
                                                    companyId={company?.id}
                                                    isEditing={isEditing}
                                                    callback={actionEnded}
                                                    onLoading={() => setIsLoading(true)}
                                                    notFoundMessage="No se encontraron zonas de entrega"
                                                    newEntry={{
                                                        title: "agregar una zona de entrega",
                                                        subTitle: "Aqui puedes areguegar una zona de entrega",
                                                        icon: <MapPin size={20} />
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>



                        </form>
                    </FormProvider>
                </div>
                <CardFooter className='w-full'>
                    <div className='flex flex-col-reverse md:flex-row justify-end items-center min-h-20 gap-2'>
                        {isEditing ?
                            <>
                                <Button variant='secondary' onClick={() => setIsEditing(!isEditing)} className='min-w-[200px] flex gap-2' type="submit">
                                    <span>
                                        Cancelar
                                    </span>
                                </Button>
                                <Button onClick={form.handleSubmit(onSubmit)} className='min-w-[200px] flex gap-2' type="submit">
                                    <span>
                                        Guardar
                                    </span>
                                </Button>
                            </>
                            :
                            <Button variant='outline' onClick={() => setIsEditing(!isEditing)} className='min-w-[200px] flex gap-2' type="submit">
                                <span>
                                    Editar
                                </span>
                                <Pencil size={15} />
                            </Button>
                        }
                    </div>
                </CardFooter>
            </div>
            <div className="overflow-hidden h-full w-4/12 bg-accent z-10 flex-justify-center items-center">
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
                    : <div className="flex flex-col justify-center items-center gap-2 h-full">
                        <MapPin size={40} />
                        <p>No has seleccionado una ubicación</p>
                    </div>
                }
            </div>
        </div>
    )
}
