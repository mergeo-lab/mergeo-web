import { EditBranch } from "@/components/configuration/branches/editBranch"
import { NewBranch } from "@/components/configuration/branches/newBranch"
import LoadingIndicator from "@/components/loadingIndicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getBranches } from "@/lib/configuration/branch"
import { BranchesSchemaType } from "@/lib/configuration/schemas"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState, useCallback, useMemo } from "react"

type Props = {
    companyId: string | undefined,
    isEditing: boolean
    className?: string,
    notFoundMessage?: string,
    newBranch?: {
        title?: string,
        subTitle?: string,
        icon?: JSX.Element,
    },
    onLoading?: () => void,
    callback?: () => void,
}

type EditBranch = {
    branchData: BranchesSchemaType | null,
    isOpen: boolean,
}

export function BranchPicker({ className, companyId, isEditing, notFoundMessage, newBranch, onLoading, callback }: Props) {
    const [editBranch, setEditBranch] = useState<EditBranch>({ branchData: null, isOpen: false });

    const { data: branchesResult, isLoading, isError, refetch } = useQuery({
        queryKey: ['branches', companyId],
        queryFn: () => companyId ? getBranches({ companyId }) : Promise.reject(new Error('Company ID is undefined')),
    })
    const branches = branchesResult?.data?.company?.branches;

    const handleEditBranch = async (branch: BranchesSchemaType) => {
        setEditBranch({ branchData: branch, isOpen: true });
    }

    if (isError) {
        return (
            <>
                <p>Algo salio mal vuelve a intentarlo</p>
                <Button onClick={() => refetch()}>Volver a intentat</Button>
            </>
        )
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const branchAdded = useCallback(async () => {
        await refetch();
        callback && callback();
    }, [callback, refetch]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const branchEdited = useCallback(async () => {
        setEditBranch({ branchData: null, isOpen: false })
        await refetch();
        callback && callback();
    }, [callback, refetch]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleOnClose = useCallback(() => {
        setEditBranch({ branchData: null, isOpen: false });
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleOnLoading = useCallback(() => {
        onLoading && onLoading();
    }, [onLoading]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const memoTriggerButton = useMemo(() => (
        <Button className="w-8 h-8 absolute right-1 -top-1 flex justify-center items-center p-0">
            <Plus size={15} className="text-white" />
        </Button>
    ), []);

    return (
        <div className={className}>
            <ScrollArea className="h-auto max-h-[150px] min-h-10 w-full rounded border border-input bg-background p-2 relative">
                {isLoading
                    ?
                    <LoadingIndicator />
                    :
                    <div className="flex flex-wrap gap-1 items-center">
                        {
                            branches && branches.length > 0 ?
                                branches.map((branch: BranchesSchemaType) => (
                                    <Badge
                                        key={branch.id}
                                        variant="outline"
                                        onClick={() => branch.id && handleEditBranch(branch)}
                                        className="hover:bg-slate-200 cursor-pointer"
                                    >
                                        <span className="flex gap-2 items-center text-sm">
                                            {branch.name}
                                        </span>
                                    </Badge>
                                ))
                                : <p className="text-sm font-base mt-1 w-full text-center">
                                    {isEditing
                                        ? <span className="flex justify-center gap-1 items-center">Click <span className="font-bold text-lg">+</span> para agregar una sucursal</span>
                                        : notFoundMessage ? notFoundMessage : 'No tienes sucursales'
                                    }
                                </p>
                        }
                        {isEditing && companyId &&
                            <NewBranch
                                title={newBranch?.title}
                                subTitle={newBranch?.subTitle}
                                icon={newBranch?.icon}
                                companyId={companyId}
                                triggerButton={memoTriggerButton}
                                callback={branchAdded}
                                onLoading={handleOnLoading}
                            />
                        }
                    </div>
                }

            </ScrollArea >
            {companyId &&
                <EditBranch
                    title={isEditing ? "Editar sucursal" : 'Ver sucursal'}
                    subTitle={`Aquí puedes ${!isEditing ? 'ver los detalles' : 'editar los datos'} de la sucursal`}
                    companyId={companyId}
                    isOpen={editBranch.isOpen}
                    isEditing={isEditing}
                    branchData={editBranch.branchData && editBranch.branchData}
                    callback={branchEdited}
                    onClose={handleOnClose}
                    onLoading={handleOnLoading}
                />
            }
        </div>
    )
}