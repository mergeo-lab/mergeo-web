import ClientCuitList from "@/components/configuration/provider/discounts/clientsCuitList";
import ClientFinder from "@/components/configuration/provider/discounts/clientFinder";
import OverlayLoadingIndicator from "@/components/overlayLoadingIndicator";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { createDiscountList, updateDiscountList } from "@/lib/discounts";
import { CompanySchemaType } from "@/lib/schemas";
import { DiscountFormSchema, DiscountFormSchemaType, DiscountSchemaType } from "@/lib/schemas/discounts.schema";
import UseCompanyStore from "@/store/company.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdOutlineDiscount } from "react-icons/md";

type Props = {
    openit?: boolean,
    onClose?: () => void,
    data?: DiscountSchemaType | null,
    isEdit?: boolean,
    itemId?: string | null,
    callback?: () => void,
}

export default function NewDiscount({ openit = false, isEdit = false, onClose, data, itemId, callback }: Props) {
    const { getCompanyId } = UseCompanyStore();
    const companyId = getCompanyId();
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
            await mutation.mutateAsync({ id: itemId!, body: data, companies: companiesId });
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
    }, [mutation.isSuccess])

    useEffect(() => {
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
    }, [openit, isEdit]);

    return (
        <Dialog open={openit} onOpenChange={(open) => !open && onClose?.()}>
            {openit && (
                <DialogContent showClose={false} onInteractOutside={(e) => e.preventDefault()}>
                    {mutation.isPending && <OverlayLoadingIndicator />}
                    <DialogHeader className="border-b-[1px] border-border">
                        <DialogTitle className="text-md flex items-center gap-2 p-4">
                            <MdOutlineDiscount size={30} />
                            {data ? 'Editar lista de descuentos' : "Nueva lista de descuentos"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col">
                        <FormProvider {...form}>
                            <form>
                                <div className="flex gap-6 p-10 pt-2">
                                    <div className="flex flex-col gap-4 pb-5 w-1/2">

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
                                            <div className="border border-border rounded-md p-4">
                                                <FormField
                                                    control={form.control}
                                                    name="discount"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel id="discount">Descuento</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center space-x-4">
                                                                    <Slider
                                                                        max={100}
                                                                        min={0}
                                                                        step={1}
                                                                        value={[field.value || 0]}
                                                                        onValueChange={(val) => field.onChange(val[0])}
                                                                    />
                                                                    <span className="text-right w-10">{field.value ?? 0}%</span>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
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
                                    <div className="border border-border rounded-md p-4 w-1/2">
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
            )}
        </Dialog>
    );
}
