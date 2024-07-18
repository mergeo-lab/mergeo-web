import { CardFooter } from "@/components/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterCompanySchema, RegisterCompanySchemaType } from "@/lib/auth/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { getCompany } from "@/lib/configuration";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export function Company({ isEdditing = false }: { isEdditing?: boolean }) {
    const company = useQuery({ queryKey: ['company'], queryFn: getCompany });

    const form = useForm<RegisterCompanySchemaType>({
        resolver: zodResolver(RegisterCompanySchema),
        defaultValues: {
            name: "Mergeo",
            razonSocial: "Mergeo Inc",
            cuit: "20295035316",
            address: { displayName: { text: "Tierra del fuego 768" }, location: { latitude: 0, longitude: 0 } },
            activity: "Internet",
        },
    })

    const disabledStyle = "text-base text-black border-none bg-accent";

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col justify-between w-4/6">
                <div className="flex gap-10 m-10">
                    <div>
                        <div className="w-80 h-80 bg-muted"></div>
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
                                                <Input disabled={!isEdditing} value={field.value.displayName.text} className={cn("", {
                                                    [disabledStyle]: !isEdditing
                                                })} />
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
                        <Button onClick={() => { console.log('edit') }} className='min-w-[200px]' type="submit">
                            Editar
                        </Button>
                    </div>
                </CardFooter>
            </div>
            <div className="overflow-hidden h-full w-4/12 bg-blue-300 z-10 flex-justify-center items-center">
                <APIProvider apiKey={googleMapsApiKey}>
                    <Map
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={{ lat: 22.54992, lng: 0 }}
                        defaultZoom={3}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                    />
                </APIProvider>
            </div>
        </div>
    )
}