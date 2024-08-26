import { CardFooter } from "@/components/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterCompanySchema, RegisterCompanySchemaType } from "@/lib/auth/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Map, Marker } from '@vis.gl/react-google-maps';
import UseCompanyStore from "@/store/company.store";
import { Pencil } from "lucide-react";
import { BranchPicker } from "@/components/configuration/company/branches/branchPicker";
import { LatLngLiteral } from "@/types";

export function Company({ isEdditing = false }: { isEdditing?: boolean }) {
    const { company } = UseCompanyStore();
    const markerPosition: LatLngLiteral = { lat: company?.address?.polygon.coordinates[1] || 0, lng: company?.address?.polygon.coordinates[0] || 0 };

    const form = useForm<RegisterCompanySchemaType>({
        resolver: zodResolver(RegisterCompanySchema),
        defaultValues: {
            name: company?.name,
            razonSocial: company?.razonSocial,
            cuit: company?.cuit,
            address: {
                name: company?.address?.name,
                polygon: { coordinates: company?.address?.polygon.coordinates, type: company?.address?.polygon.type },
            },
            activity: company?.activity,
        },
    })

    const disabledStyle = "text-base text-black border-none bg-accent";

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col justify-between w-4/6">
                <div className="flex gap-20 m-10">
                    <div>
                        <div className="w-80 h-80 bg-muted rounded overflow-hidden">
                            <img src='/empresa-default.jpeg' alt="logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <FormProvider {...form}>
                        <form className='space-y-8 w-full pr-10'>
                            <div className='grid grid-cols-2 gap-10'>
                                <FormField
                                    name="name"
                                    disabled={!isEdditing}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='name'>Nombre</FormLabel>
                                            <FormControl>
                                                <Input className={cn("", {
                                                    [disabledStyle]: !isEdditing
                                                })} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="razonSocial"
                                    disabled={!isEdditing}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='razonSocial'>Razon Social</FormLabel>
                                            <FormControl>
                                                <Input className={cn("", {
                                                    [disabledStyle]: !isEdditing
                                                })} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-10'>
                                <FormField
                                    disabled={!isEdditing}
                                    name="cuit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='cuit'>CUIT</FormLabel>
                                            <FormControl>
                                                <Input className={cn("", {
                                                    [disabledStyle]: !isEdditing
                                                })} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={!isEdditing}
                                    name="activity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='activity'>Actividad</FormLabel>
                                            <FormControl>
                                                <Input className={cn("", {
                                                    [disabledStyle]: !isEdditing
                                                })} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='grid grid-cols-1 gap-10'>
                                <FormField
                                    disabled={!isEdditing}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='address'>Dirección</FormLabel>
                                            <FormControl>
                                                <Input disabled={!isEdditing} value={field.value.name} className={cn("", {
                                                    [disabledStyle]: !isEdditing
                                                })} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='grid grid-cols-1 gap-10'>
                                <FormField
                                    disabled={!isEdditing}
                                    name="branch"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel id='branch'>Sucursales</FormLabel>
                                            <FormControl>
                                                <BranchPicker companyId={company?.id} />
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
                    <div className='flex flex-col-reverse md:flex-row justify-end items-center min-h-20'>
                        <Button variant='outline' onClick={() => { console.log('edit') }} className='min-w-[200px] flex gap-2' type="submit">
                            <span>
                                Editar
                            </span>
                            <Pencil size={15} />
                        </Button>
                    </div>
                </CardFooter>
            </div>
            <div className="overflow-hidden h-full w-4/12 bg-accent z-10 flex-justify-center items-center">
                <Map
                    style={{ width: '100%', height: '100%' }}
                    center={markerPosition}
                    defaultZoom={16}
                    maxZoom={20}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    <Marker position={markerPosition} />
                </Map>
            </div>
        </div>
    )
}
