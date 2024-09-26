import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchListProductSchema, SearchListProductType } from "@/lib/searchLists/searchLists.schemas";
import UseSearchProductStore from "@/store/searchProduct.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormSchemaType = Omit<SearchListProductType, 'id'>

type Props = {
    disabled: boolean | null,
    setIsFormValid: (isFormValid: boolean) => void,
    isFormValid: boolean
}

export default function AddSearchProduct({ disabled, setIsFormValid, isFormValid }: Props) {
    const { addProduct } = UseSearchProductStore();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(SearchListProductSchema),
        disabled: disabled || false,
        defaultValues: {
            name: '',
            category: '',
        },
    })

    const formValues = form.watch();

    useEffect(() => {
        if (formValues.name && formValues.category) {
            setIsFormValid(true);
        } else setIsFormValid(false);
    }, [formValues]);

    function handleAddProduct() {
        const fields = form.getValues();
        const product = { id: crypto.randomUUID(), name: fields.name, category: fields.category }
        if (!product.name) return
        addProduct(product);
        setIsFormValid(false);
        form.reset();
    }

    return (
        <FormProvider {...form}>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel id='name'>Producto</FormLabel>
                            <FormControl>
                                <Input className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel id='category'>Categoria</FormLabel>
                            <FormControl>
                                <Input className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex justify-end mt-4">
                <Button disabled={!isFormValid} onClick={handleAddProduct} type="submit">Agregar producto</Button>
            </div>
        </FormProvider>
    )
}
