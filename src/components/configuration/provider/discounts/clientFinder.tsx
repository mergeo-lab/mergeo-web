import LoadingIndicator from "@/components/loadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchClientByCuit } from "@/lib/configuration/company";
import { CompanySchemaType } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { z } from "zod";

const ClientSchema = z.object({
    cuit: z.string().min(11, "El CUIT debe tener 11 dígitos"),
});
type ClientSchemaType = z.infer<typeof ClientSchema>;

type Props = {
    onCompanyAdded: (company: CompanySchemaType) => void;
};

export default function ClientFinder({ onCompanyAdded }: Props) {
    const [selectedItem, setSelectedItem] = useState<CompanySchemaType | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const mutation = useMutation({
        mutationFn: searchClientByCuit,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm<ClientSchemaType>({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            cuit: "",
        },
    });

    const cuitValue = watch("cuit");

    async function onSubmit(fields: ClientSchemaType) {
        setErrorMsg("");
        await mutation.mutateAsync(fields.cuit);
    }

    function handleReset() {
        setValue("cuit", "");
        setSelectedItem(null);
        setErrorMsg("");
        mutation.reset();
    }

    function handleSelectCompany() {
        if (selectedItem) {
            onCompanyAdded(selectedItem);
            setSelectedItem(null);
            reset();
            mutation.reset();
        }
    }

    useEffect(() => {
        if (mutation.isSuccess) {
            setSelectedItem(mutation.data);
        } else if (mutation.isError) {
            setSelectedItem(null);
            setErrorMsg(mutation.error.message);
        }
    }, [mutation.isSuccess, mutation.isError]);

    return (
        <div className="mb-2">
            <div className="w-full pl-2">
                <Label>Agregar clientes a la lista</Label>
            </div>

            <div className={cn("mt-1 p-1 flex w-full items-start gap-2")}>
                <div className="relative w-full flex flex-col gap-1">
                    <Input
                        maxLength={11}
                        placeholder="número de CUIT"
                        {...register("cuit")}
                    />
                    {cuitValue && (
                        <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-0 top-[50%] -translate-y-[50%]"
                            onClick={handleReset}
                        >
                            <RxCross2 size={20} />
                        </Button>
                    )}
                </div>

                <Button
                    type="button"
                    className="flex gap-2 px-5"
                    disabled={mutation.isPending}
                    onClick={() => handleSubmit(onSubmit)()}
                >
                    <FiSearch size={18} />
                    Buscar
                </Button>
            </div>
            {errors.cuit && (
                <div className="w-full pl-4">
                    <p className="text-sm text-destructive">{errors.cuit.message}</p>
                </div>
            )}

            {mutation.isPending && (
                <div className="h-fit px-5 py-2 shadow rounded-sm flex justify-between items-center">
                    <LoadingIndicator />
                </div>
            )}

            {selectedItem && (
                <div className="h-fit px-5 py-2 shadow rounded-sm flex justify-between items-center">
                    <div className="flex flex-col w-full text-sm">
                        <div>Nombre: {selectedItem.name}</div>
                        <div>Razón Social: {selectedItem.razonSocial}</div>
                        <div>CUIT: {selectedItem.cuit}</div>
                    </div>
                    <Button type="button" variant="outlineSecondary" onClick={handleSelectCompany}>
                        Agregar
                    </Button>
                </div>
            )}

            {errorMsg && (
                <div className="h-fit px-5 py-2 shadow rounded-sm flex justify-between items-center">
                    <div className="text-sm text-destructive pl-4">{errorMsg}</div>
                </div>
            )}
        </div>
    );
}
