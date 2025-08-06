import { Button } from "@/components/ui/button";
import { UseNewProductSearch } from "@/hooks/useNewProductSearch";
import { ProviderProductSearch, ProviderProductSearchType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useProviderProductSearchStore } from "@/store/providerProductSearch.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";

type Props = {
    companyId: string;
    className?: string;
    children?: ReactNode; // 👈 custom fields passed as children
};

export default function SearchProducts({ companyId, className, children }: Props) {
    const { isLoading } = UseNewProductSearch();
    const { setParams } = useProviderProductSearchStore();

    const form = useForm<ProviderProductSearchType>({
        resolver: zodResolver(ProviderProductSearch) as Resolver<ProviderProductSearchType>,
        disabled: isLoading,
        defaultValues: {
            name: "",
            brand: "",
            ean: "",
        },
    });

    const { name, brand, ean } = form.watch();
    const isDisabled = !name && !brand && !ean;

    async function onSubmit(fields: ProviderProductSearchType) {
        const { name, brand, ean } = fields;

        if (!name && !brand && !ean) {
            // When all fields are empty, fetch all products for the company
            setParams({ companyId, showOnlyInactive: false });
        } else {
            try {
                await setParams({ name, brand, ean, companyId, showOnlyInactive: false });
            } catch {
                form.clearErrors();
                form.reset(fields, {
                    keepValues: true,
                    keepDirty: true,
                });
            }
        }
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("mt-5 p-2 flex flex-wrap items-end gap-5", className)}
            >
                {children}
                <Button type="submit" className="flex gap-3 px-10" disabled={isDisabled}>
                    <FiSearch size={20} />
                    Buscar
                </Button>
            </form>
        </FormProvider>
    );
}
