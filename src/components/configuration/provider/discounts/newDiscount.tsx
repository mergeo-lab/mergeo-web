import ClientCuitList from "@/components/configuration/provider/discounts/clientsCuitList";
import ClientFinder from "@/components/configuration/provider/discounts/clientFinder";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDiscountList, updateDiscountList } from "@/lib/discounts";
import { CompanySchemaType } from "@/lib/schemas";
import { DiscountFormSchema, DiscountFormSchemaType, DiscountSchemaType } from "@/lib/schemas/discounts.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdOutlineDiscount } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Props = {
    openit?: boolean,
    onClose?: () => void,
    data?: DiscountSchemaType | null,
    isEdit?: boolean,
    itemId?: string | null,
    showOnyClients?: boolean,
    callback?: () => void,
}

export default function NewDiscount({ openit, isEdit = false, onClose, data, itemId, callback, showOnyClients = false }: Props) {
    const { account } = useAuth();
    const companyId = account?.company.id || '';
    const [selectedCompanies, setSelectedCompanies] = useState<CompanySchemaType[]>([]);
    const initialCompanyIds = useRef<number>(0);
    const mutation = useMutation({
        mutationFn: isEdit ? updateDiscountList : createDiscountList
    });

    const companiesChanged = selectedCompanies.length !== initialCompanyIds.current;

    const form = useForm<DiscountFormSchemaType>({
        resolver: zodResolver(DiscountFormSchema),
        disabled: mutation.isPending,
        defaultValues: {
            name: "",
            description: "",
            discount: 0,
        },
    })

    async function onSubmit(data: DiscountSchemaType) {
        const companiesId = selectedCompanies.map(c => c.id) || []
        if (isEdit) {
            if (!itemId) return;
            await mutation.mutateAsync({ id: itemId, body: data, companies: companiesId });
        } else {
            console.log('agregandp lista con data : ', data)
            await mutation.mutateAsync({ id: companyId, body: data, companies: companiesId });
        }
    }

    function addCompany(company: CompanySchemaType) {
        const exists = selectedCompanies.find(c => c.id === company.id);
        if (!exists) {
            setSelectedCompanies(prev => [...prev, company]);
        }
    }

    function removeClient(id: string) {
        setSelectedCompanies(prev => prev.filter(c => c.id !== id));
    }

    useEffect(() => {
        if (mutation.isSuccess) {
            callback && callback()
            onClose?.();
            form.reset();
            mutation.reset();
            setSelectedCompanies([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mutation.isSuccess])

    useEffect(() => {
        console.log('openit', openit);
        if (isEdit && data) {
            const { id, ...formData } = data; // Remove id before resetting form
            form.reset(formData); // reset form when data changes
            if (data.companies && Array.isArray(data.companies)) {
                setSelectedCompanies(data.companies);
                initialCompanyIds.current = data.companies.length;
            }
        } else if (!isEdit) {
            form.reset({
                name: '',
                description: '',
                discount: 0,
            });
            setSelectedCompanies([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openit, isEdit]);

    return (
        <Dialog open={openit} onOpenChange={(open) => !open && onClose?.()}>
            {openit && (
                <DialogContent showClose={false} onInteractOutside={(e) => e.preventDefault()} className={cn({ "w-[600px]": showOnyClients })}>
                    {mutation.isPending && <OverlayLoadingIndicator />}
                    <DialogHeader className="border-b-[1px] border-border">
                        <DialogTitle className="text-md flex items-center gap-2 p-4">
                            <MdOutlineDiscount size={30} />
                            {showOnyClients ? 'Agregar o sacar clientes' : data ? 'Editar lista de descuentos' : "Nueva lista de descuentos"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col">
                        <FormProvider {...form}>
                            <form>
                                <div className={cn("flex gap-6 p-10 pt-2")} >
                                    <div className={cn("flex flex-col gap-4 pb-5 w-1/2", { "hidden": showOnyClients })}>

                                        <div className="h-fit space-y-4 ">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel id='name'>Nombre</FormLabel>
                                                        <FormControl>
                                                            <Input{...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="discount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel id="discount">Descuento</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center space-x-4">
                                                                <Input
                                                                    type="number"
                                                                    value={field.value || ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        if (val.length <= 3 && Number(val) <= 100) {
                                                                            field.onChange(Number(val));
                                                                        }
                                                                    }}
                                                                    maxLength={3}
                                                                />
                                                                <span className="text-right w-10">{field.value ?? 0}%</span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel id='description'>Descripción</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} cols={10} className="resize-none" rows={4} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>


                                    </div>
                                    <div className={cn("border border-border rounded-md p-4 w-1/2", { "w-full min-h-[300px]": showOnyClients })}>
                                        <ClientFinder onCompanyAdded={(company) => addCompany(company)} />
                                        <div className="px-4">
                                            <ClientCuitList companies={selectedCompanies} onClickRemove={removeClient} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end p-3 w-full">
                                    <div className="w-1/2 flex gap-2">
                                        <Button type="button" variant="secondary" className="w-1/2" onClick={() => onClose?.()}>Cancelar</Button>
                                        <Button
                                            type="button"
                                            onClick={() => form.handleSubmit(onSubmit)()}
                                            disabled={!(form.formState.isDirty || companiesChanged)}
                                            className="w-1/2"
                                        >
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </div>

                </DialogContent>
            )
            }
        </Dialog >
    );
}
