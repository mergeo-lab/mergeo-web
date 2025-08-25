import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductsFormFinder, ProductsFormFinderType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

type Props = {
    disabled: boolean,
    defaults: ProductsFormFinderType,
    inputWidth?: string,
    inputHeight?: string,
    onChange(fields: ProductsFormFinderType): void,
}

export default function ProductFormFinder({ disabled, defaults, inputWidth = "100px", inputHeight = "30px", onChange }: Props) {
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
        form.reset(defaults);
    }, [defaults, form]);

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className={`p-2 flex justify-start gap-2 h-fit`} >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <div className={`flex items-center gap-2 w-fit ${inputHeight}`}>
                                <FormLabel id='name'>Nombre</FormLabel>
                                <div className={`relative ${inputHeight}`}>
                                    <FormControl>
                                        <Input {...field} className={`w-[${inputWidth}] ${inputHeight}`} />
                                    </FormControl>
                                    {field.value && field.value?.length > 0 &&
                                        <Button
                                            type="button"
                                            variant='ghost'
                                            className={`absolute right-0 top-[50%] -translate-y-[50%] ${inputHeight}`}
                                            onClick={() => resetField(field.name)}
                                        >
                                            <RxCross2 size={18} />
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
                            <div className={`flex items-center gap-2 w-fit ${inputHeight}`}>
                                <FormLabel id='brand'>Marca</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input {...field} className={`w-[${inputWidth}] ${inputHeight}`} />
                                    </FormControl>
                                    {field.value && field.value?.length > 0 &&
                                        <Button
                                            type="button"
                                            variant='ghost'
                                            className={`absolute right-0 top-[50%] -translate-y-[50%] ${inputHeight}`}
                                            onClick={() => resetField(field.name)}
                                        >
                                            <RxCross2 size={18} />
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
                    className={`flex gap-1 px-5 !w-fit ${inputHeight}`}
                    disabled={isDisabled}
                >
                    <FiSearch size={20} />
                    Buscar
                </Button>
            </form>
        </FormProvider >
    )
}