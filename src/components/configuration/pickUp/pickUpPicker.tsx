
import { EditPickUp } from "@/components/configuration/pickUp/editPickUpPoint"
import { NewPickUpPoint } from "@/components/configuration/pickUp/newPickUpPoint"
import LoadingIndicator from "@/components/loadingIndicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPickUpPoints } from "@/lib/configuration/pickUp"
import { PickUpSchemaType } from "@/lib/configuration/schemas/pickUp.schema"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"

type Props = {
    companyId: string | undefined,
    isEditing: boolean
    className?: string,
    notFoundMessage?: string,
    newEntry?: {
        title?: string,
        subTitle?: string,
        icon?: JSX.Element,
    },
    onLoading?: () => void,
    callback?: () => void,
}

type EditEntry = {
    entryData: PickUpSchemaType | null,
    isOpen: boolean,
}

export function PickUpPicker({ className, companyId, isEditing, notFoundMessage, newEntry, onLoading, callback }: Props) {
    const [editEntry, setEditEntry] = useState<EditEntry>({ entryData: null, isOpen: false });

    const { data: pickUpResult, isLoading, isError, refetch } = useQuery({
        queryKey: ['branches', companyId],
        queryFn: () => companyId ? getPickUpPoints({ companyId }) : Promise.reject(new Error('Company ID is undefined')),
    })
    const pickUpPoints = pickUpResult?.data;
    console.log("pickUpPoints", pickUpPoints)
    const handleEditPickUp = async (pickUp: PickUpSchemaType) => {
        setEditEntry({ entryData: pickUp, isOpen: true });
    }

    if (isError) {
        return (
            <>
                <p>Algo salio mal vuelve a intentarlo</p>
                <Button onClick={() => refetch()}>Volver a intentat</Button>
            </>
        )
    }

    async function pickUpAdded() {
        await refetch();
        callback && callback();
    }

    async function pickUpEdited() {
        setEditEntry({ entryData: null, isOpen: false })
        await refetch();
        callback && callback();
    }

    return (
        <div className={className}>
            <ScrollArea className="h-auto max-h-[150px] min-h-10 w-full rounded border border-input bg-background p-2 relative">
                {isLoading
                    ?
                    <LoadingIndicator />
                    :
                    <div className="flex flex-wrap gap-1 items-center">
                        {
                            pickUpPoints && pickUpPoints.length > 0 ?
                                pickUpPoints.map((pickUp: PickUpSchemaType) => (
                                    <Badge
                                        key={pickUp.id}
                                        variant="outline"
                                        onClick={() => pickUp.id && handleEditPickUp(pickUp)}
                                        className="hover:bg-slate-200 cursor-pointer"
                                    >
                                        <span className="flex gap-2 items-center text-sm">
                                            {pickUp.name}
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
                            <NewPickUpPoint
                                title={newEntry?.title}
                                subTitle={newEntry?.subTitle}
                                icon={newEntry?.icon}
                                companyId={companyId}
                                triggerButton={
                                    <Button className="w-8 h-8 absolute right-1 -top-1 flex justify-center items-center p-0">
                                        <Plus size={15} className="text-white" />
                                    </Button>
                                }
                                callback={pickUpAdded}
                                onLoading={() => onLoading && onLoading()}
                            />
                        }
                    </div>
                }

            </ScrollArea >
            {companyId &&
                <EditPickUp
                    title={isEditing ? "Editar punto de PickUp" : 'Ver punto de PickUp'}
                    subTitle={`Aquí puedes ${!isEditing ? 'ver los detalles' : 'editar los datos'} del punto de PickUp`}
                    companyId={companyId}
                    isOpen={editEntry.isOpen}
                    isEditing={isEditing}
                    pickUpData={editEntry.entryData && editEntry.entryData}
                    callback={pickUpEdited}
                    onClose={() => setEditEntry({ entryData: null, isOpen: false })}
                    onLoading={() => onLoading && onLoading()}
                />
            }
        </div>
    )
}