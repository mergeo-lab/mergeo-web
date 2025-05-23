import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import { useFormContext } from "react-hook-form";
import { HTMLInputTypeAttribute } from "react";
import { useProviderProductSearchStore } from "@/store/providerProductSearch.store";

type Props = {
    name: "name" | "brand" | "ean"; // could be generic if needed
    label: string;
    inputType?: HTMLInputTypeAttribute;
    className?: string;
    companyId: string;
};

export default function CustomSearchField({ name, label, inputType = "text", className, companyId }: Props) {
    const form = useFormContext();
    const { resetParams, setParams } = useProviderProductSearchStore();
    const value = form.watch(name);

    const handleReset = () => {
        form.setValue(name, "");

        // Ensure value is cleared before calling store actions
        setTimeout(() => {
            const { name: n, brand, ean } = form.getValues();
            if (!n && !brand && !ean) {
                resetParams();
            } else {
                setParams({ name: n, brand, ean, companyId });
            }
        }, 0);
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <div className="flex items-center gap-2 w-full">
                        <FormLabel className="text-nowrap" htmlFor={name}>{label}</FormLabel>
                        <div className="relative w-full">
                            <FormControl>
                                <Input {...field} type={inputType} className="w-full pr-14" />
                            </FormControl>
                            {value && value.length > 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute right-0 top-[50%] -translate-y-[50%]"
                                    onClick={handleReset}
                                >
                                    <RxCross2 size={20} strokeWidth={3} />
                                </Button>
                            )}
                        </div>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
}
