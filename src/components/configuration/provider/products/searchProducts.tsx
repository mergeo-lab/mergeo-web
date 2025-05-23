import { Button } from "@/components/ui/button";
import { UseNewProductSearch } from "@/hooks/useNewProductSearch";
import { ProviderProductSearch, ProviderProductSearchType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useProviderProductSearchStore } from "@/store/providerProductSearch.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { ReactNode } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";

type Props = {
    companyId: string;
    className?: string;
    children?: ReactNode; // 👈 custom fields passed as children
};

export default function SearchProducts({ companyId, className, children }: Props) {
    const { isLoading } = UseNewProductSearch();
    const { setParams, resetParams } = useProviderProductSearchStore();

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
            resetParams();
        } else {
            try {
                await setParams({ name, brand, ean, companyId });
            } catch (error) {
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
                    <Search />
                    Buscar
                </Button>
            </form>
        </FormProvider>
    );
}
