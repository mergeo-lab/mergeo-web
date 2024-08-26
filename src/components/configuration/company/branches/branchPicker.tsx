
import { NewBranch } from "@/components/configuration/company/branches/newBranch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getBranches } from "@/lib/configuration/branch"
import { BranchesSchemaType } from "@/lib/configuration/schemas"
import { useQuery } from "@tanstack/react-query"
import { CircleX } from "lucide-react"
import { useState } from "react"

type Props = {
    companyId: string,
    className?: string,
}

export function BranchPicker({ className, companyId }: Props) {
    const [lastAddedBranchId, setLastAddedBranchId] = useState<string | undefined>(undefined);
    const { data: branchesResult, isLoading, isError, refetch } = useQuery({
        queryKey: ['branches', companyId, lastAddedBranchId],
        queryFn: () => getBranches({ companyId }),
    })
    const branches = branchesResult?.data?.company?.branches;

    const editBranch = async (branchId: string) => {
        console.log(branchId);
    }

    if (isError) {
        return (
            <>
                <p>Algo salio mal vuelve a intentarlo</p>
                <Button onClick={() => refetch()}>Volver a intentat</Button>
            </>
        )
    }

    return (
        <div className={className}>
            <ScrollArea className="h-auto max-h-[150px] min-h-10 w-full rounded border border-input bg-background p-2">
                {isLoading && <p className="text-sm font-bold mt-1 w-full text-center">Cargando...</p>}
                <div className="flex flex-wrap gap-1 items-center">
                    {
                        branches && branches.length > 0 ?
                            branches.map((branch: BranchesSchemaType) => (
                                <Badge
                                    key={branch.id}
                                    variant="outline"
                                >
                                    <span className="flex gap-2 items-center">
                                        {branch.name}
                                        <CircleX
                                            size={18}
                                            className="z-10 cursor-pointer"
                                            onClick={() => branch.id && editBranch(branch.id)}
                                        />
                                    </span>
                                </Badge>
                            ))
                            : <p className="text-sm font-bold mt-1 w-full text-center">No tienes sucursales</p>
                    }
                </div>
            </ScrollArea >
            <NewBranch
                companyId={companyId}
                triggerButton={<Button className="w-full">Nueva sucursal</Button>}
                callback={(data: BranchesSchemaType) => setLastAddedBranchId(data.id)}
            />
        </div>
    )
}