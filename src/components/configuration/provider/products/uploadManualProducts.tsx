import AddProductsList from "@/components/configuration/provider/products/addProductsList";
import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGs1ProductSearch } from "@/hooks/useSearchGs1";
import { Gs1SearchSchema, Gs1SearchSchemaType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, SearchX, X } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";



export default function UploadManualProducts() {
    const [formSubmited, setFormSubmited] = useState(false);
    const { data, isLoading, isError, handleSearch } = useGs1ProductSearch();

    const form = useForm<Gs1SearchSchemaType>({
        resolver: zodResolver(Gs1SearchSchema),
        disabled: isLoading,
    })
    const { name, brand } = form.watch();
    const isDisabled = !name && !brand; // Disable if both fields are empty

    async function onSubmit(fields: Gs1SearchSchemaType) {
        const { name, brand } = fields;
        handleSearch({ name, brand });
        setFormSubmited(true);
    }

    function resetField(field: "name" | "brand") {
        form.setValue(field, "");
        const { name, brand } = form.getValues();
        handleSearch({ name, brand });

        // Trigger search only if both fields are cleared
        if (!name && !brand) {
            setFormSubmited(false);
        }
    }

    return (
        <div className="grid grid-rows-[auto,1fr] h-[calc(100vh-305px)]">
            <div className="mx-10 mt-5 p-2 flex justify-start gap-5 pl-10 shadow rounded [&>div]:multi-[flex;flex-row;gap-2;text-nowrap;items-center;] [&>div>input]:multi-[w-[300px]]">
                <FormProvider {...form}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2 w-fit">
                                    <FormLabel id='name'>Nombre</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input {...field} className="w-72" />
                                        </FormControl>
                                        {field.value && field.value?.length > 0 &&
                                            <Button
                                                variant='ghost'
                                                className="absolute right-0 top-[50%] -translate-y-[50%]"
                                                onClick={() => resetField(field.name)}
                                            >
                                                <X size={20} strokeWidth={3} />
                                            </Button>
                                        }
                                    </div>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2 w-fit">
                                    <FormLabel id='brand'>Marca</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input {...field} className="w-72 pr-14" />
                                        </FormControl>
                                        {field.value && field.value?.length > 0 &&
                                            <Button
                                                variant='ghost'
                                                className="absolute right-0 top-[50%] -translate-y-[50%]"
                                                onClick={() => resetField(field.name)}
                                            >
                                                <X size={20} strokeWidth={3} />
                                            </Button>
                                        }
                                    </div>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button
                        className="flex gap-3 px-10"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isDisabled}
                    >
                        <Search />
                        Buscar
                    </Button>
                </FormProvider>
            </div >
            <div className="mx-10 bg-border/50 mt-5 rounded">
                {isLoading &&
                    <div className="w-full h-full flex justify-center items-center">

                        <div className="bg-white rounded shadow py-5 px-8 flex flex-col justify-center items-center gap-y-4">
                            <LoadingIndicator />
                            <p>
                                Buscando...
                            </p>
                        </div>
                    </div>
                }

                {(!name || !brand) && !formSubmited && (
                    <div className="w-full h-full flex justify-center items-center">
                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">
                            <div>Tienes que usar el buscador para ver resultados!</div>
                        </div>
                    </div>
                )}
                {data && data.length === 0 && (name || brand) && formSubmited && (
                    <div className="w-full h-full flex justify-center items-center">

                        <div className="w-fit h-fit bg-white shadow rounded p-10 flex gap-5 items-center">

                            <div className="bg-destructive w-fit h-fit p-2 rounded">
                                <SearchX size={36} strokeWidth={1.5} className="text-white" />
                            </div>
                            <div>
                                <p>
                                    No se encontraron productos con esos parametros!
                                </p>
                                <p>
                                    Intentalo nuevamente.
                                </p>
                            </div>
                        </div>
                    </div>
                )
                }
                {data && data.length > 0 && (
                    // data.map(item => {
                    //     return <AddProductItem
                    //         name={item.name}
                    //         brand={item.brand}
                    //         netContent={item.net_content}
                    //         measurmentUnit={item.measurementUnit}
                    //     />
                    // })
                    <AddProductsList data={data} />
                )}
            </div>
        </div >
    )
}