import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductsFormFinder, ProductsFormFinderType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
    disabled: boolean,
    defaults: ProductsFormFinderType,
    onChange(fields: ProductsFormFinderType): void,
}

export default function ProductFormFinder({ disabled, defaults, onChange }: Props) {
    const form = useForm<ProductsFormFinderType>({
        resolver: zodResolver(ProductsFormFinder),
        disabled: disabled,
    });
    const { name, brand } = form.watch();
    const isDisabled = !name && !brand;// Disable if both fields are empty

    async function onSubmit(fields: ProductsFormFinderType) {
        const { name, brand } = fields;
        onChange({ name, brand });
    }

    function resetField(field: "name" | "brand") {
        form.setValue(field, "");

        const fields = {
            name: field == "name" ? "" : name,
            brand: field == "brand" ? "" : brand,
        }
        onSubmit(fields)
    }

    useEffect(() => {
        console.log("RESET FORM WITH DEFAULTS")
        form.reset(defaults);
    }, [defaults, form]);

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="p-2 flex justify-start gap-5 [&>div]:multi-[flex;flex-row;gap-2;text-nowrap;items-center;] [&>div>input]:w-[100px]">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2 w-fit">
                                <FormLabel id='name'>Nombre</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input {...field} className="w-56" />
                                    </FormControl>
                                    {field.value && field.value?.length > 0 &&
                                        <Button
                                            type="button"
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
                                        <Input {...field} className="w-56 pr-14" />
                                    </FormControl>
                                    {field.value && field.value?.length > 0 &&
                                        <Button
                                            type="button"
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
                    type="submit"
                    className="flex gap-3 px-10"
                    disabled={isDisabled}
                >
                    <Search />
                    Buscar
                </Button>
            </form>
        </FormProvider>
    )
}