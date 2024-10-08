import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { SearchListSchema, SearchListType } from "@/lib/searchLists/searchLists.schemas";
import UseCompanyStore from "@/store/company.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FileUp, ScrollText, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AddSearchProduct from "@/components/configuration/client/searchLists/addSearchProduct";
import SearchProductsTable from "@/components/configuration/client/searchLists/searchProductsTable";
import UseSearchProductStore from "@/store/searchProduct.store";
import { addProductsToList, newSearchList, uploadSearchListFile } from "@/lib/searchLists/searchLists";
import UseUserStore from "@/store/user.store";

type FormSchemaType = Omit<SearchListType, 'id'>

type Props = {
    title?: string,
    subTitle?: string,
    buttonText?: string,
    icon?: JSX.Element,
    list?: {
        id: string | null,
        name: string | null,
    }
    onLoading: () => void
    callback: () => void
    triggerButton?: React.ReactNode
}

export function AddSearchList({
    title = "Agregar una Lista nueva",
    subTitle = "Agregue una nueva lista de búsqueda para agilizar sus compras",
    buttonText = "Crear Lista",
    icon = <ScrollText size={20} />,
    list,
    onLoading,
    callback,
    triggerButton }: Props) {
    const { removeAllProducts, products, removeProduct } = UseSearchProductStore();
    const { company } = UseCompanyStore();
    const { user } = UseUserStore();
    const mutation = useMutation({ mutationFn: newSearchList })
    const addProductsMutation = useMutation({ mutationFn: addProductsToList })
    const fileLoadMutation = useMutation({ mutationFn: uploadSearchListFile })
    const [open, setOpen] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(SearchListSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: list && list.name ? list.name : "",
            products: [],
        },
    })
    const formValues = form.watch();

    useEffect(() => {
        form.setValue("products", products);
    }, [form, products]);

    useEffect(() => {
        if (mutation.isPending || addProductsMutation.isPending || fileLoadMutation.isPending) onLoading();
    }, [onLoading, mutation.isPending, addProductsMutation.isPending, fileLoadMutation.isPending]);

    useEffect(() => {
        let isFormValid = false;
        if (list) {
            isFormValid = formValues.file && formValues.file.length > 0 || formValues.products && formValues.products.length > 0;
        } else {
            isFormValid = formValues.name && formValues.file && formValues.file.length > 0 || formValues.name && formValues.products && formValues.products.length > 0;
        }

        setCanSubmit(isFormValid);
    }, [formValues, list]);

    const closeModal = useCallback(() => {
        // Close the modal
        handleCancel();
        removeAllProducts();
        setOpen(false);
    }, []);

    const handleOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            closeModal();
        } else {
            setOpen(isOpen);
        }
    }, [closeModal]);

    async function addProductsToExistingList(id: string, fields: FormSchemaType) {
        if (fields.products && fields.products.length > 0) {
            await addProductsMutation.mutateAsync({ listId: id, body: fields.products });
            if (mutation.isError) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: mutation.error.message,
                })
            } else {
                callback();
                handleCancel();
                removeAllProducts();
                setOpen(false);
            }

        } else if (fields.file && fields.file.length > 0) {
            uploadFile(id, fields.file[0]);
        }
    }

    async function submitList() {
        const fields = form.getValues();

        // check if the list already exists and we are going to add products to it
        if (list?.id) {
            addProductsToExistingList(list?.id, fields);
            return;
        }

        if (!canSubmit && !company && !user) return;
        const userName = user?.name ?? '';

        const payload: FormSchemaType = {
            name: fields.name,
            createdBy: userName
        }
        if (fields.products) payload.products = fields.products;

        if (!company) return;
        const { data } = await mutation.mutateAsync({ companyId: company?.id, body: payload });

        if (mutation.isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: mutation.error.message,
            })
        } else {
            if (data.id && fields.file) {
                uploadFile(data.id, fields.file[0]);
            } else {
                console.log("data", data)
                callback();
                handleCancel();
                removeAllProducts();
                setOpen(false);
            }
        }
    }

    async function uploadFile(id: string, file: File) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await fileLoadMutation.mutateAsync({ listId: id, body: formData });

        if (mutation.isError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: mutation.error.message,
            })
        } else {
            console.log("data", data)
            handleCancel();
            setOpen(false);
            resetFileInput();
            removeAllProducts();
            callback();
        }
    }

    function handleCancel() {
        form.reset();
    }

    function resetFileInput() {
        form.resetField("file"); // Reset form value
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the actual input field value
        }
    }

    // Wrap the callback and onLoading functions in useCallback
    const memoizedCallback = useCallback(() => {
        callback();
    }, [callback]);

    const memoizedOnLoading = useCallback(() => {
        onLoading();
    }, [onLoading]);

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger>
                {triggerButton}
            </SheetTrigger>
            <SheetContent className="w-1/3 mx-w-1/3 sm:max-w-1/3">
                <FormProvider {...form}>
                    <SheetHeader>
                        <SheetTitle className="flex gap-2 items-center">
                            {icon}
                            {title}
                        </SheetTitle>
                        <SheetDescription>
                            {subTitle}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="h-4/5 p-10 pt-6">
                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full" hidden={list ? true : false}>
                                        <FormLabel id='name'>Nombre de la Lista</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={list ? true : false}
                                                className="w-full"
                                                {...field}
                                                value={list && list.name ? list.name : field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {list &&
                                <div className="w-full flex items-center gap-2">
                                    <span className="text-xl font-bold bg-info py-1 px-2 rounded text-white">{list && list.name && list.name}</span>
                                </div>
                            }
                        </div>

                        <div className="p-4 mt-4 border rounded">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel id='file'>Subir un archivo excel</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center justify-between relative">
                                                    <FileUp className="absolute left-3 pointer-events-none" />
                                                    <Input ref={fileInputRef}
                                                        disabled={isFormValid || products.length > 0}
                                                        className="pl-10 cursor-pointer"
                                                        type="file"
                                                        accept=".xlsx, .xls"
                                                        onChange={(e) => field.onChange(e.target.files)}
                                                    />
                                                    {field.value &&
                                                        <Button variant='ghost' className="absolute right-0"
                                                            onClick={resetFileInput}>
                                                            <X size={16} />
                                                        </Button>
                                                    }
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center">
                                <div className="border-b w-full"></div>
                                <div className="text-sm text-center text-secondary w-full my-5">o argegar a mano</div>
                                <div className="border-b w-full"></div>
                            </div>
                            <AddSearchProduct
                                disabled={fileInputRef.current && fileInputRef.current.value != ""}
                                setIsFormValid={(isFormValid) => setIsFormValid(isFormValid)}
                                isFormValid={isFormValid}
                            />
                        </div>

                        <SearchProductsTable products={products} removeProduct={removeProduct} />

                    </div>

                    <SheetFooter className="p-10 items-center">
                        <SheetClose className="w-full">
                            <Button variant="secondary" className="w-full" onClick={handleCancel}>Cancelar</Button>
                        </SheetClose>
                        <Button
                            disabled={!canSubmit}
                            onClick={() => {
                                console.log("SUBMIT BUTTON PRESSED");
                                submitList()
                            }}
                            type="submit"
                            className="w-full">
                            {buttonText}
                        </Button>
                    </SheetFooter>
                </FormProvider>
            </SheetContent>
        </Sheet >
    )
}
