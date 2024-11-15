/* eslint-disable react-hooks/exhaustive-deps */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBranches } from "@/lib/configuration/branch";
import { BranchesSchemaType } from "@/lib/schemas";
import UseCompanyStore from "@/store/company.store";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function BranchSlector({ defaultValue, onChange }: { defaultValue: string, onChange: (value: BranchesSchemaType) => void }) {

    const { company } = UseCompanyStore();
    const [selectedOption, setselectedOption] = useState();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['brnachs', company?.id],
        queryFn: ({ queryKey }) => {
            const companyId = queryKey[1];
            if (!companyId) {
                // Return a rejected promise if companyId is undefined
                return Promise.reject(new Error('Company ID is undefined'));
            }
            return getBranches({ companyId });
        },
        enabled: !!company?.id, // Ensure the query runs only if company ID exists
    });

    const onItemSelected = useCallback((value: string) => {
        if (!value) return;
        setselectedOption(value);
        const selectedBranch = data?.data?.company.branches.find((item: BranchesSchemaType) => item.id === value);
        if (selectedBranch) {
            onChange(selectedBranch);
        }
    }, [data, onChange]);

    useEffect(() => {
        if (defaultValue) {
            onItemSelected(defaultValue || '');
        }
    }, [defaultValue])

    if (isLoading || !data) return (
        <Select>
            <SelectTrigger disabled>
                <SelectValue placeholder="Buscando sucursales..." />
            </SelectTrigger>
        </Select>
    )

    if (data) {
        return (
            <>
                <Select onValueChange={onItemSelected} value={selectedOption}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                        {isError && <div className="text-center">Error al buscar sucursales</div>}
                        {isLoading && <div className="text-center">Buscando Sucursales...</div>}
                        {data && data.data?.company?.branches.map((item: BranchesSchemaType) => (
                            <SelectItem key={item.id} value={item.id || ''}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </>
        )
    }
}