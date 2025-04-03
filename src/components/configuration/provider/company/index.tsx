import { CardFooter } from "@/components/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateCompanySchema, UpdateCompanySchemaType, GoogleLocationSchemaType, LatLngLiteralType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Map, Marker } from '@vis.gl/react-google-maps';
import UseCompanyStore from "@/store/company.store";
import { MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { GoogleAutoComplete } from "@/components/googleAutoComplete";
import { useMutation } from "@tanstack/react-query";
import { updateCompany } from "@/lib/configuration/company";
import { toast } from "@/components/ui/use-toast";
import { PickUpPicker } from "@/components/configuration/pickUp/pickUpPicker";
import { DropZonePicker } from "@/components/configuration/provider/dropZone/dropZonePicker";
import { BsFillBuildingsFill } from "react-icons/bs";
import { RiRoadMapFill } from "react-icons/ri";

export function Company() {
    const { company, saveCompany } = UseCompanyStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const mutation = useMutation({ mutationFn: updateCompany })
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteralType>({ latitude: 0, longitude: 0 });

    const companyMainBranch = company?.branches.find((branch) => branch.isMain);

    const defaultCompnay = {
        id: companyMainBranch?.id || "",
        name: company?.name || "",
        branch: {
            address: {
                name: companyMainBranch?.name || "",
                location: { coordinates: companyMainBranch?.address?.location.coordinates || [0, 0], type: companyMainBranch?.address?.location.type || "Point" },
            }
        },
        activity: company?.activity || "",
    }


    const form = useForm<UpdateCompanySchemaType>({
        resolver: zodResolver(UpdateCompanySchema),
        defaultValues: defaultCompnay
    })

    useEffect(() => {
        handleCancelEdit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyMainBranch]);

    useEffect(() => {
        setIsLoading(mutation.isPending);
    }, [mutation.isPending]);

    async function onSubmit(fields: UpdateCompanySchemaType) {
        fields.branch = {
            ...fields.branch,
            id: companyMainBranch?.id || "",
            name: companyMainBranch?.name || "",
            email: companyMainBranch?.email || "",
            phoneNumber: companyMainBranch?.phoneNumber || "",
        }
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
        form.setValue('branch', {
            address: {
                id: address.id,
                location: {
                    type: "Point",
                    coordinates: [address.location.latitude, address.location.longitude]
                },
                name: address.displayName.text
            }
        });

        setMarkerPosition({ latitude: address.location.latitude, longitude: address.location.longitude });
        form.trigger('branch');
    }

    function handleCancelEdit() {
        if (!companyMainBranch) return;
        form.reset(defaultCompnay);
        addAddress({
            id: companyMainBranch.address.id,
            displayName: { text: companyMainBranch.address.name },
            location: {
                latitude: companyMainBranch.address.location.coordinates[1],
                longitude: companyMainBranch.address.location.coordinates[0]
            },
        });
        setIsEditing(false);
    }

    return (
        <div className="flex w-full h-full">
            {isLoading && <OverlayLoadingIndicator />}
            <div className="flex flex-col justify-between w-4/6 h-full overflow-y-auto">
                <div className="flex gap-20 m-10">
                    {/* <div>
                        <div className="w-80 h-80 bg-muted rounded overflow-hidden">
                            <img src='/empresa-default.jpeg' alt="logo" className="w-full h-full object-cover" />
                        </div>
                    </div> */}
                    <FormProvider {...form}>
                        <form className='w-full pr-10'>
                            <div className="border border-border rounded-sm mb-4">
                                <div className="relative">
                                    <div className="border-b border-border w-full flex gap-2 items-center p-2 px-4 mb-2">
                                        <BsFillBuildingsFill className="text-info" />
                                        <p>Datos de la Empresa</p>
                                    </div>
                                    {isEditing &&
                                        <div className="bg-highlight w-8 h-8 rounded absolute top-1 right-1 flex justify-center items-center animate-heartbeat animate-iteration-count-2 animate-duration-1000">
                                            <Pencil size={20} className="text-white" />
                                        </div>}
                                </div>
                                <div className="space-y-3 p-5 py-2 pb-4">
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
                                            name="branch"
                                            render={({ field }) => {
                                                console.log(field?.value)
                                                return (
                                                    <FormItem>
                                                        <FormLabel id='branch'>Dirección</FormLabel>
                                                        <FormControl>
                                                            <GoogleAutoComplete
                                                                isEditing={isEditing}
                                                                disabled={!isEditing}
                                                                defaultAddressName={field?.value.address.name}
                                                                selectedAddress={addAddress}
                                                                addressRemoved={() => {
                                                                    field?.value.name && form.setValue('branch', {
                                                                        address: {
                                                                            id: "",
                                                                            location: {
                                                                                type: "Point",
                                                                                coordinates: [0, 0]
                                                                            },
                                                                            name: ""
                                                                        }
                                                                    });
                                                                    setMarkerPosition({ latitude: 0, longitude: 0 });
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className={cn("border border-border rounded-sm", {
                                'opacity-40': isEditing
                            })}>
                                <div className="border-b border-border w-full p-2 px-4 flex items-center gap-2">
                                    <RiRoadMapFill className="text-info" size={20} />
                                    <p>Sucursales y Zonas</p>
                                </div>
                                <div className={"px-5 pt-2 pb-4 space-y-5"}>
                                    <div className='grid grid-cols-1 gap-10'>
                                        <FormField
                                            disabled={isEditing}
                                            name="pickUp"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel>Puntos de Pick Up</FormLabel>
                                                    <FormControl>
                                                        <PickUpPicker
                                                            disabled={isEditing}
                                                            companyId={company?.id}
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
                                    <div className="p-0 m-0">
                                        <FormField
                                            disabled={isEditing}
                                            name="dropZone"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel className="">Zonas de reparto</FormLabel>
                                                    <FormControl>
                                                        <DropZonePicker
                                                            disabled={isEditing}
                                                            companyId={company?.id}
                                                            isEditing={isEditing}
                                                            notFoundMessage="No se encontraron zonas de entrega"
                                                            newEntry={{
                                                                title: "Agregar una zona de entrega",
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
                                </div>
                            </div>

                        </form>
                    </FormProvider>
                </div>
                <CardFooter className='w-full'>
                    <div className='flex flex-col-reverse md:flex-row justify-end items-center  gap-2'>
                        {isEditing ?
                            <>
                                <Button variant='secondary' onClick={handleCancelEdit} className='min-w-[200px] flex gap-2' type="submit">
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
                    : <div className="flex flex-col justify-center items-center gap-2 h-full">
                        <MapPin size={40} />
                        <p>No has seleccionado una ubicación</p>
                    </div>
                }
            </div>
        </div >
    )
}
