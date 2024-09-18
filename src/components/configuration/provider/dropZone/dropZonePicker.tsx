
import { DropZoneSheet } from "@/components/configuration/provider/dropZone/dropZoneSheet"
import LoadingIndicator from "@/components/loadingIndicator"
import { Button } from "@/components/ui/button"
import { getDropZones } from "@/lib/configuration/dropZone"
import { IncomingDropZoneSchemaType } from "@/lib/configuration/schemas/dropZone.schemas"
import { useQuery } from "@tanstack/react-query"
import { MapPinned } from "lucide-react"

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
}

export function DropZonePicker({ className, companyId, newEntry }: Props) {

    const { data: dropZonesListData, isFetching, isError, refetch } = useQuery({
        queryKey: ['dropZones', companyId],
        queryFn: () => companyId ? getDropZones({ companyId }) : Promise.reject(new Error('Company ID is undefined')),
    })
    const dropZones: IncomingDropZoneSchemaType[] = dropZonesListData || [];

    if (isError) {
        return (
            <div className="h-auto max-h-[150px] min-h-10 w-full rounded border border-input bg-background p-2 relative flex justify-between items-center">
                <p className="text-sm text-destructive ml-5">Algo salio mal vuelve a intentarlo</p>
                <Button type="button" size="xs" onClick={() => refetch()}>Volver a intentar</Button>
            </div>
        )
    }

    return (
        <div className={className}>
            {companyId &&
                <DropZoneSheet
                    zones={dropZones && dropZones}
                    title={newEntry.title}
                    subTitle={newEntry.subTitle}
                    icon={newEntry.icon}
                    triggerButton={
                        <Button className="px-5 w-full" type="button" size='sm'>
                            {isFetching
                                ? <LoadingIndicator />
                                : <span className="flex items-center gap-2">
                                    <MapPinned size={20} />
                                    <p>Ver Zonas de Entrega</p>
                                </span>
                            }
                        </Button>
                    }
                    companyId={companyId}
                    isLoadingProp={isFetching}
                    fetchZones={() => refetch()}
                />
            }
        </div>
    )
}