import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBranches } from "@/lib/configuration/branch";
import { BranchesSchemaType } from "@/lib/schemas";
import UseCompanyStore from "@/store/company.store";
import { useQuery } from "@tanstack/react-query";

export function BranchSlector({ onChange }: { onChange: (value: BranchesSchemaType) => void }) {

    const { company } = UseCompanyStore();

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

    function onItmeSelected(value: string) {
        if (!value) return;
        const selectedBranch = (data?.data?.company.branches.find((item: BranchesSchemaType) => item.id === value));
        if (!selectedBranch) return;
        onChange(selectedBranch);
    }

    return (
        <Select onValueChange={onItmeSelected}>
            <SelectTrigger>
                <SelectValue placeholder="Seleccione una sucursal" />
            </SelectTrigger>
            <SelectContent>
                {isError && <div className="text-center">Error al buscar sucursales</div>}
                {isLoading && <div className="text-center">Buscando Sucursales...</div>}
                <SelectGroup>
                    {data && data.data?.company?.branches.map((item: BranchesSchemaType) => (
                        <SelectItem key={item.id} value={item.id || ''}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}