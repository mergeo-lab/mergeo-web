
import { DropZoneSheet } from "@/components/configuration/provider/dropZone/dropZoneSheet"
import { NewPickUpPoint } from "@/components/configuration/pickUp/newPickUpPoint"
import LoadingIndicator from "@/components/loadingIndicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getDropZones } from "@/lib/configuration/dropZone"
import { DropZoneSchemaType } from "@/lib/configuration/schemas/dropZone.schemas"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

type Props = {
    companyId: string | undefined,
    isEditing: boolean
    className?: string,
    notFoundMessage?: string,
    newEntry: {
        title: string,
        subTitle: string,
        icon: JSX.Element
    },
    onLoading?: () => void,
    callback?: () => void,
}

type EditEntry = {
    entryData: DropZoneSchemaType | null,
    isOpen: boolean,
}

export function DropZonePicker({ className, companyId, isEditing, notFoundMessage, newEntry, onLoading, callback }: Props) {
    const [editEntry, setEditEntry] = useState<EditEntry>({ entryData: null, isOpen: false });

    const { data: dropZonesListData, isLoading, isError, refetch } = useQuery({
        queryKey: ['dropZones', companyId],
        queryFn: () => companyId ? getDropZones({ companyId }) : Promise.reject(new Error('Company ID is undefined')),
    })
    const dropZones = dropZonesListData?.data;
    console.log("pickUpPoints", NewPickUpPoint)
    const handleEditPickUp = async (pickUp: DropZoneSchemaType) => {
        setEditEntry({ entryData: pickUp, isOpen: true });
    }

    if (isError) {
        return (
            <div className="h-auto max-h-[150px] min-h-10 w-full rounded border border-input bg-background p-2 relative flex justify-between items-center">
                <p className="text-sm text-destructive ml-5">Algo salio mal vuelve a intentarlo</p>
                <Button type="button" size="xs" onClick={() => refetch()}>Volver a intentar</Button>
            </div>
        )
    }

    async function actionEnded() {
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
                            dropZones && dropZones.length > 0 ?
                                dropZones.map((dropZone: DropZoneSchemaType) => (
                                    <Badge
                                        key={dropZone.id}
                                        variant="outline"
                                        onClick={() => dropZone.id && handleEditPickUp(dropZone)}
                                        className="hover:bg-slate-200 cursor-pointer"
                                    >
                                        <span className="flex gap-2 items-center text-sm">
                                            {dropZone.name}
                                        </span>
                                    </Badge>
                                ))
                                : <p className="text-sm font-base mt-1 w-full text-center">
                                    {notFoundMessage ? notFoundMessage : 'No tienes zonas de entrega'}
                                </p>
                        }
                    </div>
                }

            </ScrollArea >

            {companyId &&
                <DropZoneSheet
                    title={newEntry.title}
                    subTitle={newEntry.subTitle}
                    icon={newEntry.icon}
                    triggerButton={
                        <Button disabled={!isEditing} className="px-5 w-full" type="button" size='sm'>Zonas de Entrega</Button>
                    }
                    companyId={companyId}
                    isEditing={isEditing}
                    callback={actionEnded}
                    onLoading={() => onLoading && onLoading()}
                />
            }
            {/* {companyId &&
                <EditPickUp
                    title={isEditing ? "Editar sucursal" : 'Ver sucursal'}
                    subTitle={`Aquí puedes ${!isEditing ? 'ver los detalles' : 'editar los datos'} de la sucursal`}
                    companyId={companyId}
                    isOpen={editEntry.isOpen}
                    isEditing={isEditing}
                    pickUpData={editEntry.entryData && editEntry.entryData}
                    callback={pickUpEdited}
                    onClose={() => setEditEntry({ entryData: null, isOpen: false })}
                    onLoading={() => onLoading && onLoading()}
                />
            } */}
        </div>
    )
}